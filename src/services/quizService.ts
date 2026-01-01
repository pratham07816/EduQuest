import api from "./api";
import { Quiz } from "../types";

export const fetchQuizById = async (quizId: string): Promise<Quiz> => {
  const res = await api.get(`/quizzes/${quizId}`);
  return res.data;
};
