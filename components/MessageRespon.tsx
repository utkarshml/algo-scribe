import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Save, Edit3, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDifficultyColor } from './ActionCard';
import { questionResponse } from '@/types/custom';


interface MessageCardProps {
  data: questionResponse;
  onSave?: (data: questionResponse) => Promise<boolean>;
  className?: string;
}

export function MessageCard({ data, onSave, className }: MessageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saveButtonDisable , setSaveButtonDisable] = useState(false)
  const [editedData, setEditedData] = useState(data);
  const [isSaveLoadind , setSaveLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    testCases: false,
    solution: false,
    tips: false,
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const handleSave =  async () => {
    if (onSave) {
      setSaveLoading(true)
      const resp = await onSave(data);
      if(resp){
        setSaveButtonDisable(true)
      }
      setSaveLoading(false);
    }
  };




  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
  
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text. Please try again.');
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const CodeBlock = ({ code, title }: { code: string; title: string }) => (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => copyToClipboard(code, title)}
          className="h-6 w-6 p-0 hover:bg-purple-400/20 cursor-pointer my-2 flex items-center justify-center"
          style={{ position: 'absolute', right: 4, top: 4 }}
        >
          {copiedCode === title ? (
            <Check className="h-3 w-3 text-primary" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <div className="bg-code-bg border border-code-border rounded-lg overflow-x-auto">
        <div className="p-4 min-w-full">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ node, className, children, ...props }) => (
                <code className={cn("text-sm", className)} {...props}>
                  {children}
                </code>
              ),
              pre: ({ node, className, children, ...props }) => (
                <pre className={cn("whitespace-pre overflow-x-auto", className)} {...props}>
                  {children}
                </pre>
              )
            }}
          >
            {`\`\`\`$\n${code}\n\`\`\``}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={cn(
      "max-w-4xl mx-auto border-purple-500 p-[1px] shadow-lg transition-all duration-300 hover:shadow-glow",
      className
    )}>
      <div className="bg-chat-bubble-secondary rounded-[calc(var(--radius)-1px)] h-full">
        <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.question_name}
                  onChange={(e) => setEditedData(prev => ({
                    ...prev,
                    output: { ...prev, question_name: e.target.value }
                  }))}
                  className="text-xl font-bold bg-transparent border-b border-muted-foreground focus:border-primary outline-none"
                />
              ) : (
                <h2 className="text-xl font-bold text-chat-bubble-secondary-foreground">
                  {editedData.question_name}
                </h2>
              )}
              <Badge 
                variant="secondary" 
                className={cn(
                "font-medium bg-opacity-20 bg-primary border-0",
                  `${getDifficultyColor(editedData.difficulty)}`
                )}
              >
                {editedData.difficulty}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {editedData.topic.map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-blue-700/20 text-blue-500">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} variant="default">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="hover:bg-primary/10"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )} */}
              <Button
                variant="default"
                size="sm"
                disabled = {saveButtonDisable}
                onClick={handleSave}
                className={
                cn( "hover:bg-primary/10 bg-purple-700 cursor-pointer"
                    , saveButtonDisable && "bg-purple-950" 
                )
                }
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaveLoadind ? "..saving" : "save"}
              </Button>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-pink-400">Description</h3>
          {isEditing ? (
            <Textarea
              value={editedData.description}
              onChange={(e) => setEditedData(prev => ({
                ...prev,
                output: { ...prev, description: e.target.value }
              }))}
              className="min-h-[100px] bg-background/50"
            />
          ) : (
            <div className="prose prose-sm max-w-none text-sm dark:prose-invert">
                          <ReactMarkdown>
                            {editedData.description} 
                          </ReactMarkdown> 
            </div>
          )}
        </div>



        {/* User Code */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-pink-400">Starter Code</h3>
          <CodeBlock code={editedData.userCode} title="Starter Code"  />
        </div>

        {/* Solution */}
        <Collapsible open={expandedSections.solution} onOpenChange={() => toggleSection('solution')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full cursor-pointer hover:bg-white/10   justify-between p-0 h-auto">
              <h3 className="text-lg font-semibold py-4 text-pink-400">Solution</h3>
              {expandedSections.solution ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <CodeBlock code={editedData.solution_code} title="Solution Code" />
          </CollapsibleContent>
        </Collapsible>

        {/* Note */}
        {editedData.note && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-chat-bubble-secondary-foreground">Note</h3>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              pre: ({ children }) => <div className="my-2">{children}</div>,
                              ul: ({ children }) => <ul className="my-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="my-2 space-y-1">{children}</ol>,
                              blockquote: ({ children }) => (
                                <blockquote className={cn(
                                  "border-l-4 pl-4 my-2 italic",
                             
                              "border-purple-300 dark:border-purple-600"
                                )}>
                                  {children}
                                </blockquote>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold">{children}</strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic">{children}</em>
                              ),
                            }}
                          >
                            {editedData.note} 
                          </ReactMarkdown> 
              </div>
            </div>
          </div>
        )}

        {/* Interview Tips */}
        <Collapsible open={expandedSections.tips} onOpenChange={() => toggleSection('tips')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between cursor-pointer hover:bg-white/10 p-0 h-auto">
              <h3 className="text-lg font-semibold py-4 text-pink-400 ">Interview Tips</h3>
              {expandedSections.tips ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-4">
            <div className="space-y-2">
              {editedData.interview_tips.map((tip, index) => (
                <div key={index} className="flex items-start bg-purple-500/20 gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {tip}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        </div>
      </div>
    </Card>
  );
}