
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { MessageBubbleProps, questionResponse } from "@/types/custom";
import { ActionCard } from "./ActionCard";
import { supabase } from "@/entrypoints/background";
import { toast as sonnerToast } from 'sonner';



export const MessageBubble = React.memo(({ message, user_id, generatedHandler }: MessageBubbleProps) => {
  const isUser = message.sender === "user";
  const [isDark, setIsDark] = useState(false);
  const savetoDB = async (data: questionResponse): Promise<boolean> => {
    const { error } = await supabase.from('questions').insert({
      question_name: data.question_name,
      description: data.description,
      usercode: data.userCode,
      solution: data.solution_code,
      difficulty: data.difficulty,
      user_id: user_id,
      topics: data.topic,
      tips: data.interview_tips,
      note: data.note
    })
    if (error) {
      console.log(error)
      toast({
        message: error.message,
        type: "error"
      })
      return false;
    } else {
      toast({
        message: "Successfully save",
        type: ""
      })
      return true;
    }
  }

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn(
      "flex gap-3 animate-fade-in w-full",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
        isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
      )}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "max-w-[80%] space-y-1 flex flex-col",
        isUser ? "items-end" : "items-start"
      )}>
        <div style={{ width: "-webkit-fill-available" }} className={cn(
          "px-4 py-3 rounded-2xl shadow-sm relative overflow-hidden",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border text-card-foreground border-border rounded-bl-md"
        )}>
          <div className={cn(
            "prose prose-sm max-w-none",
            isUser
              ? "prose-invert"
              : "prose-slate dark:prose-invert"
          )}>
            {
              message.sender === "system" ?
                <div className="template">
                  <ActionCard
                    questionName={message.system?.question || ""}
                    questionDescription={message.system?.description || ""}
                    userCode={message.system?.code}
                    language={message.system?.language}
                    tags={[]}
                    difficulty={message.system?.difficulty || "Easy"}
                    onGenerateNote={generatedHandler}
                  />
                </div>
                :
                isUser ?
                  <div className="markdown w-full max-w-4xl mx-auto">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        code: ({ children, className, ...props }) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const language = match ? match[1] : '';
                          const inline = !match;

                          return !inline && match ? (
                            <div className="my-3  rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600  bg-black">
                              <div className="bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                                {language.toUpperCase()}
                              </div>
                              <SyntaxHighlighter
                                style={isDark ? oneDark : oneLight}
                                language={language}
                                PreTag="div"
                                className="!m-0 !bg-transparent"
                                customStyle={{
                                  margin: 0,
                                  padding: '1rem',
                                  background: 'transparent',
                                  fontSize: '0.875rem',
                                  lineHeight: '1.5',
                                } as React.CSSProperties}
                                codeTagProps={{
                                  style: {
                                    background: 'transparent',
                                    padding: 0,
                                    margin: 0,
                                  }
                                }}
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className={cn(
                              "px-1.5 py-0.5 rounded text-xs font-mono",
                              isUser
                                ? "bg-white/20 text-white"
                                : "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                            )} {...props}>
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
                            isUser
                              ? "border-white/30"
                              : "border-purple-300 dark:border-purple-600"
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
                      {isUser ? message.userMessage : message.botMessage}
                    </ReactMarkdown>
                  </div>
                  :
                  message.isChat ?
                    <div className="markdown w-full max-w-4xl mx-auto">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          code: ({ children, className, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const language = match ? match[1] : '';
                            const inline = !match;

                            return !inline && match ? (
                              <div className="my-3  rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600  bg-black">
                                <div className="bg-[rgb(23,22,22)] px-3 py-2 text-xs font-medium text-white">
                                  {language.toUpperCase()}
                                </div>
                                <SyntaxHighlighter
                                  style={isDark ? oneDark : oneLight}
                                  language={language}
                                  PreTag="div"
                                  className="!m-0 !bg-transparent"
                                  customStyle={{
                                    margin: 0,
                                    padding: '1rem',
                                    background: 'transparent',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.5',
                                  } as React.CSSProperties}
                                  codeTagProps={{
                                    style: {
                                      background: 'transparent',
                                      padding: 0,
                                      margin: 0,
                                    }
                                  }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code className={cn(
                                "px-1.5 py-0.5 rounded text-xs font-mono",
                                isUser
                                  ? "bg-white/20 text-white"
                                  : "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                              )} {...props}>
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
                              isUser
                                ? "border-white/30"
                                : "border-purple-300 dark:border-purple-600"
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
                        {isUser ? message.userMessage : message.botMessage}
                      </ReactMarkdown>
                    </div>
                    :
                    (
                      message.questionResponse ? (
                        <MessageCard
                          data={message.questionResponse}
                          onSave={savetoDB}
                        />
                      ) : <div>Sorry Guys No Response Generated Please Try Again </div>
                    )
            }



          </div>
        </div>

        <div className={cn(
          "text-xs text-gray-500 dark:text-gray-400 px-1",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
})


function toast({ message, type }: { message: string; type: string }) {
  sonnerToast(message, {
    description: type,
    duration: 4000,
    position: "top-right",
    style: type === "error" ? { background: "#f87171", color: "#fff" } : undefined,
  });
}