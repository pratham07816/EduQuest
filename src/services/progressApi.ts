import api from "./api";

/* ================= GET PROGRESS ================= */
export const getProgress = async () => {
  const res = await api.get("/progress");
  return res.data;
};

/* ================= UPDATE PROGRESS ================= */
export const updateProgress = async ({
  xpGained,
  score,
  unlockedBadges,
}: {
  xpGained: number;
  score: number;
  unlockedBadges: string[];
}) => {
  const res = await api.post("/progress", {
    xpGained,
    score,
    unlockedBadges,
  });
  return res.data;
};
