"use client";

import { useEffect, useState } from "react";
import { getMarketPrices } from "@/services/market.service";

import MarketTable from "@/components/market/MarketTable";

export default function MarketPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await getMarketPrices();
      setData(res);
    }

    load();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">

      <h1 className="text-2xl font-bold mb-4">
        📈 Market Intelligence
      </h1>

      <MarketTable data={data} />

    </div>
  );
}