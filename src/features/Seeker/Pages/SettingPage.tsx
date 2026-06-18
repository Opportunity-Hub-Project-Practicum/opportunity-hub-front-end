import { useCallback, useEffect, useState } from "react";
import {
    CircleUserRound, Settings,
    Briefcase, MapPin,
} from "lucide-react";
import { getLookupOptions, useLookupValues } from "../../../hooks/useLookupValues";
import { LOOKUP_TYPES } from "../../../types/lookupValue";
import type { LookupValueItem } from "../../../types/lookupValue";
import SeekerProfileSection, { type SeekerFormData } from "../../../GlobalComponents/SeekerProfileSection";
import Password from "../../../GlobalComponents/Password";
import AlertMultiSelectDropdown from "../Components/AlertMultiSelectDropdown";
import { formatApiError } from "../../../services/apiClient";
import { fetchSeekerProfile } from "../services/seekerProfileService";
import { fetchAlertItems } from "../services/alertItemService";
import {
    applyAlertItemsToNotifyForm,
    mapProfileApiToSettings,
    type SeekerAlertSelectionState,
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
    jobAlerts: { categories: [], locations: [] },
    volunteerAlerts: { categories: [], locations: [] },
};

function getAlertSelectionSummary(selection: SeekerAlertSelectionState): string {
    const categoryCount = selection.categories.length;
    const locationCount = selection.locations.length;

    if (categoryCount === 0 && locationCount === 0) {
        return "No alert criteria selected.";
    }

    const parts: string[] = [];
    if (categoryCount > 0) {
        parts.push(`${categoryCount} ${categoryCount === 1 ? "category" : "categories"}`);
    }
    if (locationCount > 0) {
        parts.push(`${locationCount} ${locationCount === 1 ? "location" : "locations"}`);
    }

    const combinationNote = categoryCount > 0 && locationCount > 0
        ? ` · up to ${categoryCount * locationCount} alert combinations`
        : "";

    return `Selected: ${parts.join(", ")}${combinationNote}`;
}

function AlertSelectionSection({
    title,
    selection,
    jobRoleOptions,
    locationOptions,
    disabled,
    onCategoriesChange,
    onLocationsChange,
}: {
    title: string;
    selection: SeekerAlertSelectionState;
    jobRoleOptions: LookupValueItem[];
    locationOptions: LookupValueItem[];
    disabled?: boolean;
    onCategoriesChange: (categories: string[]) => void;
    onLocationsChange: (locations: string[]) => void;
}) {
    return (
        <section className="mb-5">
            <div className="flex flex-col gap-1 mb-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-xs text-slate-500">{getAlertSelectionSummary(selection)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AlertMultiSelectDropdown
                    label="Category"
                    placeholder="Select categories"
                    icon={Briefcase}
                    options={jobRoleOptions}
                    selected={selection.categories}
                    onChange={onCategoriesChange}
                    disabled={disabled}
                />
                <AlertMultiSelectDropdown
                    label="Location"
                    placeholder="Select locations"
                    icon={MapPin}
                    options={locationOptions}
                    selected={selection.locations}
                    onChange={onLocationsChange}
                    disabled={disabled}
                />
            </div>
        </section>
    );
}

export default function Setting() {
    const { lookupValues, loading: lookupLoading, error: lookupError } = useLookupValues();
    const jobRoleOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.jobRole);
    const locationOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.location);

    const [seekerData, setSeekerData] = useState<SeekerFormData | null>(null);
    const [profileMeta, setProfileMeta] = useState<SeekerProfileMeta>({
        cvResumePath: null,
        profileImagePath: null,
        educationIds: [],
        experienceIds: [],
        socialContactIds: {},
    });
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
            const [response, alertItems] = await Promise.all([
                fetchSeekerProfile(),
                fetchAlertItems(),
            ]);
            const mapped = mapProfileApiToSettings(response.profile);
            setSeekerData(mapped.profile);
            setProfileMeta(mapped.meta);
            setSeekerNotifySetting(applyAlertItemsToNotifyForm(mapped.notify, alertItems));
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
            await saveSeekerAccountSettings(seekerNotifySetting);
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
                Profile photos and resumes upload when you click Done.
                Job and volunteer alert preferences are saved when you click Save Changes on the Account tab.
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
                    {lookupError && (
                        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            {lookupError}
                        </p>
                    )}

                    <AlertSelectionSection
                        title="Job Alerts"
                        selection={seekerNotifySetting.jobAlerts}
                        jobRoleOptions={jobRoleOptions}
                        locationOptions={locationOptions}
                        disabled={lookupLoading}
                        onCategoriesChange={(categories) => setSeekerNotifySetting((prev) => ({
                            ...prev,
                            jobAlerts: { ...prev.jobAlerts, categories },
                        }))}
                        onLocationsChange={(locations) => setSeekerNotifySetting((prev) => ({
                            ...prev,
                            jobAlerts: { ...prev.jobAlerts, locations },
                        }))}
                    />

                    <AlertSelectionSection
                        title="Volunteer Alerts"
                        selection={seekerNotifySetting.volunteerAlerts}
                        jobRoleOptions={jobRoleOptions}
                        locationOptions={locationOptions}
                        disabled={lookupLoading}
                        onCategoriesChange={(categories) => setSeekerNotifySetting((prev) => ({
                            ...prev,
                            volunteerAlerts: { ...prev.volunteerAlerts, categories },
                        }))}
                        onLocationsChange={(locations) => setSeekerNotifySetting((prev) => ({
                            ...prev,
                            volunteerAlerts: { ...prev.volunteerAlerts, locations },
                        }))}
                    />

                    <button
                        type="button"
                        onClick={() => void handleSaveAccountSettings()}
                        disabled={isSaving || lookupLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors mb-12 disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <hr className="mb-5 border-gray-100" />

                    <Password email={seekerData.email} />
                </div>
            )}
        </div>
    );
}
