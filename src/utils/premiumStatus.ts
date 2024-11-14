import apiUrl from "@/hooks/api";

export const checkPremium = async () => {
  const res = await apiUrl.get(`http://localhost:4321/user/check-premium`);

  return res.data.status === 200;
};
