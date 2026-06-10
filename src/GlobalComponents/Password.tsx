import { Eye } from "lucide-react";
import { useState } from "react";
import { formatApiError } from "../services/apiClient";
import { forgotPassword } from "../services/authService";

interface PasswordProps {
    email?: string;
}

export default function Password({ email }: PasswordProps) {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleForgotPassword = async () => {
        if (!email?.trim()) {
            setError("No email found on your account.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            const response = await forgotPassword(email.trim());
            setMessage(response.message);
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Change Password</h2>
            <p className="text-sm text-gray-500 mb-4">
                Password changes are handled by email. We will send a temporary password to your account email.
            </p>

            {message && (
                <p className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                    {message}
                </p>
            )}

            {error && (
                <p className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {error}
                </p>
            )}

            <button
                type="button"
                onClick={() => void handleForgotPassword()}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
                {isSubmitting ? "Sending..." : "Email me a temporary password"}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 opacity-50 pointer-events-none">
                <div className="space-y-2">
                    <label className="text-meduim font-semibold text-gray-500">Current Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            disabled
                            placeholder="Not supported yet"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
                        />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                </div>
            </div>
        </section>
    );
}
