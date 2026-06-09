import api from "./api";

export const askAI = async (question) => {
  const res = await api.post("/agent-chat", {
    user_id: "123",
    question,
  });

  return res.data;
};