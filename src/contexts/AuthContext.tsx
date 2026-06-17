import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { AuthUser, UserRole } from "../types/auth";
import { getAccessToken } from "../services/apiClient";
import type { EmployerRegisterPayload } from "../features/Employer/types/employerRegister";
import {
    clearAuthSession,
    fetchCurrentUser,
    getStoredUser,
    login as loginRequest,
    logout as logoutRequest,
    register as registerRequest,
    registerEmployer as registerEmployerRequest,
    type LoginPayload,
    type RegisterPayload,
} from "../services/authService";

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<AuthUser>;
    register: (payload: RegisterPayload) => Promise<AuthUser>;
    registerEmployer: (payload: EmployerRegisterPayload) => Promise<AuthUser>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        const token = getAccessToken();
        if (!token) {
            setUser(null);
            return null;
        }

        try {
            const currentUser = await fetchCurrentUser();
            setUser(currentUser);
            return currentUser;
        } catch {
            clearAuthSession();
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (!getAccessToken()) {
                if (!cancelled) {
                    setIsLoading(false);
                }
                return;
            }

            await refreshUser();
            if (!cancelled) {
                setIsLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [refreshUser]);

    const login = useCallback(async (payload: LoginPayload) => {
        const response = await loginRequest(payload);
        setUser(response.user);
        return response.user;
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        const response = await registerRequest(payload);
        setUser(response.user);
        return response.user;
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutRequest();
        } finally {
            setUser(null);
        }
    }, []);

    const registerEmployer = useCallback(async (payload: EmployerRegisterPayload) => {
        const response = await registerEmployerRequest(payload);
        setUser(response.user);
        return response.user;
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: Boolean(user && getAccessToken()),
            isLoading,
            login,
            register,
            registerEmployer,
            logout,
            refreshUser,
        }),
        [user, isLoading, login, register, registerEmployer, logout, refreshUser],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

export function useUserRole(): UserRole | null {
    return useAuth().user?.role ?? null;
}
