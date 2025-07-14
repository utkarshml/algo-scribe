"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Check, X, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface EditableFieldProps {
  value: string
  onSave: (value: string) => Promise<void>
  multiline?: boolean
  placeholder?: string
  className?: string
  renderValue?: (value: string) => React.ReactNode
}

export function EditableField({
  value,
  onSave,
  multiline = false,
  placeholder = "",
  className = "",
  renderValue,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (multiline) {
        const textarea = inputRef.current as HTMLTextAreaElement
        textarea.setSelectionRange(textarea.value.length, textarea.value.length)
      }
    }
  }, [isEditing, multiline])

  const handleSave = async () => {
    if (editValue.trim() === value.trim()) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(editValue.trim())
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel()
    } else if (e.key === "Enter" && !multiline && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Enter" && e.ctrlKey && multiline) {
      e.preventDefault()
      handleSave()
    }
  }

  if (isEditing) {
    const InputComponent = multiline ? Textarea : Input

    return (
      <div className="space-y-2">
        <InputComponent
          ref={inputRef as any}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`bg-gray-800 border-gray-600 text-white ${className}`}
          rows={multiline ? 4 : undefined}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
            <Check className="w-3 h-3 mr-1" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        </div>
        {multiline && <p className="text-xs text-gray-500">Press Ctrl+Enter to save, Escape to cancel</p>}
      </div>
    )
  }

  return (
    <div className="group relative">
      <div className={className}>{renderValue ? renderValue(value) : value}</div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        <Edit2 className="w-3 h-3" />
      </Button>
    </div>
  )
}
