// ChatInput.tsx
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React, { useEffect, useRef } from "react";

type Props = {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void
};

export const ChatInput = React.memo(({ inputValue, setInputValue, handleSendMessage, handleKeyPress }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [inputValue]);

  return (
    <>
      <div className="flex gap-2 items-end ">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 chatInput in  focus:outline-none focus:ring-0 border-none text-foreground  resize-none font-mono text-sm"
          rows={1}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className="hover:scale-105 transition-transform cursor-pointer h-11 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
});
