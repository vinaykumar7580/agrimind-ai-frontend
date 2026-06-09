import api from "./api";

export const getMarketPrices = async () => {
  const res = await api.get("/market");

  return res.data;
};