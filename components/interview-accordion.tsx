"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Lightbulb, User, CheckCircle, FileText, Loader2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { database } from "@/lib/database"
import type { InterviewQuestion } from "@/types/custom"
import { EditableField } from "@/components/editable-field"
import { EditableList } from "@/components/editable-list"
import { MarkdownRenderer } from "@/components/markdown-renderer"
// Add imports for the new components
import { CreateQuestionModal } from "@/components/create-question-modal"
import { TopicEditor } from "@/components/topic-editor"

function CodeBlock({ code, language = "javascript" }: { code: string; language?: string }) {
  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

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

export default function InterviewAccordion() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [loading, setLoading] = useState(true)
  // Add state for available topics
  const [availableTopics, setAvailableTopics] = useState<string[]>([])

  useEffect(() => {
    loadQuestions()
  }, [])

  // Update the loadQuestions function to also load available topics
  const loadQuestions = async () => {
    try {
      const [questionsData, topicsData] = await Promise.all([database.getAllQuestions(), database.getAvailableTopics()])
      setQuestions(questionsData)
      setAvailableTopics(topicsData)
    } catch (error) {
        console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // Add function to handle creating new questions
  const handleCreateQuestion = async (questionData: Omit<InterviewQuestion, "id" | "created_at" | "updated_at">) => {
    try {
      const newQuestion = await database.addQuestion(questionData)
      setQuestions((prev) => [...prev, newQuestion])

      // Update available topics
      const newTopics = await database.getAvailableTopics()
      setAvailableTopics(newTopics)
       console.log("Question created successfully!")
 
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const updateQuestion = async (id: string, field: keyof InterviewQuestion, value: any) => {
    try {
      const updatedQuestion = await database.updateQuestion({ id, field, value })
      if (updatedQuestion) {
        setQuestions((prev) => prev.map((q) => (q.id === id ? updatedQuestion : q)))
        console.log( "Changes saved successfully",)
      }
    } catch (error) {
        console.log(error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-900 text-green-300 border-green-700"
      case "Medium":
        return "bg-yellow-900 text-yellow-300 border-yellow-700"
      case "Hard":
        return "bg-red-900 text-red-300 border-red-700"
      default:
        return "bg-gray-900 text-gray-300 border-gray-700"
    }
  }

  const getTopicColor = (index: number) => {
    const colors = [
      "bg-blue-900 text-blue-300 border-blue-700",
      "bg-purple-900 text-purple-300 border-purple-700",
      "bg-pink-900 text-pink-300 border-pink-700",
      "bg-indigo-900 text-indigo-300 border-indigo-700",
      "bg-cyan-900 text-cyan-300 border-cyan-700",
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading questions...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Update the header section to include the create button */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Interview Questions</h1>
            <p className="text-gray-400">Practice coding problems with editable content and database persistence</p>
          </div>
          <CreateQuestionModal onCreateQuestion={handleCreateQuestion} availableTopics={availableTopics} />
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {questions.map((question) => (
            <AccordionItem
              key={question.id}
              value={question.id}
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
                      <CollapsibleSection title="Your Code Template" icon={User}>
                        <div className="mt-3">
                          <EditableField
                            value={question.user_code}
                            onSave={(value) => updateQuestion(question.id, "user_code", value)}
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
                            value={question.solution_code}
                            onSave={(value) => updateQuestion(question.id, "solution_code", value)}
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
                            items={question.interview_tips}
                            onUpdate={(items) => updateQuestion(question.id, "interview_tips", items)}
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
    </div>
  )
}
