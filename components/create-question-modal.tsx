"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X, Code, Lightbulb, FileText, Tag } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { InterviewQuestion } from "@/types/custom"
import { TopicEditor } from "@/components/topic-editor"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Input } from "./ui/input"
import { toast } from "sonner"

interface CreateQuestionModalProps {
  onCreateQuestion: (question: Omit<InterviewQuestion, "id" | "created_at" | "updated_at">) => Promise<void>
  availableTopics: string[]
}

const defaultQuestion = {
  question_name: "",
  description: "",
  difficulty: "Easy" as "Easy" | "Medium" | "Hard",
  topics: [] as string[],
  user_code: `function solution() {
    // Your code here
    
    return null;
}`,
  solution_code: `function solution() {
    // Implementation here
    
    return result;
}

// Time Complexity: O(?)
// Space Complexity: O(?)`,
  interview_tips: [""],
  note: `## Key Points

- Important concept to remember
- Time/space complexity analysis
- Edge cases to consider

### Follow-up Questions
- What if...?
- How would you optimize...?`,
}

export function CreateQuestionModal({ onCreateQuestion, availableTopics }: CreateQuestionModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(defaultQuestion)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openSections, setOpenSections] = useState({
    userCode: false,
    solutionCode: false,
    tips: false,
    notes: false,
  })

  const resetForm = () => {
    setFormData(defaultQuestion)
    setOpenSections({
      userCode: false,
      solutionCode: false,
      tips: false,
      notes: false,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.question_name.trim()) {
      toast("Question name is required")
      return
    }

    if (!formData.description.trim()) {
      toast("Description is required")
      return
    }

    setIsSubmitting(true)

    try {
      const cleanedTips = formData.interview_tips.filter((tip) => tip.trim() !== "")
      await onCreateQuestion({
        question_name: formData.question_name,
        description: formData.description,
        difficulty: formData.difficulty,
        topics: formData.topics,
        usercode: formData.user_code,
        solution: formData.solution_code,
        tips: cleanedTips.length > 0 ? cleanedTips : ["Consider the time and space complexity"],
        note: formData.note,
      })

      toast("Question created successfully!")

      setOpen(false)
      resetForm()
    } catch (error) {
      toast("Failed to create question")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateTip = (index: number, value: string) => {
    const newTips = [...formData.interview_tips]
    newTips[index] = value
    setFormData({ ...formData, interview_tips: newTips })
  }

  const addTip = () => {
    setFormData({
      ...formData,
      interview_tips: [...formData.interview_tips, ""],
    })
  }

  const removeTip = (index: number) => {
    const newTips = formData.interview_tips.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      interview_tips: newTips.length > 0 ? newTips : [""],
    })
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Question
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Create New Interview Question</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="question_name" className="text-gray-300">
                    Question Name *
                  </label>
                  <Input
                    id="question_name"
                    value={formData.question_name}
                    onChange={(e) => setFormData({ ...formData, question_name: e.target.value })}
                    placeholder="e.g., Two Sum"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="difficulty" className="text-gray-300">
                    Difficulty
                  </label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                      setFormData({ ...formData, difficulty: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="Easy" className="text-green-400">
                        Easy
                      </SelectItem>
                      <SelectItem value="Medium" className="text-yellow-400">
                        Medium
                      </SelectItem>
                      <SelectItem value="Hard" className="text-red-400">
                        Hard
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Topics
                </label>
                <TopicEditor
                  topics={formData.topics}
                  onChange={(topics) => setFormData({ ...formData, topics })}
                  suggestions={availableTopics}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-gray-300">
                  Problem Description *
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the problem statement..."
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Code Sections */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Code Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Code Template */}
              <Collapsible open={openSections.userCode} onOpenChange={() => toggleSection("userCode")}>
                <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 text-left hover:bg-gray-700 rounded-lg transition-colors">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-gray-200">User Code Template</span>
                  {openSections.userCode ? (
                    <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3">
                  <Textarea
                    value={formData.user_code}
                    onChange={(e) => setFormData({ ...formData, user_code: e.target.value })}
                    placeholder="Enter the code template for users..."
                    className="bg-gray-700 border-gray-600 text-white font-mono text-sm min-h-[120px]"
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Solution Code */}
              <Collapsible open={openSections.solutionCode} onOpenChange={() => toggleSection("solutionCode")}>
                <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 text-left hover:bg-gray-700 rounded-lg transition-colors">
                  <Code className="w-4 h-4 text-green-400" />
                  <span className="font-medium text-gray-200">Solution Code</span>
                  {openSections.solutionCode ? (
                    <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3">
                  <Textarea
                    value={formData.solution_code}
                    onChange={(e) => setFormData({ ...formData, solution_code: e.target.value })}
                    placeholder="Enter the solution code..."
                    className="bg-gray-700 border-gray-600 text-white font-mono text-sm min-h-[120px]"
                  />
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Interview Tips */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Additional Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Collapsible open={openSections.tips} onOpenChange={() => toggleSection("tips")}>
                <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 text-left hover:bg-gray-700 rounded-lg transition-colors">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium text-gray-200">Interview Tips</span>
                  {openSections.tips ? (
                    <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3 space-y-3">
                  {formData.interview_tips.map((tip, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center text-sm font-medium mt-1 flex-shrink-0">
                        {index + 1}
                      </div>
                      <Textarea
                        value={tip}
                        onChange={(e) => updateTip(index, e.target.value)}
                        placeholder="Enter interview tip..."
                        className="bg-gray-700 border-gray-600 text-white text-sm flex-1"
                        rows={2}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTip(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-1 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTip}
                    className="w-full border-dashed border-gray-600 text-gray-400 hover:text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tip
                  </Button>
                </CollapsibleContent>
              </Collapsible>

              {/* Notes Section */}
              <Collapsible open={openSections.notes} onOpenChange={() => toggleSection("notes")}>
                <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 text-left hover:bg-gray-700 rounded-lg transition-colors">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span className="font-medium text-gray-200">Notes (Markdown)</span>
                  {openSections.notes ? (
                    <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3 space-y-3">
                  <Textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Enter notes (markdown supported)..."
                    className="bg-gray-700 border-gray-600 text-white font-mono text-sm min-h-[120px]"
                  />
                  {formData.note && (
                    <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                      <label className="text-gray-400 text-sm mb-2 block">Preview:</label>
                      <MarkdownRenderer content={formData.note} />
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Separator className="bg-gray-700" />

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
              {isSubmitting ? "Creating..." : "Create Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
