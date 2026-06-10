import { useCallback, useEffect, useState } from "react";
import {
    CircleUserRound, Settings,
    Briefcase, MapPin, XCircle,
} from "lucide-react";
import SeekerProfileSection, { type SeekerFormData } from "../../../GlobalComponents/SeekerProfileSection";
import Password from "../../../GlobalComponents/Password";
import { formatApiError } from "../../../services/apiClient";
import { fetchSeekerProfile } from "../services/seekerProfileService";
import {
    mapProfileApiToSettings,
    type SeekerNotifyFormState,
    type SeekerProfileMeta,
} from "../lib/seekerProfileMappers";
import {
    reloadSeekerSettings,
    saveSeekerAccountSettings,
    saveSeekerProfileSettings,
} from "../lib/seekerProfileSave";

const EMPTY_NOTIFY: SeekerNotifyFormState = {
    notifications: {
        employerShortlistedMe: false,
        newOpportunity: false,
        appliedJobsExpire: false,
        employerRejectedMe: false,
        notifyOnHire: false,
    },
    jobAlerts: { role: "", location: "" },
    volunteerAlerts: { role: "", location: "" },
    profilePrivacy: true,
    alertCategory: "job",
};

export default function Setting() {
    const [seekerData, setSeekerData] = useState<SeekerFormData | null>(null);
    const [profileMeta, setProfileMeta] = useState<SeekerProfileMeta>({ cvResumePath: null });
    const [seekerNotifySetting, setSeekerNotifySetting] = useState<SeekerNotifyFormState>(EMPTY_NOTIFY);

    const [isProfile, setIsProfile] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const loadSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetchSeekerProfile();
            const mapped = mapProfileApiToSettings(response.profile);
            setSeekerData(mapped.profile);
            setProfileMeta(mapped.meta);
            setSeekerNotifySetting(mapped.notify);
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadSettings();
    }, [loadSettings]);

    const handleFieldChange = <K extends keyof SeekerFormData>(field: K, value: SeekerFormData[K]) => {
        setSeekerData((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleToggleEdit = async () => {
        if (!seekerData) {
            return;
        }

        if (isEditing) {
            setIsSaving(true);
            setError(null);
            setSuccess(null);

            try {
                const updatedMeta = await saveSeekerProfileSettings(
                    seekerData,
                    profileMeta,
                    seekerNotifySetting.profilePrivacy,
                );
                const refreshed = await reloadSeekerSettings();
                setSeekerData(refreshed.profile);
                setProfileMeta({ ...refreshed.meta, ...updatedMeta });
                setSeekerNotifySetting(refreshed.notify);
                setSuccess("Profile saved successfully.");
                setIsEditing(false);
            } catch (err) {
                setError(formatApiError(err));
            } finally {
                setIsSaving(false);
            }
            return;
        }

        setIsEditing(true);
    };

    const handleSaveAccountSettings = async () => {
        if (!seekerData) {
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await saveSeekerAccountSettings(seekerNotifySetting, seekerData, profileMeta);
            const refreshed = await reloadSeekerSettings();
            setSeekerData(refreshed.profile);
            setProfileMeta(refreshed.meta);
            setSeekerNotifySetting(refreshed.notify);
            setSuccess("Account settings saved successfully.");
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !seekerData) {
        return (
            <div className="w-full p-6 bg-white min-h-screen text-sm text-slate-600">
                Loading your settings...
            </div>
        );
    }

    return (
        <div className="w-full p-3 bg-white min-h-screen">
            <div className="flex gap-4 bg-gray-100 rounded-xl p-1 text-gray-500 mb-4 w-fit">
                <button
                    onClick={() => setIsProfile(true)}
                    className={`flex items-center gap-2 px-4 py-1 rounded-lg transition-all text-sm ${isProfile ? "bg-white text-blue-600 shadow-sm" : "hover:text-gray-700"}`}
                >
                    Profiles <CircleUserRound size={16} />
                </button>
                <button
                    onClick={() => setIsProfile(false)}
                    className={`flex items-center gap-2 px-4 py-1 rounded-lg transition-all text-sm ${!isProfile ? "bg-white text-blue-600 shadow-sm" : "hover:text-gray-700"}`}
                >
                    Account <Settings size={16} />
                </button>
            </div>

            {error && (
                <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </p>
            )}

            {success && (
                <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    {success}
                </p>
            )}

            <p className="mb-4 text-xs text-slate-500">
                Note: file uploads send a file path string only (no upload API yet). Password change uses forgot-password email.
                Job and volunteer alerts share one backend alert slot — job alerts are saved by default.
            </p>

            {isProfile && (
                <SeekerProfileSection
                    seekerData={seekerData}
                    isEditing={isEditing}
                    onFieldChange={handleFieldChange}
                    onToggleEdit={() => void handleToggleEdit()}
                />
            )}

            {isProfile && isSaving && (
                <p className="mt-2 text-sm text-slate-500">Saving profile...</p>
            )}

            {!isProfile && (
                <div className="w-full min-h-screen bg-white p-8 text-slate-700">
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Notification</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { key: "employerShortlistedMe", label: "Notify me when employers shortlisted me" },
                                { key: "newOpportunity", label: "Notify me when there is new opportunity" },
                                { key: "notifyOnHire", label: "Notify me when I am hired" },
                                { key: "employerRejectedMe", label: "Notify me when employers rejected me" },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={seekerNotifySetting.notifications[key as keyof typeof seekerNotifySetting.notifications]}
                                        onChange={(e) => setSeekerNotifySetting((prev) => ({
                                            ...prev,
                                            notifications: { ...prev.notifications, [key]: e.target.checked },
                                        }))}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="mb-5">
                        <h2 className="text-lg font-semibold mb-2">Job Alerts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Role</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={seekerNotifySetting.jobAlerts.role}
                                        onChange={(e) => setSeekerNotifySetting((prev) => ({
                                            ...prev,
                                            jobAlerts: { ...prev.jobAlerts, role: e.target.value },
                                        }))}
                                        placeholder="Your job roles"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={seekerNotifySetting.jobAlerts.location}
                                        onChange={(e) => setSeekerNotifySetting((prev) => ({
                                            ...prev,
                                            jobAlerts: { ...prev.jobAlerts, location: e.target.value },
                                        }))}
                                        placeholder="City, state, country name"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-5">
                        <h2 className="text-lg font-semibold mb-2">Volunteer Alerts</h2>
                        <p className="text-xs text-amber-700 mb-2">
                            Backend stores one alert category at a time. Saving account settings writes job alerts first.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Role</label>
                                <input
                                    type="text"
                                    value={seekerNotifySetting.volunteerAlerts.role}
                                    onChange={(e) => setSeekerNotifySetting((prev) => ({
                                        ...prev,
                                        volunteerAlerts: { ...prev.volunteerAlerts, role: e.target.value },
                                    }))}
                                    placeholder="Volunteer roles"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Location</label>
                                <input
                                    type="text"
                                    value={seekerNotifySetting.volunteerAlerts.location}
                                    onChange={(e) => setSeekerNotifySetting((prev) => ({
                                        ...prev,
                                        volunteerAlerts: { ...prev.volunteerAlerts, location: e.target.value },
                                    }))}
                                    placeholder="City, state, country name"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-5">
                        <section>
                            <h2 className="text-lg font-semibold mb-2">Profile Privacy</h2>
                            <div className="flex items-center border border-gray-200 rounded-md p-3">
                                <button
                                    type="button"
                                    onClick={() => setSeekerNotifySetting((prev) => ({
                                        ...prev,
                                        profilePrivacy: !prev.profilePrivacy,
                                    }))}
                                    className={`flex items-center rounded-full px-2 py-1 mr-3 ${seekerNotifySetting.profilePrivacy ? "bg-blue-600" : "bg-gray-200"}`}
                                >
                                    <div className="w-3 h-3 bg-white rounded-full mr-2" />
                                    <span className={`text-[10px] font-bold ${seekerNotifySetting.profilePrivacy ? "text-white" : "text-gray-500"}`}>
                                        {seekerNotifySetting.profilePrivacy ? "YES" : "NO"}
                                    </span>
                                </button>
                                <span className="text-sm text-gray-500">
                                    {seekerNotifySetting.profilePrivacy
                                        ? "Your profile is public"
                                        : "Your profile is private"}
                                </span>
                            </div>
                        </section>
                    </div>

                    <button
                        type="button"
                        onClick={() => void handleSaveAccountSettings()}
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors mb-12 disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <hr className="mb-5 border-gray-100" />

                    <Password email={seekerData.email} />

                    <section className="max-w-3xl rounded-3xl border border-rose-100 bg-white p-5 shadow-sm md:p-6 mt-8">
                        <h2 className="text-lg font-semibold mb-2">Delete Your Account</h2>
                        <p className="text-xs text-gray-400 max-w-2xl leading-relaxed mb-4">
                            Account deletion is not available through the API yet.
                        </p>
                        <button
                            type="button"
                            disabled
                            className="flex items-center text-red-400 text-sm font-semibold cursor-not-allowed"
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Close Account (not available)
                        </button>
                    </section>
                </div>
            )}
        </div>
    );
}
