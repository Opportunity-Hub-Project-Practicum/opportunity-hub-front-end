import { useEffect, useState } from "react";
import { CircleUserRound, Settings, ShieldCheck } from "lucide-react";
import Password from "../../../GlobalComponents/Password";
import { fetchCurrentUser } from "../../../services/authService";

interface AdminProfileData {
    fullName: string;
    email: string;
}

const emptyProfile: AdminProfileData = {
    fullName: "",
    email: "",
};

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<AdminProfileData>(emptyProfile);

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const user = await fetchCurrentUser();

                if (!isMounted) return;

                setProfile({
                    fullName: user.full_name,
                    email: user.email,
                });
            } catch (loadError) {
                if (!isMounted) return;
                setError(
                    loadError instanceof Error ? loadError.message : "Failed to load profile."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="page-container">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Admin Profile</h1>
                    <p className="text-sm text-gray-500">Manage your account and preferences</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    <ShieldCheck size={16} />
                    Administrator
                </span>
            </div>

            <div className="mb-6 flex w-fit gap-4 rounded-xl bg-gray-100 p-1 text-gray-500">
                <button
                    onClick={() => setActiveTab("profile")}
                    type="button"
                    className={`flex items-center gap-2 rounded-lg px-4 py-1 text-sm transition-all ${activeTab === "profile"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "hover:text-gray-700"
                        }`}
                >
                    Profile
                    <CircleUserRound size={16} />
                </button>
                <button
                    onClick={() => setActiveTab("account")}
                    type="button"
                    className={`flex items-center gap-2 rounded-lg px-4 py-1 text-sm transition-all ${activeTab === "account"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "hover:text-gray-700"
                        }`}
                >
                    Account
                    <Settings size={16} />
                </button>
            </div>

            {activeTab === "profile" && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-6 text-lg font-semibold">Personal Information</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full name</label>
                            <p className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900">
                                {profile.fullName}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <p className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900">
                                {profile.email}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "account" && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <Password />

                </div>
            )}
        </div>
    );
}
