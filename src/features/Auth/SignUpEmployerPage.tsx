import { useState } from "react";
import { ArrowRight, ArrowLeft, Loader2, AlertCircle, Briefcase, Users, Zap, Building2, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/path";
import { useAuth } from "../../contexts/AuthContext";
import { buildEmployerRegisterPayload } from "../Employer/lib/buildEmployerRegisterPayload";
import { uploadLogoIfNeeded } from "../Employer/lib/employerProfileSave";
import { updateEmployerProfile } from "../Employer/services/employerProfileService";
import { getHomeRouteForRole } from "./lib/authRoutes";
import { formatApiError } from "../../services/apiClient";
import { useLookupValues } from "../../hooks/useLookupValues";
import OrganizationForm from "../../GlobalComponents/OrganizationForm";
import type { EmployerData } from "../../GlobalComponents/OrganizationForm";

function validateEmployerForm(data: EmployerData): string | null {
    if (!data.fullName.trim()) return "Please enter your full name.";
    if (!data.email.trim()) return "Please enter your email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return "Please enter a valid email address.";
    
    if (!data.companyName.trim()) return "Company name is required.";
    if (!data.phoneNumber.trim()) return "Company phone number is required.";

    if (data.password.length < 8) return "Password must be at least 8 characters.";
    if (data.password !== data.confirmPassword) return "Passwords do not match.";

    return null;
}

export default function SignUpEmployerPage() {
    const navigate = useNavigate();
    const { registerEmployer } = useAuth();
    const { lookupValues } = useLookupValues();
    const [employerData, setEmployerData] = useState<EmployerData>();
    const [companyInfoTab, setCompanyInfoTab] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!employerData) {
            setError("Please complete the company profile.");
            return;
        }

        const validationError = validateEmployerForm(employerData);
        if (validationError) {
            setError(validationError);
            setCompanyInfoTab(true);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const user = await registerEmployer(buildEmployerRegisterPayload(employerData, lookupValues));

            const uploadedLogoPath = await uploadLogoIfNeeded(employerData);
            if (uploadedLogoPath) {
                await updateEmployerProfile({ logo_img: uploadedLogoPath });
            }

            navigate(getHomeRouteForRole(user.role), { replace: true });
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 h-screen overflow-hidden">
                {/* Left Column: Registration Form */}
                <div className="flex flex-col bg-white h-screen overflow-y-auto">
                    <header className="px-6 py-3 lg:px-12 border-b border-slate-100 sticky top-0 bg-white z-20">
                        <h1 className="text-xl text-primary font-bold tracking-tight">
                            <Link to={ROUTES.HOME.ROOT}>Opportunity Hub</Link>
                        </h1>
                    </header>

                    <div className="flex-1 flex flex-col justify-center px-6 py-6 lg:px-16">
                        <div className="w-full max-w-2xl mx-auto mb-4">
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Employer Account</h2>
                            <p className="text-sm text-slate-600">
                                Already have an account?{" "}
                                <Link to={ROUTES.AUTH.LOGIN} className="text-primary font-semibold hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </div>

                        {error && (
                            <div className="w-full max-w-2xl mx-auto mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4 text-sm text-red-700">
                                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                                <div className="font-medium">{error}</div>
                            </div>
                        )}

                        <div className="w-full max-w-2xl mx-auto">
                            <OrganizationForm
                                onChange={(data) => setEmployerData(data)}
                                companyInfoTab={companyInfoTab}
                                onTabChange={setCompanyInfoTab}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-4 w-full max-w-2xl mx-auto">
                            {!companyInfoTab && (
                                <button
                                    type="button"
                                    onClick={() => setCompanyInfoTab(true)}
                                    className="flex items-center justify-center gap-2 flex-1 px-5 py-3 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                                    disabled={isSubmitting}
                                >
                                    <ArrowLeft size={16} />
                                    Previous
                                </button>
                            )}

                            {companyInfoTab ? (
                                <button
                                    type="button"
                                    onClick={() => setCompanyInfoTab(false)}
                                    className="flex items-center justify-center gap-2 flex-1 px-5 py-3 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primaryDark transition-all shadow-sm active:scale-[0.98]"
                                >
                                    Next
                                    <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center gap-2 flex-1 px-5 py-3 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primaryDark transition-all shadow-sm active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Benefits Column (Visible on Desktop) */}
                <div className="hidden lg:flex relative overflow-hidden flex-col items-center justify-center bg-gradient-to-br from-subPrimary/30 via-slate-50 to-subPrimary/50 px-12 py-16 border-l border-slate-100">
                    <div className="absolute -top-16 -left-16 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
                    <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-subPrimary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                    
                    <div className="max-w-md w-full relative z-10">
                        <h3 className="text-2xl font-extrabold text-slate-950 mb-8 tracking-tight">
                            Find the perfect talent for your <span className="text-primary">Business</span>
                        </h3>
                        <div className="space-y-6">
                            {[
                                { icon: Zap, title: "Post in seconds", desc: "List roles effortlessly." },
                                { icon: Building2, title: "Reach qualified candidates", desc: "Engage with passionate seekers." },
                                { icon: CheckCircle2, title: "Streamlined tracking", desc: "Manage applications in one place." }
                            ].map((benefit, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-white shadow-sm transition-all hover:shadow-md">
                                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary shrink-0">
                                        <benefit.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{benefit.title}</p>
                                        <p className="text-sm text-slate-600 mt-1">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
