import api from "./api";

export const detectDisease = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await api.post(
    "/disease-detection",
    formData
  );

  return res.data;
};