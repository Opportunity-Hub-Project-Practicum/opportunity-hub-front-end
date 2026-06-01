import { Eye } from "lucide-react";
import { useState } from "react";

interface passwordProps {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export default function Password() {
    const [password, setPassword] = useState<passwordProps>({

        currentPassword: "",
        newPassword: "",
        confirmPassword: "",

    })
    return (

        <section className="mb-6">

            <h2 className="text-lg font-semibold mb-6">Change Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-meduim font-semibold text-gray-500">Current Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={password.currentPassword}
                            onChange={(e) => setPassword(prev => ({

                                ...prev,
                                currentPassword: e.target.value,

                            }))}
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
                        />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-meduim  font-semibold text-gray-500">New Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={password.newPassword}
                            onChange={(e) => setPassword(prev => ({

                                ...prev,
                                newPassword: e.target.value,

                            }))}
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
                        />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-meduim  font-semibold text-gray-500">Confirm Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={password.confirmPassword}
                            onChange={(e) => setPassword(prev => ({

                                ...prev,
                                confirmPassword: e.target.value,

                            }))}
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
                        />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" />
                    </div>
                </div>
            </div>
        </section>
    );
}