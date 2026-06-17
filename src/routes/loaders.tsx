import { redirect } from "react-router-dom";
import { getHomeRouteForRole } from "../features/Auth/lib/authRoutes";
import { getAccessToken } from "../services/apiClient";
import { getStoredUser } from "../services/authService";
import { ROUTES } from "./path";
import type { UserRole } from "../types/auth";

export const createRoleLoader = (requireRole: UserRole) => {
    return () => {
        const token = getAccessToken();
        const user = getStoredUser();

        if (!token || !user) {
            return redirect(ROUTES.AUTH.LOGIN);
        }

        if (user.role !== requireRole) {
            return redirect(getHomeRouteForRole(user.role));
        }

        return null;
    };
};