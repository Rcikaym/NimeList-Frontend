import apiUrl from "@/hooks/api";
import { isMockMode } from "@/mocks/mockApi";

export const checkPremium = async () => {
  // In mock mode, always return true (demo user is premium)
  if (isMockMode()) {
    return true;
  }

  const res = await apiUrl.get(`http://localhost:4321/user/check-premium`);

  return res.data.status === 200;
};
