import React from 'react';
import { Card } from '@/components/ui/card';

interface CodeDisplayProps {
  code: string;
  language: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, language }) => {
  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'javascript':
      case 'js':
        return 'bg-yellow-100 text-yellow-800';
      case 'python':
        return 'bg-blue-100 text-blue-800';
      case 'typescript':
      case 'ts':
        return 'bg-blue-100 text-blue-800';
      case 'java':
        return 'bg-red-100 text-red-800';
      case 'cpp':
      case 'c++':
        return 'bg-purple-100 text-purple-800';
      default:
        return ' text-gray-100';
    }
  };

  return (
    <Card className="p-0 gap-0 overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b border-border flex items-center justify-between">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColor(language)}`}>
          {language.toUpperCase()}
        </span>
        <button
          className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          onClick={() => navigator.clipboard.writeText(code)}
        >
          Copy
        </button>
      </div>
      <div className="p-4 bg-black text-muted-foreground overflow-x-auto">
        <pre className="text-sm leading-relaxed">
          <code className="font-mono whitespace-pre-wrap break-words">
            {code}
          </code>
        </pre>
      </div>
    </Card>
  );
};
