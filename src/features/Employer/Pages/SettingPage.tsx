import { useCallback, useEffect, useState } from "react";
import OrganizationForm from "../../../GlobalComponents/OrganizationForm";
import type { EmployerData } from "../../../GlobalComponents/OrganizationForm";
import { formatApiError } from "../../../services/apiClient";
import type { EmployerProfileMeta } from "../lib/employerProfileMappers";
import { reloadEmployerSettings, saveEmployerProfileSettings } from "../lib/employerProfileSave";

export default function SettingPage() {
    const [formData, setFormData] = useState<EmployerData | null>(null);
    const [profileMeta, setProfileMeta] = useState<EmployerProfileMeta>({
        logoPath: null,
        socialContactIds: {},
    });
    const [formKey, setFormKey] = useState(0);
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
            setProfileMeta(settings.meta);
            setFormKey((current) => current + 1);
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadSettings();
    }, [loadSettings]);

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
            setProfileMeta({ ...refreshed.meta, ...updatedMeta });
            setFormKey((current) => current + 1);
            setSuccess("Profile saved successfully.");
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            {isLoading && <p className="page-container text-gray-500">Loading employer settings...</p>}
            {error && <p className="page-container text-red-600">{error}</p>}
            {success && <p className="page-container text-green-600">{success}</p>}

            {!isLoading && formData && (
                <OrganizationForm
                    key={formKey}
                    initialData={formData}
                    onChange={(data) => setFormData(data)}
                />
            )}

            <p className="page-container text-sm text-gray-500">
                Note: logo uploads send a file path string only (no upload API yet). Full name, email, and password are not updated by this save action.
            </p>

            <div className="w-full flex justify-end pr-10 md:pr-20 mb-10">
                <button
                    onClick={handleSave}
                    disabled={isLoading || isSaving || !formData}
                    className="btn-primary-blue px-10 disabled:opacity-60"
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}
