import { useCallback, useEffect, useState } from "react";
import type { EmployerData } from "../../../GlobalComponents/OrganizationForm";
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
            <div className="flex min-h-[50vh] items-center justify-center px-4 text-sm text-slate-500">
                Loading employer profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {error && (
                <div className="mx-auto max-w-5xl px-4 pt-6 md:px-6">
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {success && (
                <div className="mx-auto max-w-5xl px-4 pt-6 md:px-6">
                    <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {success}
                    </p>
                </div>
            )}

            <EmployerProfileSection
                data={formData}
                isEditing={isEditing}
                isSaving={isSaving}
                onFieldChange={handleFieldChange}
                onStartEdit={handleStartEdit}
                onSave={() => void handleSave()}
                onCancel={handleCancelEdit}
            />
        </div>
    );
}
