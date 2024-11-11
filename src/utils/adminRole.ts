import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "./auth"

export const checkAdminRole = () => {
    const token: any = getAccessToken();
    const decodedToken: { role: string } = jwtDecode(token);

    return decodedToken.role === "admin";
}