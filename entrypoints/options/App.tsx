import React, { useEffect, useMemo, useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import UserProfile from "@/components/UserProfile";
import FilterControls from "@/components/FilterControls";
import "@/entrypoints/popup/style.css"
import { supabase } from "../background";
import { Session, User } from "@supabase/supabase-js";
import { InterviewQuestion, Question } from "@/types/custom";
import { Toaster } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, ChevronDown, ChevronRight, FileText, Lightbulb, PanelsRightBottomIcon, User  as U} from "lucide-react";
import { database } from "@/lib/database";

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string
  icon: any
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 text-left hover:bg-gray-800 rounded-lg transition-colors group">
        <Icon className="w-4 h-4 text-blue-400" />
        <span className="font-medium text-gray-200">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-200" />
        ) : (
          <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-200" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">{children}</CollapsibleContent>
    </Collapsible>
  )
}



const queryClient = new QueryClient();





const App = () => {

   const [selectedTopic, setSelectedTopic] = useState('All');
   const [selectedDifficulty, setSelectedDifficulty] = useState('All');
   const [user ,setUser] = useState<User | null>(null)
   const [question ,setQuestion] = useState<InterviewQuestion[]>([]);
   const [sortBy, setSortBy] = useState('name');
   const [loading, setLoading] = useState(true)
   const [filteredQuestions , setFilteredQuestions] = useState<InterviewQuestion[]>([])
   const [productLoading  , setProductLoading] = useState(false)
  // Add state for available topics
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
      useEffect(() => {
        async function fetchSession() {
          try {
            const { session } = await browser.storage.local.get('session');
            if (session) {
              const { error } = await supabase.auth.setSession(session);
              if (!error) {
                setUser(session.user);
              } else {
                console.error("Supabase session error:", error);
              }
            }
          } catch (err) {
            console.error("Session fetch error:", err);
          } finally {
            setLoading(false);
          }
        }
        fetchSession();
      }, []);

    useEffect(()=>{
      if(user?.id){
        supabase.from('questions').select("*").filter("user_id" , "eq" , user.id).then((data)=>{
          setQuestion(data.data as InterviewQuestion[])
        }).then(()=>{
          setProductLoading(false)
        })
      }
    },[user])
    // Get unique topics
    const topics = Array.from(new Set(['All', ...question.map(q => q.topics).flat()])).sort();
    const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
    const filterFunction = () => {
      let filtered = question.filter(question => {
        const topicMatch = selectedTopic === 'All' || question.topics.includes(selectedTopic);
        const difficultyMatch = selectedDifficulty === 'All' || question.difficulty === selectedDifficulty;
        return topicMatch && difficultyMatch ;
      });
      // Sort questions
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'difficulty':
            const difficultyOrder: Record<'Easy' | 'Medium' | 'Hard', number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
            return difficultyOrder[a.difficulty as 'Easy' | 'Medium' | 'Hard'] - difficultyOrder[b.difficulty as 'Easy' | 'Medium' | 'Hard'];
          case 'topic':
            return a.topics[0].localeCompare(b.topics[0]);
          default:
            return a.question_name.localeCompare(b.question_name);
        }
      });
  
      return filtered;
    }
    // Filter and sort questions
    useEffect(() => {
      setFilteredQuestions(filterFunction())
    }, [sortBy , selectedTopic , selectedDifficulty , question]);
  
     // Add function to handle creating new questions
      const handleCreateQuestion = async (questionData: Omit<InterviewQuestion, "id" | "created_at" | "updated_at">) => {
        try {
          const newQuestion = {...questionData , user_id : user?.id}
          const {data , error} = await supabase.from("questions").insert(newQuestion).select()
          if(data) setQuestion((prev) => [...prev, data[0] as InterviewQuestion])
          else console.log(error)
          // Update available topics
          const newTopics = await database.getAvailableTopics()
          setAvailableTopics(newTopics)
           console.log("Question created successfully!")
     
        } catch (error) {
          console.log(error)
          throw error
        }
      }
    
      const updateQuestion = async (id: number, field: keyof InterviewQuestion, value: any) => {
        try {
          const {data , error} = await supabase.from('questions').update({ [field]: value }).eq('id', Number(id)).select()
            if (data) {
            console.log(id , field , value , data[0].usercode) 
            setQuestion((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: data[0][field] } : q)))
            console.log( "Changes saved successfully",)
          }
          if (error) {
            console.log(error)
          }
       
        } catch (error) {
            console.log(error)
        }
      }


  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
         <div className="min-h-screen bg-[rgb(11,10,11)]">
      <div className="container mx-auto px-4 py-8">
        {/* User Profile Section */}
        <UserProfile
         name={user?.user_metadata.name || "Utkarsh Jaiswal"}
         username={user?.email || "utkarshjaiswal"}
         totalSolved={question.length}
         easyCompleted={question.filter(q => q.difficulty === 'Easy').length}
         mediumCompleted={question.filter(q => q.difficulty === 'Medium').length}
         hardCompleted={question.filter(q => q.difficulty === 'Hard').length}
         rank={question.length > 100 ? 'Expert' : question.length > 50 ? 'Intermediate' : 'Beginner'}
         favoriteTopics={topics}
        />
        <div className="flex justify-end mt-2 mb-4">
         <CreateQuestionModal onCreateQuestion={handleCreateQuestion} availableTopics={availableTopics} />
        </div>

        {/* Filter Controls */}
        <FilterControls
          topics={topics}
          difficulties={difficulties}
          selectedTopic={selectedTopic}
          selectedDifficulty={selectedDifficulty}
          sortBy={sortBy}
          onTopicChange={setSelectedTopic}
          onDifficultyChange={setSelectedDifficulty}
          onSortChange={setSortBy}
        />
      {productLoading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
          ) : 
         <div className="space-y-8">
            <Accordion type="single" collapsible className="space-y-4">
          
          { 
       
          filteredQuestions.length > 0 && filteredQuestions.map((question) => (
            <AccordionItem
              key={question.id}
              value={(question.id).toString()}
              className="border border-gray-800 rounded-lg bg-gray-900"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-800 rounded-t-lg [&[data-state=open]]:rounded-b-none">
                <div className="flex items-center gap-3 text-left w-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <EditableField
                        value={question.question_name}
                        onSave={(value) => updateQuestion(question.id, "question_name", value)}
                        className="text-lg font-semibold text-white"
                        placeholder="Question name..."
                      />
                      <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                    </div>
                    {/* Update the topics section in each accordion item to be editable */}
                    <div className="flex flex-wrap gap-2">
                      <TopicEditor
                        topics={question.topics}
                        onChange={(topics) => updateQuestion(question.id, "topics", topics)}
                        suggestions={availableTopics}
                      />
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Problem Description</h3>
                      <EditableField
                        value={question.description}
                        onSave={(value) => updateQuestion(question.id, "description", value)}
                        multiline
                        className="text-gray-300 leading-relaxed"
                        placeholder="Enter problem description..."
                      />
                    </div>

                    {/* Collapsible Sections */}
                    <div className="space-y-2">
                      <CollapsibleSection title="Your Code Template" icon={U}>
                        <div className="mt-3">
                          <EditableField
                            value={question.usercode}
                            onSave={(value) => updateQuestion(question.id, "usercode", value)}
                            multiline
                            className="font-mono text-sm"
                            renderValue={(value) => <CodeBlock code={value} />}
                            placeholder="Enter user code template..."
                          />
                        </div>
                      </CollapsibleSection>

                      <CollapsibleSection title="Solution Code" icon={CheckCircle}>
                        <div className="mt-3">
                          <EditableField
                            value={question.solution}
                            onSave={(value) => updateQuestion(question.id, "solution", value)}
                            multiline
                            className="font-mono text-sm"
                            renderValue={(value) => <CodeBlock code={value} />}
                            placeholder="Enter solution code..."
                          />
                        </div>
                      </CollapsibleSection>

                      <CollapsibleSection title="Interview Tips" icon={Lightbulb}>
                        <div className="mt-3">
                          <EditableList
                            items={question.tips}
                            onUpdate={(items) => updateQuestion(question.id, "tips", items)}
                            placeholder="Enter interview tip..."
                          />
                        </div>
                      </CollapsibleSection>

                      <CollapsibleSection title="Notes" icon={FileText}>
                        <div className="mt-3">
                          <EditableField
                            value={question.note}
                            onSave={(value) => updateQuestion(question.id, "note", value)}
                            multiline
                            className="text-gray-300"
                            renderValue={(value) => (
                              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                                <MarkdownRenderer content={value} />
                              </div>
                            )}
                            placeholder="Enter notes (markdown supported)..."
                          />
                        </div>
                      </CollapsibleSection>
                    </div>

                    {/* Metadata */}
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Created: {new Date(question.created_at).toLocaleDateString()}</span>
                        <span>Updated: {new Date(question.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
         </div>
         }

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <p className="text-white text-lg">No questions found matching your criteria.</p>
            </div>
          </div>
        )}
      </div>
      
    </div>
    </TooltipProvider>
         <Toaster />
  </QueryClientProvider>

  )
};
function CodeBlock({ code, language = "javascript" }: { code: string; language?: string }) {
  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

export default App;

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)