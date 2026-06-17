import { LogOut, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../routes/path";
import { formatApiError } from "../services/apiClient";
import { deleteAccount, getStoredUser, updateAccount } from "../services/authService";

interface PasswordProps {
    email?: string;
}

function PasswordField({
    label,
    value,
    onChange,
    placeholder,
    autoComplete,
    className = "",
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoComplete?: string;
    className?: string;
}) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label className="text-xs font-medium text-slate-600">{label}</label>
            <input
                type="password"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
}

function AccountActions() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
        setError(null);
        setActionMessage(null);
        setIsLoggingOut(true);

        try {
            await logout();
        } finally {
            setIsLoggingOut(false);
            navigate(ROUTES.AUTH.LOGIN, { replace: true });
        }
    };

    const handleDeleteAccount = async () => {
        setError(null);
        setActionMessage(null);

        const confirmed = window.confirm(
            "Delete your account permanently? This action cannot be undone.",
        );
        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await deleteAccount();
            setActionMessage(response.message);
            navigate(ROUTES.AUTH.LOGIN, { replace: true });
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">Account Actions</h3>
            <p className="mb-4 text-sm text-slate-500">
                Log out of your account or permanently delete it.
            </p>

            {actionMessage && (
                <p className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                    {actionMessage}
                </p>
            )}

            {error && (
                <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => void handleLogout()}
                    disabled={isLoggingOut || isDeleting}
                    className="inline-flex items-center gap-2 rounded border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
                >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                </button>
                <button
                    type="button"
                    onClick={() => void handleDeleteAccount()}
                    disabled={isLoggingOut || isDeleting}
                    className="inline-flex items-center gap-2 rounded border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
            </div>
        </div>
    );
}

export default function Password({ email: _email }: PasswordProps) {
    const storedUser = getStoredUser();
    const isSocialAccount = storedUser?.auth_provider != null && storedUser.auth_provider !== "local";

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChangePassword = async () => {
        setError(null);
        setMessage(null);

        if (!newPassword.trim()) {
            setError("Enter a new password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (!currentPassword.trim()) {
            setError("Enter your current password to set a new password.");
            return;
        }

        setIsSubmitting(true);

        try {
            await updateAccount({
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setMessage("Password updated successfully.");
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSocialAccount) {
        return (
            <section className="mb-6">
                <h2 className="mb-2 text-lg font-semibold text-slate-800">Change Password</h2>
                <p className="text-sm text-slate-500">
                    Password change is not available for social login accounts.
                </p>
                <AccountActions />
            </section>
        );
    }

    return (
        <section className="mb-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Change Password</h2>

            {message && (
                <p className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                    {message}
                </p>
            )}

            {error && (
                <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <PasswordField
                    label="New password"
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="Leave blank to keep current"
                    autoComplete="new-password"
                />
                <PasswordField
                    label="Confirm password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                />
                <PasswordField
                    label="Current password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    placeholder="Required when changing password"
                    autoComplete="current-password"
                    className="md:col-span-2"
                />
            </div>

            <button
                type="button"
                onClick={() => void handleChangePassword()}
                disabled={isSubmitting}
                className="mt-4 rounded bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
                {isSubmitting ? "Saving..." : "Update Password"}
            </button>

            <AccountActions />
        </section>
    );
}
