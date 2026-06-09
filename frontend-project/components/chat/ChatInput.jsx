"use client";

import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="flex gap-2 p-4 border-t">
      <input
        className="flex-1 border p-2 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask about farming..."
      />

      <button
        onClick={handleSend}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}