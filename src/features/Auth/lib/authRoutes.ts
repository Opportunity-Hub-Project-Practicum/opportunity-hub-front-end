import { ROUTES } from "../../../routes/path";
import type { UserRole } from "../../../types/auth";

export function getHomeRouteForRole(role: UserRole): string {
    switch (role) {
        case "admin":
            return `${ROUTES.ADMIN.ROOT}/${ROUTES.ADMIN.OVERVIEW}`;
        case "employer":
            return `${ROUTES.EMPLOYER.ROOT}/${ROUTES.EMPLOYER.OVERVIEW}`;
        case "seeker":
        default:
            return `${ROUTES.SEEKER.ROOT}/${ROUTES.SEEKER.OVERVIEW}`;
    }
}
