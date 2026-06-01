import { useEffect, useState } from "react";
import { CircleUserRound, Settings, ShieldCheck, Upload as UploadIcon } from "lucide-react";
import Password from "../../../GlobalComponents/Password";
import { fetchUserById } from "../../../services/mockJobPortalApi";

const ADMIN_USER_ID = 99;

interface AdminProfileData {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    bio: string;
    avatarUrl: string;
}

interface AdminAccountSettings {
    newReportAlerts: boolean;
    newUserSignups: boolean;
    flaggedPostReviews: boolean;
    weeklySummary: boolean;
}

const emptyProfile: AdminProfileData = {
    fullName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    bio: "",
    avatarUrl: "",
};

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<AdminProfileData>(emptyProfile);
    const [accountSettings, setAccountSettings] = useState<AdminAccountSettings>({
        newReportAlerts: true,
        newUserSignups: true,
        flaggedPostReviews: true,
        weeklySummary: false,
    });

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetchUserById(ADMIN_USER_ID, { delayMs: 350 });

                if (!response.ok) {
                    throw new Error(response.error.message);
                }

                if (!isMounted) return;

                const user = response.data;
                setProfile({
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone ?? "",
                    city: user.city,
                    country: user.country,
                    bio: user.bio,
                    avatarUrl: user.avatarUrl,
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

    const handleProfileChange = <K extends keyof AdminProfileData>(
        field: K,
        value: AdminProfileData[K]
    ) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = () => {
        setIsEditing(false);
    };

    const notificationOptions: { key: keyof AdminAccountSettings; label: string }[] = [
        { key: "newReportAlerts", label: "Notify me when a new post or user is reported" },
        { key: "newUserSignups", label: "Notify me when new users sign up" },
        { key: "flaggedPostReviews", label: "Notify me when flagged posts need review" },
        { key: "weeklySummary", label: "Send weekly platform activity summary" },
    ];

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
                    className={`flex items-center gap-2 rounded-lg px-4 py-1 text-sm transition-all ${
                        activeTab === "profile"
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
                    className={`flex items-center gap-2 rounded-lg px-4 py-1 text-sm transition-all ${
                        activeTab === "account"
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
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold">Personal Information</h2>
                        <button
                            onClick={() =>
                                isEditing ? handleSaveProfile() : setIsEditing(true)
                            }
                            type="button"
                            className="btn-primary-blue"
                        >
                            {isEditing ? "Save Profile" : "Edit Profile"}
                        </button>
                    </div>

                    <div className="mb-8 flex flex-wrap items-center gap-6">
                        {profile.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt={profile.fullName}
                                className="h-24 w-24 rounded-full border object-cover"
                            />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full border bg-slate-200">
                                <CircleUserRound className="text-slate-400" size={40} />
                            </div>
                        )}

                        {isEditing && (
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                            >
                                <UploadIcon size={16} />
                                Change photo
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full name</label>
                            <input
                                type="text"
                                value={profile.fullName}
                                onChange={(e) => handleProfileChange("fullName", e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-md border border-gray-200 px-4 py-2 disabled:bg-gray-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => handleProfileChange("email", e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-md border border-gray-200 px-4 py-2 disabled:bg-gray-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                value={profile.phone}
                                onChange={(e) => handleProfileChange("phone", e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-md border border-gray-200 px-4 py-2 disabled:bg-gray-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                value={profile.city}
                                onChange={(e) => handleProfileChange("city", e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-md border border-gray-200 px-4 py-2 disabled:bg-gray-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Country</label>
                            <input
                                type="text"
                                value={profile.country}
                                onChange={(e) => handleProfileChange("country", e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-md border border-gray-200 px-4 py-2 disabled:bg-gray-50"
                            />
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => handleProfileChange("bio", e.target.value)}
                            disabled={!isEditing}
                            rows={4}
                            className="w-full rounded-md border border-gray-200 px-4 py-2 disabled:bg-gray-50"
                        />
                    </div>
                </div>
            )}

            {activeTab === "account" && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <Password />

                    <section className="mt-8 border-t border-gray-100 pt-8">
                        <h2 className="mb-4 text-lg font-semibold">Admin Notifications</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {notificationOptions.map(({ key, label }) => (
                                <label
                                    key={key}
                                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={accountSettings[key]}
                                        onChange={(e) =>
                                            setAccountSettings((prev) => ({
                                                ...prev,
                                                [key]: e.target.checked,
                                            }))
                                        }
                                        className="h-4 w-4 accent-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <div className="mt-8 flex justify-end">
                        <button type="button" className="btn-primary-blue px-8">
                            Save Account Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
