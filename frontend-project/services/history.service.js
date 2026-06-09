import api from "./api";

export const getChatHistory =
  async () => {

    const res = await api.get(
      "/chat/history"
    );

    return res.data;
};

export const getChatById =
  async (id) => {

    const res = await api.get(
      `/chat/${id}`
    );

    return res.data;
};