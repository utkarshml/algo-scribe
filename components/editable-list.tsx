"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditableField } from "./editable-field"

interface EditableListProps {
  items: string[]
  onUpdate: (items: string[]) => Promise<void>
  placeholder?: string
  className?: string
}

export function EditableList({ items, onUpdate, placeholder = "Add new item...", className = "" }: EditableListProps) {
  const [newItem, setNewItem] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddItem = async () => {
    if (newItem.trim()) {
      await onUpdate([...items, newItem.trim()])
      setNewItem("")
      setIsAdding(false)
    }
  }

  const handleUpdateItem = async (index: number, value: string) => {
    const updatedItems = [...items]
    updatedItems[index] = value
    await onUpdate(updatedItems)
  }

  const handleDeleteItem = async (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index)
    await onUpdate(updatedItems)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddItem()
    } else if (e.key === "Escape") {
      setNewItem("")
      setIsAdding(false)
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg border border-gray-700 group">
          <div className="w-6 h-6 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center text-sm font-medium mt-0.5 flex-shrink-0">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <EditableField
              value={item}
              onSave={(value) => handleUpdateItem(index, value)}
              multiline
              className="text-gray-300 text-sm leading-relaxed"
            />
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteItem(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-900/20 flex-shrink-0"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <div className="w-6 h-6 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center text-sm font-medium flex-shrink-0">
            {items.length + 1}
          </div>
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="bg-gray-800 border-gray-600 text-white flex-1"
            autoFocus
          />
          <div className="flex gap-2 flex-shrink-0">
            <Button size="sm" onClick={handleAddItem} className="bg-green-600 hover:bg-green-700">
              Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setNewItem("")
                setIsAdding(false)
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full border-dashed border-gray-600 text-gray-400 hover:text-gray-300 hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new tip
        </Button>
      )}
    </div>
  )
}
