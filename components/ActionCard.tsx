import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, MessageSquare } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';

 export  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'bg-green-900/20 text-green-600';
      case 'Medium': return 'bg-yellow-900/20 text-yellow-600 ';
      case 'Hard': return 'bg-red-900/20 text-red-600';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <Card className="w-full max-w-4xl mx-auto shadow-lg hover:shadow-xl  transition-all duration-300 border-l-4 border-l-purple-600">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-white" />
            <CardTitle className="text-lg sm:text-xl font-semibold text-purple-600">
              {questionName}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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
        <div className="prose prose-sm max-w-none">
          <div className="text-white text-sm leading-relaxed">
            <ReactMarkdown 
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                    {children}
                  </code>
                ),
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>
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
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-pink-600 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Your Code Solution
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                  className="text-xs border border-pink-600 text-pink-600 cursor-pointer"
                >
                  {isCodeExpanded ? 'Collapse' : 'Expand'}
                </Button> 
              </div>
              
              <div className={`transition-all duration-300 ${isCodeExpanded ? 'max-h-96' : 'max-h-32'} overflow-hidden`}>
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
            className="flex-1 sm:flex-none bg-purple-600 cursor-pointer hover:bg-purple-700 text-white"
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
