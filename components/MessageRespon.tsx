import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  const [saveButtonDisable, setSaveButtonDisable] = useState(false)
  const [editedData, setEditedData] = useState(data);
  const [isSaveLoadind, setSaveLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    testCases: false,
    solution: false,
    tips: false,
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const handleSave = async () => {
    if (onSave) {
      setSaveLoading(true)
      const resp = await onSave(data);
      if (resp) {
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

  const CodeBlock = ({ code, title }: { code: string; title: string }) => {
    // Detect language from code content (you can also pass language as a prop)
    const detectLanguage = (code: string) => {
      if (code.includes('function') || code.includes('const') || code.includes('let')) return 'javascript';
      if (code.includes('def ') || code.includes('import ')) return 'python';
      if (code.includes('public class') || code.includes('System.out')) return 'java';
      if (code.includes('#include') || code.includes('iostream')) return 'cpp';
      return 'javascript'; // default
    };

    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => copyToClipboard(code, title)}
            className="h-6 w-6 p-0 hover:bg-purple-400/20 cursor-pointer my-2 flex items-center justify-center z-10"
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            {copiedCode === title ? (
              <Check className="h-3 w-3 text-primary" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
        <div className="rounded-lg overflow-hidden border border-code-border">
          <SyntaxHighlighter
            language={detectLanguage(code)}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              borderRadius: '0.5rem',
            }}
            showLineNumbers={true}
            wrapLines={true}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  };

  return (
    <Card className={cn(
      "max-w-4xl mx-auto border-border p-[1px] shadow-lg transition-all duration-300 hover:shadow-md",
      className
    )}>
      <div className="bg-card rounded-lg h-full">
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
                  <h2 className="text-xl font-bold text-card-foreground">
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
                  <Badge key={index} variant="secondary" className="text-xs">
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
                disabled={saveButtonDisable}
                onClick={handleSave}
                className={
                  cn("hover:bg-primary/90 cursor-pointer"
                    , saveButtonDisable && "opacity-50"
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
            <h3 className="text-lg font-semibold text-primary">Description</h3>
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
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ node, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const inline = !match;
                      const codeString = String(children).replace(/\n$/, '');

                      return !inline ? (
                        <SyntaxHighlighter
                          language={match ? match[1] : 'javascript'}
                          style={vscDarkPlus}
                          customStyle={{
                            margin: '0.5rem 0',
                            padding: '1rem',
                            fontSize: '0.875rem',
                            borderRadius: '0.5rem',
                          }}
                          showLineNumbers={true}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={cn("px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-xs", className)} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {editedData.description}
                </ReactMarkdown>
              </div>
            )}
          </div>



          {/* User Code */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">Starter Code</h3>
            <CodeBlock code={editedData.userCode} title="Starter Code" />
          </div>

          {/* Solution */}
          <Collapsible open={expandedSections.solution} onOpenChange={() => toggleSection('solution')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full cursor-pointer hover:bg-muted/50 justify-between p-0 h-auto">
                <h3 className="text-lg font-semibold py-4 text-primary">Solution</h3>
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
              <h3 className="text-lg font-semibold text-card-foreground">Note</h3>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const inline = !match;
                        const codeString = String(children).replace(/\n$/, '');

                        return !inline ? (
                          <SyntaxHighlighter
                            language={match ? match[1] : 'javascript'}
                            style={vscDarkPlus}
                            customStyle={{
                              margin: '0.5rem 0',
                              padding: '1rem',
                              fontSize: '0.875rem',
                              borderRadius: '0.5rem',
                            }}
                            showLineNumbers={true}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={cn("px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-xs", className)} {...props}>
                            {children}
                          </code>
                        );
                      },
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
              <Button variant="ghost" className="w-full justify-between cursor-pointer hover:bg-muted/50 p-0 h-auto">
                <h3 className="text-lg font-semibold py-4 text-primary">Interview Tips</h3>
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
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: ({ node, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const inline = !match;
                            const codeString = String(children).replace(/\n$/, '');

                            return !inline ? (
                              <SyntaxHighlighter
                                language={match ? match[1] : 'javascript'}
                                style={vscDarkPlus}
                                customStyle={{
                                  margin: '0.5rem 0',
                                  padding: '1rem',
                                  fontSize: '0.875rem',
                                  borderRadius: '0.5rem',
                                }}
                                showLineNumbers={true}
                              >
                                {codeString}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={cn("px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-xs", className)} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
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