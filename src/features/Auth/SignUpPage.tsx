import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Loader2, AlertCircle, Briefcase, Users, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/path";
import { useAuth } from "../../contexts/AuthContext";
import { getHomeRouteForRole } from "./lib/authRoutes";
import { formatApiError } from "../../services/apiClient";
import GoogleSignInButton from "./Components/GoogleSignInButton";

export default function SignUpSeeker() {
    const navigate = useNavigate();
    const { register, loginWithGoogle } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.termsAccepted) {
            setError("Please accept the Terms of Services to continue.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
            const user = await register({
                full_name: fullName,
                email: formData.email.trim(),
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                role: "seeker",
            });
            navigate(getHomeRouteForRole(user.role), { replace: true });
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleCredential = async (idToken: string) => {
        setError(null);

        try {
            const user = await loginWithGoogle(idToken);
            navigate(getHomeRouteForRole(user.role), { replace: true });
        } catch (err) {
            setError(formatApiError(err));
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="flex flex-col">
                    <h1 className="px-6 py-5 text-big text-primary font-bold">
                        <Link to={ROUTES.HOME.ROOT}>Opportunity Hub</Link>
                    </h1>

                    <div className="flex flex-1 items-center justify-center px-6 py-8 lg:px-12">
                        <div className="w-full max-w-md">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
                                <p className="text-sm text-slate-600">
                                    Already have an account?{" "}
                                    <Link to={ROUTES.AUTH.LOGIN} className="text-primary font-semibold hover:underline">
                                        Log in
                                    </Link>
                                </p>
                            </div>

                            {error && (
                                <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <User
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-slate-300 rounded-lg pl-11 pr-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                    />
                                </div>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="email"
                                        className="w-full border border-slate-300 rounded-lg pl-11 pr-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                    />
                                </div>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="new-password"
                                        className="w-full border border-slate-300 rounded-lg pl-11 pr-11 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="new-password"
                                        className="w-full border border-slate-300 rounded-lg pl-11 pr-11 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <label className="flex items-start gap-3 pt-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 mt-1 border border-slate-300 rounded cursor-pointer accent-primary"
                                    />
                                    <span className="text-sm text-slate-600">
                                        I&apos;ve read and agree with your{" "}
                                        <span className="text-primary font-semibold">Terms of Services</span>
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primaryDark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mt-2 transition-colors"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            Create account
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-slate-400 text-xs uppercase tracking-wide">or continue with</span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            <GoogleSignInButton onCredential={handleGoogleCredential} />
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-subPrimary/40 via-white to-subPrimary/60 px-12 py-16">
                    <div className="max-w-md w-full">
                        <div className="space-y-5 mb-10">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white shadow-sm text-primary">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">Thousands of opportunities</p>
                                    <p className="text-sm text-slate-600">Jobs and volunteer roles updated daily</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white shadow-sm text-primary">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">Trusted by employers</p>
                                    <p className="text-sm text-slate-600">Connect directly with hiring teams</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white shadow-sm text-primary">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">Grow your career</p>
                                    <p className="text-sm text-slate-600">Track applications and progress in one place</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200/70 pt-6 text-center">
                            <p className="text-lg text-slate-800 mb-3 italic">
                                The future belongs to those who{" "}
                                <span className="text-primary font-semibold">believe</span> in the{" "}
                                <span className="text-primary font-semibold">beauty of their dreams</span>.
                            </p>
                            <p className="text-slate-500 text-sm">— Eleanor Roosevelt</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
