import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/path";
import { useAuth } from "../../contexts/AuthContext";
import { getHomeRouteForRole } from "./lib/authRoutes";
import { formatApiError } from "../../services/apiClient";

export default function SignUpSeeker() {
    const navigate = useNavigate();
    const { register } = useAuth();
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

    return (
        <div className="min-h-screen bg-white ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div>
                    <h1 className="p-5 text-big text-primary">
                        <Link to={ROUTES.HOME.ROOT}>Opportunity Hub</Link>
                    </h1>
                    <div className="flex flex-col px-5 py-10 lg:px-10 lg:py-15 bg-white">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create account.</h1>
                            <p className="text-sm text-slate-600">
                                Already have account?{" "}
                                <span className="text-blue-600 font-semibold cursor-pointer">
                                    <Link to={ROUTES.AUTH.LOGIN}>Log In</Link>
                                </span>
                            </p>
                        </div>

                        {error && (
                            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                autoComplete="email"
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    autoComplete="new-password"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    autoComplete="new-password"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <div className="flex items-start gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 mt-1 border border-slate-300 rounded cursor-pointer"
                                />
                                <label className="text-sm text-slate-600">
                                    I&apos;ve read and agree with your{" "}
                                    <span className="text-blue-600 font-semibold">Terms of Services</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mt-6 transition-colors"
                            >
                                {isSubmitting ? "Creating account..." : "Create account"}
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-slate-300"></div>
                            <span className="text-slate-400 text-sm">or</span>
                            <div className="flex-1 h-px bg-slate-300"></div>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                disabled
                                className="w-full border border-slate-300 rounded-lg py-3 flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                            >
                                <Mail size={20} className="text-slate-600" />
                                <span className="text-slate-700 font-medium">Sign up with Google (coming soon)</span>
                            </button>
                        </div>
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
