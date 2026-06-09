"use client";

import { useEffect, useState } from "react";

import DashboardCards
from "@/components/dashboard/DashboardCards";

import ChatHistory
from "@/components/history/ChatHistory";

import {
  getDashboard
}
from "@/services/dashboard.service";

import {
  getChatHistory
}
from "@/services/history.service";

export default function Dashboard() {

  const [stats, setStats] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  useEffect(() => {

    async function load() {

      const dashboard =
        await getDashboard();

      const chats =
        await getChatHistory();

      setStats(dashboard);
      setHistory(chats);
    }

    load();

  }, []);

  if (!stats)
    return <div>Loading...</div>;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <DashboardCards
        stats={stats}
      />

      <div className="mt-6">

        <ChatHistory
          chats={history}
        />

      </div>

    </div>
  );
}