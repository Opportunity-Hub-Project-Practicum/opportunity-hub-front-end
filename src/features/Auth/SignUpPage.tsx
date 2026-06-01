import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/path";

export default function SignUpSeeker() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(ROUTES.HOME.ROOT)
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
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create account.</h1>
                            <p className="text-sm text-slate-600">
                                Already have account?{" "}
                                <span className="text-blue-600 font-semibold cursor-pointer"><Link to={ROUTES.AUTH.LOGIN}>Log In</Link></span>
                            </p>
                        </div>



                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* First Name and Last Name */}
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

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

                            {/* Confirm Password */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
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

                            {/* Checkbox */}
                            <div className="flex items-start gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 mt-1 border border-slate-300 rounded cursor-pointer"
                                />
                                <label className="text-sm text-slate-600">
                                    I've read and agree with your{" "}
                                    <span className="text-blue-600 font-semibold">Terms of Services</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
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
