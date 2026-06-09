"use client";

import Link from "next/link";

export default function ChatHistory({
  chats,
}) {

  return (
    <div className="bg-white p-4 rounded shadow">

      <h2 className="font-bold mb-4">
        Recent Chats
      </h2>

      {chats.map((chat) => (

        <Link
          key={chat.id}
          href={`/chat/${chat.id}`}
        >
          <div className="border-b py-3 hover:bg-gray-50">

            <p>{chat.title}</p>

            <small>
              {chat.created_at}
            </small>

          </div>
        </Link>

      ))}

    </div>
  );
}