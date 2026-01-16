import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, MessageSquare } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';

export const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'Easy': return 'bg-green-500/20 text-green-500 dark:bg-green-500/30 dark:text-green-400';
    case 'Medium': return 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-400';
    case 'Hard': return 'bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-400';
    default: return 'bg-muted text-muted-foreground';
  }
};
interface ActionCardProps {
  questionName: string;
  questionDescription: string;
  userCode?: string;
  language?: string;
  onGenerateNote?: () => void;
  tags?: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export const ActionCard: React.FC<ActionCardProps> = ({
  questionName,
  questionDescription,
  userCode,
  language = 'javascript',
  onGenerateNote,
  tags = [],
  difficulty = 'Medium'
}) => {
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNote = async () => {
    setIsGenerating(true);
    if (onGenerateNote) {
      await onGenerateNote();
    }
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };



  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
            <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground break-words">
              {questionName}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            <Badge className={getDifficultyColor(difficulty)}>
              {difficulty}
            </Badge>
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description Section */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="text-card-foreground text-sm sm:text-base leading-relaxed">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                code: ({ children }) => (
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-muted-foreground">
                    {children}
                  </code>
                ),
                strong: ({ children }) => <strong className="font-semibold text-card-foreground">{children}</strong>
              }}
            >
              {questionDescription}
            </ReactMarkdown>
          </div>
        </div>

        {/* Code Section */}
        {userCode && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-primary flex items-center gap-2 text-sm sm:text-base">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Your Code Solution</span>
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                  className="text-xs cursor-pointer flex-shrink-0"
                >
                  {isCodeExpanded ? 'Collapse' : 'Expand'}
                </Button>
              </div>

              <div className={`transition-all duration-300 ${isCodeExpanded ? 'max-h-96' : 'max-h-24 sm:max-h-32'} overflow-hidden`}>
                <CodeDisplay code={userCode} language={language} />
              </div>
            </div>
          </>
        )}

        {/* Action Section */}
        <Separator />
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleGenerateNote}
            disabled={isGenerating}
            className="w-full sm:w-auto cursor-pointer"
            variant="default"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                Generate Note
              </>
            )}
          </Button>

        </div>
      </CardContent>
    </Card>
  );
};
