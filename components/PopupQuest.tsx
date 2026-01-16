import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, Database, User } from 'lucide-react';
import { toast } from 'sonner';

interface QuestPopupProps {
  open: boolean;
  onClose: () => void;
  question: string
  description: string
  note: string
  user_id: string
}

const topics = [
  'Array',
  'Binary Search',
  'Sorting',
  'Linked List',
  'Stack',
  'Queue',
  'Tree',
  'Graph',
  'Dynamic Programming',
  'Greedy',
  'Hash Table',
  'Two Pointers',
  'Sliding Window',
  'Recursion',
  'Backtracking'
];

const difficulties = [
  { value: 'easy', label: 'Easy', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'hard', label: 'Hard', color: 'bg-red-500' }
];

const QuestPopup: React.FC<QuestPopupProps> = ({ open, onClose, question, description, note, user_id }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const handleSave = () => {
    if (!selectedTopic || !selectedDifficulty) {
      toast.error('Please select both topic and difficulty level');
      return;
    }
    console.log(
      {
        question_name: question,
        question_description: description,
        difficulty: selectedDifficulty,
        topics: selectedTopic,
        note: note,
        user_id
      }
    )
    toast.success(`Quest created! Topic: ${selectedTopic} | Difficulty: ${selectedDifficulty}`);

    // Reset form
    setSelectedTopic('');
    setSelectedDifficulty('');
    onClose();
  };

  const handleClose = () => {
    setSelectedTopic('');
    setSelectedDifficulty('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-800/40 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-primary">
            Create New Quest
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Topic Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-accent">Select Topic</h3>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="bg-muted w-full border-border text-foreground">
                <SelectValue placeholder="Choose a programming topic" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {topics.map((topic) => (
                  <SelectItem
                    key={topic}
                    value={topic}
                    className="text-popover-foreground"
                  >
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-accent">Select Difficulty</h3>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="bg-muted w-full border-border text-foreground">
                <SelectValue placeholder="Choose difficulty level" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {difficulties.map((diff) => (
                  <SelectItem
                    key={diff.value}
                    value={diff.value}
                    className="text-popover-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${diff.color}`}></div>
                      {diff.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 cursor-pointer bg-muted border-border text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 border-none shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Quest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestPopup;
