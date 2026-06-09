"use client";

import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "next/navigation";

import {
  getChatById
}
from "@/services/history.service";

export default function ChatDetails() {

  const params =
    useParams();

  const [messages,
    setMessages] =
    useState([]);

  useEffect(() => {

    async function load() {

      const data =
        await getChatById(
          params.chatId
        );

      setMessages(
        data.messages
      );
    }

    load();

  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Chat Conversation
      </h1>

      {messages.map((msg, i) => (

        <div
          key={i}
          className={`p-3 my-2 rounded ${
            msg.role === "user"
              ? "bg-green-100"
              : "bg-gray-100"
          }`}
        >
          {msg.text}
        </div>

      ))}

    </div>
  );
}