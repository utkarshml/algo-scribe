
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { CheckCircle, Circle, Edit3, Save, X } from 'lucide-react';
import { Question } from '@/types/custom';



interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(question.question_description);
  const [editableCode, setEditableCode] = useState(question.code);
  const [editedCode, setEditedCode] = useState(question.code);
  const [editableNote, setEditableNote] = useState<string>(question.note)
  const [useCode, setUserCode] = useState<string>(question.userCode || '')
  const [isSolve ,setSolve] = useState(question.solved || false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Hard':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleSave = () => {
    // Here you would typically save to a backend or state management
    console.log('Saving changes:', { editedDescription , editedCode });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDescription(question.question_description);
    setEditedCode(question.code);
    setUserCode(question.userCode || '')

    setIsEditing(false);
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown renderer for basic formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 rounded text-yellow-300">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 p-3 rounded-lg overflow-x-auto my-2"><code class="text-green-300">$1</code></pre>')
      .split('\n')
      .map(line => line.trim())
      .join('<br/>');
  };

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={`question-${question.id}`} className="border-white/10">
          <AccordionTrigger className="px-6 cursor-pointer py-4 hover:no-underline hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center space-x-4">
                {question.solved ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-white font-medium text-left">{question.question_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {question.tag}
                </Badge>
                <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} className="border-white/20 text-white hover:bg-white/10">
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setIsEditing(true)} className="border-white/20 cursor-pointer text-white mt-3 hover:bg-white/10">
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {/* Description Section */}
           {  question.question_description.length > 0 &&
            <div>
                <h4 className="text-white font-semibold mb-2">Description</h4>
                {isEditing ? (
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="bg-white/10 border-white/20 text-white min-h-[150px] resize-none"
                    placeholder="Enter problem description..."
                  />
                ) : (
                  <div 
                    className="text-gray-200 bg-white/5 p-4 rounded-lg border border-white/10"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(question.question_description) }}
                  />
                )}
              </div>
              }

              {/* Note Section */}
                  <div>
                <h4 className="text-white font-semibold mb-2">Revision Note</h4>
                {isEditing ? (
                  <Textarea
                    value={editableNote}
                    onChange={(e) => setEditableNote(e.target.value)}
                    className="bg-white/10 border-white/20 text-white min-h-[150px] resize-none"
                    placeholder="Enter problem description..."
                  />
                ) : (
                  <div 
                    className="text-gray-200 bg-white/5 p-4 rounded-lg border border-white/10"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(question.note) }}
                  />
                )}
              </div>

              {/* User Code Code Section */}
{ (question.userCode ?? '').length > 0 && <div>
                <h4 className="text-white font-semibold mb-2">Your Solution</h4>
                {isEditing ? (
                  <Textarea
                    value={useCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="bg-gray-900 border-white/20 text-green-300 font-mono min-h-[200px] resize-none"
                    placeholder="Enter your code solution..."
                  />
                ) : (
                  <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-white/10">
                    <code className="text-green-300 text-sm">{question.code}</code>
                  </pre>
                )}
              </div>}
              {/* Code Section */}
             { (question.code ?? '').length > 0 && <div>
                <h4 className="text-white font-semibold mb-2">Solution</h4>
                {isEditing ? (
                  <Textarea
                    value={editedCode}
                    onChange={(e) => setEditedCode(e.target.value)}
                    className="bg-gray-900 border-white/20 text-green-300 font-mono min-h-[200px] resize-none"
                    placeholder="Enter your code solution..."
                  />
                ) : (
                  <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-white/10">
                    <code className="text-green-300 text-sm">{question.code}</code>
                  </pre>
                )}
              </div>}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default QuestionCard;
