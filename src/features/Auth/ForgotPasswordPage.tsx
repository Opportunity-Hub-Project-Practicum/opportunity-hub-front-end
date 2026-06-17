import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/path";
import { forgotPassword } from "../../services/authService";
import { formatApiError } from "../../services/apiClient";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await forgotPassword(email.trim());
            setSuccessMessage(response.message);
            setEmail("");
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div>
                    <h1 className="p-5 text-big text-primary">
                        <Link to={ROUTES.HOME.ROOT}>Opportunity Hub</Link>
                    </h1>
                    <div className="flex flex-col px-5 py-10 lg:px-10 lg:py-15 bg-white">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot password</h1>
                            <p className="text-sm text-slate-600">
                                Enter your email address and we&apos;ll send you a temporary password to log in.
                            </p>
                        </div>

                        {error && (
                            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        {successMessage && (
                            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                                <p>{successMessage}</p>
                                <p className="mt-2">
                                    Check your inbox for the temporary password, then{" "}
                                    <Link to={ROUTES.AUTH.LOGIN} className="font-semibold text-blue-600 hover:underline">
                                        log in
                                    </Link>{" "}
                                    and change your password in account settings.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(null);
                                }}
                                required
                                autoComplete="email"
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mt-6 transition-colors"
                            >
                                {isSubmitting ? "Sending..." : "Send temporary password"}
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        <p className="mt-6 text-sm text-slate-600">
                            Remember your password?{" "}
                            <Link to={ROUTES.AUTH.LOGIN} className="text-blue-600 font-semibold hover:underline">
                                Back to log in
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="hidden lg:flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-10 py-15">
                    <div className="max-w-md text-center">
                        <p className="text-xl text-slate-800 mb-4 italic">
                            The future belongs to those who{" "}
                            <span className="text-blue-600 font-semibold">believe</span> in the{" "}
                            <span className="text-blue-600 font-semibold">beauty of their dreams</span>.
                        </p>
                        <p className="text-slate-600">- Eleanor Roosevelt</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
