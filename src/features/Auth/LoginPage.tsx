import { useContext, useState } from "react";
import { Eye, EyeOff, ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/path";
import { userMode } from "../../contexts/Context";
export default function LoginPage() {
    const mode = useContext(userMode);
    const storedMode = localStorage.getItem('userMode') as 'employer' | 'seeker' | null;
    const activeMode = storedMode ?? mode;
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({

        email: "",
        password: "",

    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (

        <div className="min-h-screen bg-white ">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left Section - Form */}
                <div>
                    <h1 className="p-5 text-big text-primary"><Link to={ROUTES.HOME.ROOT}>Opportunity Hub</Link></h1><div className="flex flex-col px-5 py-10 lg:px-10 lg:py-15 bg-white">
                        {/* Heading */}

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Log In</h1>
                            <p className="text-sm text-slate-600">
                                Don't have an account?{" "}
                                <span className="text-blue-600 font-semibold cursor-pointer"><Link to={activeMode === 'employer' ? ROUTES.AUTH.SIGNUP_EMPLOYER : ROUTES.AUTH.SIGNUP_SEEKER}>Sign UP</Link></span>
                            </p>
                        </div>



                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">


                            {/* Email */}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
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



                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mt-6 transition-colors"
                            >
                                Create account
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-slate-300"></div>
                            <span className="text-slate-400 text-sm">or</span>
                            <div className="flex-1 h-px bg-slate-300"></div>
                        </div>

                        {/* Social Sign Up */}
                        <div className="space-y-3">

                            <button className="w-full border border-slate-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                                <Mail size={20} className="text-slate-600" />
                                <span className="text-slate-700 font-medium">Sign up with Google</span>
                            </button>
                        </div>
                    </div></div>



                {/* Right Section - Quote */}
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
