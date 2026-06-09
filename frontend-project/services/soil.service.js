import api from "./api";

export const analyzeSoil = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await api.post(
    "/soil-analysis",
    formData
  );

  return res.data;
};