import { useCallback, useEffect, useState } from "react";
import { CircleUserRound, Settings } from "lucide-react";
import type { EmployerData } from "../../../GlobalComponents/OrganizationForm";
import Password from "../../../GlobalComponents/Password";
import EmployerProfileSection from "../Components/EmployerProfileSection";
import { formatApiError } from "../../../services/apiClient";
import type { EmployerProfileMeta } from "../lib/employerProfileMappers";
import { reloadEmployerSettings, saveEmployerProfileSettings } from "../lib/employerProfileSave";

export default function SettingPage() {
    const [formData, setFormData] = useState<EmployerData | null>(null);
    const [savedData, setSavedData] = useState<EmployerData | null>(null);
    const [profileMeta, setProfileMeta] = useState<EmployerProfileMeta>({
        logoPath: null,
        socialContactIds: {},
    });
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
            const settings = await reloadEmployerSettings();
            setFormData(settings.formData);
            setSavedData(settings.formData);
            setProfileMeta(settings.meta);
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadSettings();
    }, [loadSettings]);

    const handleFieldChange = <K extends keyof EmployerData>(field: K, value: EmployerData[K]) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleStartEdit = () => {
        setIsEditing(true);
        setError(null);
        setSuccess(null);
    };

    const handleCancelEdit = () => {
        if (savedData) {
            setFormData(savedData);
        }
        setIsEditing(false);
        setError(null);
        setSuccess(null);
    };

    const handleSave = async () => {
        if (!formData) {
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const updatedMeta = await saveEmployerProfileSettings(formData, profileMeta);
            const refreshed = await reloadEmployerSettings();
            setFormData(refreshed.formData);
            setSavedData(refreshed.formData);
            setProfileMeta({ ...refreshed.meta, ...updatedMeta });
            setIsEditing(false);
            setSuccess("Profile saved successfully.");
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !formData) {
        return (
            <div className="w-full p-6 bg-white min-h-screen text-sm text-slate-600">
                Loading employer profile...
            </div>
        );
    }

    return (
        <div className="w-full bg-white min-h-screen">
            <div className="w-full p-3">
                <div className="mb-4 flex w-fit gap-4 rounded-xl bg-gray-100 p-1 text-gray-500">
                    <button
                        type="button"
                        onClick={() => setIsProfile(true)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-1 text-sm transition-all ${isProfile ? "bg-white text-primary shadow-sm" : "hover:text-gray-700"}`}
                    >
                        Profile <CircleUserRound size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsProfile(false)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-1 text-sm transition-all ${!isProfile ? "bg-white text-primary shadow-sm" : "hover:text-gray-700"}`}
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

                {isProfile && (
                    <p className="mb-4 text-xs text-slate-500">
                        Company logo uploads when you click Save. Password and account actions are under the Account tab.
                    </p>
                )}
            </div>

            {isProfile && (
                <EmployerProfileSection
                    data={formData}
                    isEditing={isEditing}
                    isSaving={isSaving}
                    onFieldChange={handleFieldChange}
                    onStartEdit={handleStartEdit}
                    onSave={() => void handleSave()}
                    onCancel={handleCancelEdit}
                />
            )}

            {!isProfile && (
                <div className="w-full min-h-screen bg-white p-8 text-slate-700">
                    <Password email={formData.email} />
                </div>
            )}
        </div>
    );
}
