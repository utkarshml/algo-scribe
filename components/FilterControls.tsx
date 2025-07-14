
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface FilterControlsProps {
  topics: string[];
  difficulties: string[];
  selectedTopic: string;
  selectedDifficulty: string;
  sortBy: string;
  onTopicChange: (topic: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onSortChange: (sortBy: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  topics,
  difficulties,
  selectedTopic,
  selectedDifficulty,
  sortBy,
  onTopicChange,
  onDifficultyChange,
  onSortChange,
}) => {
  return (
    <div className="mb-8">
      <Card className="i am bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-white mr-2" />
            <h3 className="text-lg font-semibold text-white">Filters & Sorting</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Topic Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200">Topic</label>
              <Select value={selectedTopic} onValueChange={onTopicChange}>
                <SelectTrigger style={{width : "-webkit-fill-available"}} className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic} className="text-white hover:bg-white/10">
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
                <SelectTrigger style={{width : "-webkit-fill-available"}} className="bg-white/10 border-white/20 text-white">
                  <SelectValue  placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty} className="text-white hover:bg-white/10">
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200">Sort By</label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger style={{width : "-webkit-fill-available"}} className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="name" className="text-white hover:bg-white/10">Name</SelectItem>
                  <SelectItem value="difficulty" className="text-white hover:bg-white/10">Difficulty</SelectItem>
                  <SelectItem value="topic" className="text-white hover:bg-white/10">Topic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterControls;
