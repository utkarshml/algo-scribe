"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface TopicEditorProps {
  topics: string[]
  onChange: (topics: string[]) => void
  suggestions?: string[]
  className?: string
}

export function TopicEditor({ topics, onChange, suggestions = [], className = "" }: TopicEditorProps) {
  const [newTopic, setNewTopic] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const getTopicColor = (index: number) => {
    const colors = [
      "bg-blue-900 text-blue-300 border-blue-700",
      "bg-purple-900 text-purple-300 border-purple-700",
      "bg-pink-900 text-pink-300 border-pink-700",
      "bg-indigo-900 text-indigo-300 border-indigo-700",
      "bg-cyan-900 text-cyan-300 border-cyan-700",
    ]
    return colors[index % colors.length]
  }

  const addTopic = (topic: string) => {
    const trimmedTopic = topic.trim()
    if (trimmedTopic && !topics.includes(trimmedTopic)) {
      onChange([...topics, trimmedTopic])
      setNewTopic("")
      setShowSuggestions(false)
    }
  }

  const removeTopic = (index: number) => {
    onChange(topics.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTopic(newTopic)
    } else if (e.key === "Escape") {
      setNewTopic("")
      setShowSuggestions(false)
    }
  }

  const filteredSuggestions = suggestions.filter(
    (suggestion) => suggestion.toLowerCase().includes(newTopic.toLowerCase()) && !topics.includes(suggestion),
  )

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Topics */}
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, index) => (
          <Badge key={index} variant="outline" className={`text-xs ${getTopicColor(index)} group cursor-pointer`}>
            {topic}
            <button
              onClick={() => removeTopic(index)}
              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Add New Topic */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            value={newTopic}
            onChange={(e) => {
              setNewTopic(e.target.value)
              setShowSuggestions(e.target.value.length > 0)
            }}
            required
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(newTopic.length > 0)}
            placeholder="Add topic..."
            className="bg-gray-800 border-gray-600 text-white"
          />
          <Button
            type="button"
            onClick={() => addTopic(newTopic)}
            disabled={!newTopic.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => addTopic(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
