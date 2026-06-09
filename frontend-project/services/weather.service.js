import api from "./api";

export const getWeather = async (city) => {
  const res = await api.post("/weather", {
    city,
  });

  return res.data;
};