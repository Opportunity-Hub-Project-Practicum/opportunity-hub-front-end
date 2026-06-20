import { useContext, useState } from "react";
import { 
    Eye, 
    EyeOff, 
    ArrowRight, 
    Mail, 
    Lock, 
    Loader2, 
    AlertCircle, 
    Briefcase, 
    Users, 
    TrendingUp, 
    User, 
    Zap, 
    Building2, 
    CheckCircle2 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/path";
import { userMode, setUserMode } from "../../contexts/Context";
import { useAuth } from "../../contexts/AuthContext";
import { getHomeRouteForRole } from "./lib/authRoutes";
import { formatApiError } from "../../services/apiClient";
import GoogleSignInButton from "./Components/GoogleSignInButton";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();
    
    // Access context if provided by parent (e.g., in HomeLayout)
    const mode = useContext(userMode);
    const setMode = useContext(setUserMode);
    
    // Retrieve initial mode with a fallback
    const storedMode = localStorage.getItem("userMode") as "employer" | "seeker" | null;
    const [currentMode, setCurrentMode] = useState<"employer" | "seeker">(storedMode ?? mode ?? "seeker");

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
    });

    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    // Handle interactive mode/role switching
    const handleModeChange = (newMode: "employer" | "seeker") => {
        setCurrentMode(newMode);
        localStorage.setItem("userMode", newMode);
        if (setMode) {
            setMode(newMode);
        }
        // Clear errors and form data to start with a fresh, clean interface
        setApiError(null);
        setFormErrors({ email: "", password: "" });
        setTouched({ email: false, password: false });
    };

    // Client-side field level validation
    const validateField = (name: "email" | "password", value: string) => {
        let errorMsg = "";
        
        if (name === "email") {
            const trimmedVal = value.trim();
            if (!trimmedVal) {
                errorMsg = "Email address is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedVal)) {
                errorMsg = "Please enter a valid email address (e.g. name@company.com)";
            }
        } else if (name === "password") {
            if (!value) {
                errorMsg = "Password is required";
            } else if (value.length < 6) {
                errorMsg = "Password must be at least 6 characters";
            }
        }

        setFormErrors((prev) => ({
            ...prev,
            [name]: errorMsg,
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setApiError(null);

        // If the field was already touched, validate it in real-time as they correct it
        if (touched[name as "email" | "password"]) {
            validateField(name as "email" | "password", value);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
        validateField(name as "email" | "password", value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Touch all fields to trigger validation messages if any are empty
        setTouched({ email: true, password: true });

        const emailVal = formData.email.trim();
        const passwordVal = formData.password;

        let emailErr = "";
        let passwordErr = "";
        let hasErrors = false;

        // Perform final check before submission
        if (!emailVal) {
            emailErr = "Email address is required";
            hasErrors = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            emailErr = "Please enter a valid email address";
            hasErrors = true;
        }

        if (!passwordVal) {
            passwordErr = "Password is required";
            hasErrors = true;
        } else if (passwordVal.length < 6) {
            passwordErr = "Password must be at least 6 characters";
            hasErrors = true;
        }

        setFormErrors({ email: emailErr, password: passwordErr });

        if (hasErrors) {
            return;
        }

        setIsSubmitting(true);
        setApiError(null);

        try {
            const user = await login({
                email: emailVal,
                password: passwordVal,
            });
            navigate(getHomeRouteForRole(user.role), { replace: true });
        } catch (err) {
            setApiError(formatApiError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleCredential = async (idToken: string) => {
        setApiError(null);

        try {
            const user = await loginWithGoogle(idToken);
            navigate(getHomeRouteForRole(user.role), { replace: true });
        } catch (err) {
            setApiError(formatApiError(err));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 min-h-screen">
                {/* Left Column: Form Container */}
                <div className="flex flex-col bg-white">
                    {/* Header/Logo */}
                    <header className="px-6 py-5 lg:px-12 border-b border-slate-100 flex justify-between items-center">
                        <h1 className="text-xl text-primary font-bold tracking-tight hover:opacity-90 transition-all">
                            <Link to={ROUTES.HOME.ROOT}>Opportunity Hub</Link>
                        </h1>
                        <div className="text-xs text-slate-500 font-medium">
                            {currentMode === "employer" ? "For Employers" : "For Seekers"}
                        </div>
                    </header>

                    {/* Inner Form Card */}
                    <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
                        <div className="w-full max-w-md">
                            <div className="mb-8">
                                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                                    Welcome back
                                </h2>
                                <p className="text-sm text-slate-600">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        to={
                                            currentMode === "employer"
                                                ? ROUTES.AUTH.SIGNUP_EMPLOYER
                                                : ROUTES.AUTH.SIGNUP_SEEKER
                                        }
                                        className="text-primary font-semibold hover:underline transition-all"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>

                            {/* Mode Segmented Switcher (Job Seeker vs Employer) */}
                            <div className="flex p-1 bg-slate-100 rounded-xl mb-6 shadow-inner border border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => handleModeChange("seeker")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                        currentMode === "seeker"
                                            ? "bg-white text-primary shadow-sm scale-[1.01]"
                                            : "text-slate-500 hover:text-slate-800"
                                    }`}
                                >
                                    <User size={16} className={currentMode === "seeker" ? "text-primary animate-pulse" : ""} />
                                    Job Seeker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleModeChange("employer")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                        currentMode === "employer"
                                            ? "bg-white text-primary shadow-sm scale-[1.01]"
                                            : "text-slate-500 hover:text-slate-800"
                                    }`}
                                >
                                    <Briefcase size={16} className={currentMode === "employer" ? "text-primary animate-pulse" : ""} />
                                    Employer
                                </button>
                            </div>

                            {/* API Error Messages */}
                            {apiError && (
                                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 backdrop-blur-sm p-4 text-sm text-red-700 animate-fadeIn">
                                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                                    <div className="font-medium">{apiError}</div>
                                </div>
                            )}

                            {/* Main Form */}
                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                {/* Email Field */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                                                formErrors.email ? "text-red-400" : "text-slate-400"
                                            }`}
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            autoComplete="email"
                                            className={`w-full border rounded-lg pl-11 pr-4 py-3 text-sm placeholder-slate-400 focus:outline-none transition-all duration-200 ${
                                                formErrors.email
                                                    ? "border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/10"
                                                    : "border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            }`}
                                        />
                                    </div>
                                    {formErrors.email && (
                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium animate-fadeIn">
                                            <AlertCircle size={13} className="shrink-0" />
                                            {formErrors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                                            Password
                                        </label>
                                        <Link
                                            to={ROUTES.AUTH.FORGOT_PASSWORD}
                                            className="text-xs text-primary font-semibold hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock
                                            size={18}
                                            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                                                formErrors.password ? "text-red-400" : "text-slate-400"
                                            }`}
                                        />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            autoComplete="current-password"
                                            className={`w-full border rounded-lg pl-11 pr-11 py-3 text-sm placeholder-slate-400 focus:outline-none transition-all duration-200 ${
                                                formErrors.password
                                                    ? "border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/10"
                                                    : "border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {formErrors.password && (
                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium animate-fadeIn">
                                            <AlertCircle size={13} className="shrink-0" />
                                            {formErrors.password}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primaryDark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mt-4 shadow-sm hover:shadow active:scale-[0.98] transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Log in
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
                                    or continue with
                                </span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            <GoogleSignInButton onCredential={handleGoogleCredential} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Decorative & Dynamic Benefits Column (Visible on Desktop) */}
                <div className="hidden lg:flex relative overflow-hidden flex-col items-center justify-center bg-gradient-to-br from-subPrimary/30 via-slate-50 to-subPrimary/50 px-12 py-16 border-l border-slate-100">
                    {/* Glowing glassmorphism-inspired background blur shapes */}
                    <div className="absolute -top-16 -left-16 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
                    <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-subPrimary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                    
                    <div className="max-w-md w-full relative z-10">
                        {/* Seeker Benefits View */}
                        {currentMode === "seeker" && (
                            <div className="animate-fadeIn">
                                <h3 className="text-2xl font-extrabold text-slate-950 mb-6 tracking-tight leading-tight">
                                    Launch your career with <span className="text-primary">Opportunity Hub</span>
                                </h3>
                                <div className="space-y-6 mb-10">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary shrink-0">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-base">Thousands of opportunities</p>
                                            <p className="text-sm text-slate-600 mt-1">Jobs and volunteer roles updated daily across major industries.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary shrink-0">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-base">Trusted by employers</p>
                                            <p className="text-sm text-slate-600 mt-1">Connect directly with hiring teams who want your unique skills.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary shrink-0">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-base">Grow your career</p>
                                            <p className="text-sm text-slate-600 mt-1">Track applications, manage your profile, and measure your success.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200/80 pt-6 text-center">
                                    <p className="text-lg text-slate-800 mb-3 italic font-medium leading-relaxed">
                                        &ldquo;The future belongs to those who{" "}
                                        <span className="text-primary font-bold">believe</span> in the{" "}
                                        <span className="text-primary font-bold">beauty of their dreams</span>.&rdquo;
                                    </p>
                                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">— Eleanor Roosevelt</p>
                                </div>
                            </div>
                        )}

                        {/* Employer Benefits View */}
                        {currentMode === "employer" && (
                            <div className="animate-fadeIn">
                                <h3 className="text-2xl font-extrabold text-slate-950 mb-6 tracking-tight leading-tight">
                                    Find the perfect talent for your <span className="text-primary">Business</span>
                                </h3>
                                <div className="space-y-6 mb-10">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary shrink-0">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-base">Post in seconds</p>
                                            <p className="text-sm text-slate-600 mt-1">List your full-time, part-time, or volunteer roles effortlessly with our streamlined flows.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary shrink-0">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-base">Reach qualified candidates</p>
                                            <p className="text-sm text-slate-600 mt-1">Engage with passionate seekers who align with your organizational mission.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary shrink-0">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-base">Streamlined candidate tracking</p>
                                            <p className="text-sm text-slate-600 mt-1">Manage applications, screen profiles, and connect with candidates directly in one place.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200/80 pt-6 text-center">
                                    <p className="text-lg text-slate-800 mb-3 italic font-medium leading-relaxed">
                                        &ldquo;Great vision without{" "}
                                        <span className="text-primary font-bold">great people</span> is{" "}
                                        <span className="text-primary font-bold">irrelevant</span>.&rdquo;
                                    </p>
                                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">— Jim Collins</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
