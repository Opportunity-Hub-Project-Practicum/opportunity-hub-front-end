import { CircleUserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { resolveAssetUrl } from "../features/Employer/lib/resolveAssetUrl";
import { fetchEmployerProfile } from "../features/Employer/services/employerProfileService";
import { fetchSeekerProfile } from "../features/Seeker/services/seekerProfileService";
import type { UserRole } from "../types/auth";

type NavProfileButtonProps = {
    settingsPath: string;
};

function profileInitials(name: string | undefined): string {
    if (!name?.trim()) {
        return "";
    }

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

async function loadProfileAvatar(role: UserRole): Promise<string | null> {
    switch (role) {
        case "seeker": {
            const response = await fetchSeekerProfile();
            const path = response.profile.profile_img;
            return path ? resolveAssetUrl(path) : null;
        }
        case "employer": {
            const response = await fetchEmployerProfile();
            const path = response.profile.logo_img;
            return path ? resolveAssetUrl(path) : null;
        }
        case "admin":
            return null;
        default: {
            const _exhaustive: never = role;
            return _exhaustive;
        }
    }
}

export default function NavProfileButton({ settingsPath }: NavProfileButtonProps) {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const displayName = user?.full_name?.trim() || "Profile";
    const initials = profileInitials(user?.full_name);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            setAvatarUrl(null);
            return;
        }

        let cancelled = false;

        void loadProfileAvatar(user.role)
            .then((url) => {
                if (!cancelled) {
                    setAvatarUrl(url);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setAvatarUrl(null);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, user?.id, user?.role, location.pathname]);

    return (
        <Link to={settingsPath} className="inline-block" title={displayName}>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-10 w-10 rounded-full border object-cover"
                />
            ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-subPrimary text-sm font-semibold text-primary">
                    {initials || <CircleUserRound className="h-5 w-5" />}
                </div>
            )}
        </Link>
    );
}
