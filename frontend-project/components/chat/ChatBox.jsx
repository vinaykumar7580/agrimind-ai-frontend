"use client";

import { useState } from "react";
import { askAI } from "@/services/chat.service";
import Message from "./Message";
import ChatInput from "./ChatInput";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    const newMessages = [
      ...messages,
      { role: "user", text },
    ];

    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await askAI(text);

      setMessages([
        ...newMessages,
        { role: "ai", text: res.answer },
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <Message key={i} {...msg} />
        ))}

        {loading && (
          <p className="text-gray-500">
            AgriMind AI is thinking...
          </p>
        )}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}