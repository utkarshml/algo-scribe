"use client"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Simple markdown parser for demo - in production, use a library like react-markdown
  const parseMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-white mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>')
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-300 my-2">$1</blockquote>',
      )
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside space-y-1 text-gray-300">$1</ul>')
      .replace(/\n/g, "<br />")
  }

  return (
    <div
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}
