import { useRef, useState, type ReactNode } from "react";
import {
    Briefcase,
    Building2,
    Calendar,
    Camera,
    Globe,
    Mail,
    MapPin,
    Pencil,
    Phone,
    UserRound,
} from "lucide-react";
import type { EmployerData } from "../../../GlobalComponents/OrganizationForm";
import LookupSelect from "../../../GlobalComponents/LookupSelect";
import RichTextContent from "../../../GlobalComponents/RichTextContent";
import SocialLinksSection from "../../../GlobalComponents/socialLink";
import TextAreaBox from "../../../GlobalComponents/textAreaBox";
import { getLookupOptions, useLookupValues } from "../../../hooks/useLookupValues";
import { resolveLookupStoredValue } from "../../../lib/lookupValueUtils";
import { LOOKUP_TYPES } from "../../../types/lookupValue";
import {
    teamSizeLookupValueToNumber,
    teamSizeNumberToLookupValue,
} from "../lib/employerLookupUtils";
import Upload from "../../Seeker/libs/uploadFile";

type EmployerProfileSectionProps = {
    data: EmployerData;
    isEditing?: boolean;
    isSaving?: boolean;
    /** When true: read-only display with no edit controls (e.g. admin viewing a profile). */
    viewOnly?: boolean;
    onFieldChange?: <K extends keyof EmployerData>(field: K, value: EmployerData[K]) => void;
    onStartEdit?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
};

const SOCIAL_LABELS: Record<string, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    twitter: "Twitter",
    linkedin: "LinkedIn",
    website: "Website",
};

function displayValue(value?: string | null): string {
    const trimmed = value?.trim();
    return trimmed ? trimmed : "—";
}

function formatEstablishmentYear(value: string): string {
    if (!value.trim()) {
        return "—";
    }

    if (/^\d{4}$/.test(value.trim())) {
        return value.trim();
    }

    const year = new Date(value).getFullYear();
    return Number.isFinite(year) ? String(year) : value;
}

function ViewField({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                {icon}
                <span>{label}</span>
            </div>
            <p className="break-words text-sm font-medium text-slate-800">{value}</p>
        </div>
    );
}

function EditField({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    disabled = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
        </div>
    );
}

function TabButton({
    active,
    label,
    icon,
    onClick,
}: {
    active: boolean;
    label: string;
    icon: ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                active ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

export default function EmployerProfileSection({
    data,
    isEditing = false,
    isSaving = false,
    viewOnly = false,
    onFieldChange,
    onStartEdit,
    onSave,
    onCancel,
}: EmployerProfileSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCompanyInfo, setIsCompanyInfo] = useState(true);
    const { lookupValues, loading: lookupLoading } = useLookupValues();
    const organizationTypeOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.organizationType);
    const industryOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.industry);
    const teamSizeOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.teamSize);
    const locationOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.location);
    const logoUrl = data.logo?.url;
    const activeSocialLinks = data.socialLinks.filter((link) => link.url.trim().length > 0);
    const editing = viewOnly ? false : isEditing;

    const organizationTypeLabel = resolveLookupStoredValue(data.organizationType, organizationTypeOptions);
    const industryTypeLabel = resolveLookupStoredValue(data.industryType, industryOptions);
    const locationLabel = resolveLookupStoredValue(data.location, locationOptions);
    const teamSizeLabel = (() => {
        const fromLookup = resolveLookupStoredValue(data.teamSize, teamSizeOptions);
        if (fromLookup) {
            return fromLookup;
        }

        const numericTeamSize = teamSizeLookupValueToNumber(data.teamSize);
        if (numericTeamSize !== undefined) {
            const lookupValue = teamSizeNumberToLookupValue(numericTeamSize);
            return resolveLookupStoredValue(lookupValue, teamSizeOptions) || String(numericTeamSize);
        }

        return data.teamSize;
    })();

    return (
        <div className="page-container flex flex-col items-center py-6">
            <div className="mb-5 w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="h-20 w-full bg-gradient-to-r from-primary to-blue-400 sm:h-24" />

                <div className="flex flex-col gap-4 px-6 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                        <div className="relative -mt-12 shrink-0 sm:-mt-10">
                            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Company logo" className="h-full w-full object-cover" />
                                ) : (
                                    <Building2 size={36} className="text-slate-300" />
                                )}
                            </div>

                            {editing && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        title={logoUrl ? "Change logo" : "Upload logo"}
                                        className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-md transition hover:bg-primary/90"
                                    >
                                        <Camera size={16} />
                                    </button>
                                    <Upload
                                        kind="image"
                                        inputRef={fileInputRef}
                                        onUpload={(file) => onFieldChange?.("logo", file)}
                                    />
                                </>
                            )}
                        </div>

                        <div className="text-center sm:text-left">
                            <h1 className="text-lg font-semibold text-slate-900">
                                {displayValue(data.companyName) !== "—" ? data.companyName : "Company profile"}
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">
                                {editing ? "Edit your company information." : "View company profile."}
                            </p>
                        </div>
                    </div>

                    {!viewOnly && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {editing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={onCancel}
                                        disabled={isSaving}
                                        className="btn-primary-white disabled:opacity-60"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onSave}
                                        disabled={isSaving}
                                        className="btn-primary-blue disabled:opacity-60"
                                    >
                                        {isSaving ? "Saving..." : "Save"}
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onStartEdit}
                                    className="btn-primary-blue inline-flex items-center gap-2"
                                >
                                    <Pencil size={16} />
                                    Edit profile
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex w-full max-w-4xl flex-col gap-5 px-2">
                <nav className="mb-1 flex w-fit gap-1 rounded-xl bg-slate-100 p-1">
                    <TabButton
                        active={isCompanyInfo}
                        label="Company Info"
                        icon={<UserRound size={16} />}
                        onClick={() => setIsCompanyInfo(true)}
                    />
                    <TabButton
                        active={!isCompanyInfo}
                        label="Company Detail"
                        icon={<Briefcase size={16} />}
                        onClick={() => setIsCompanyInfo(false)}
                    />
                </nav>

                {isCompanyInfo ? (
                    <section className="w-full space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="w-full">
                            {editing ? (
                                <SocialLinksSection
                                    links={data.socialLinks}
                                    setLinks={(links) => {
                                        const nextLinks = typeof links === "function" ? links(data.socialLinks) : links;
                                        onFieldChange?.("socialLinks", nextLinks);
                                    }}
                                    readOnly={false}
                                />
                            ) : activeSocialLinks.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-slate-600">Social links</p>
                                    <div className="flex flex-col gap-2">
                                        {activeSocialLinks.map((link) => (
                                            <a
                                                key={link.id}
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-primary hover:bg-slate-50"
                                            >
                                                <span className="font-medium text-slate-700">
                                                    {SOCIAL_LABELS[link.platform] ?? link.platform}:
                                                </span>{" "}
                                                {link.url}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <ViewField label="Social links" value="No social links added yet." />
                            )}
                        </div>

                        {editing ? (
                            <>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <EditField
                                        label="Your full name"
                                        value={data.fullName}
                                        onChange={(value) => onFieldChange?.("fullName", value)}
                                        placeholder="Full name"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <EditField
                                        label="Company name"
                                        value={data.companyName}
                                        onChange={(value) => onFieldChange?.("companyName", value)}
                                        placeholder="Company name"
                                    />
                                    <LookupSelect
                                        label="Location"
                                        value={data.location}
                                        options={locationOptions}
                                        placeholder="Select location"
                                        disabled={lookupLoading}
                                        onChange={(value) => onFieldChange?.("location", value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <EditField
                                        label="Phone number"
                                        value={data.phoneNumber}
                                        onChange={(value) => onFieldChange?.("phoneNumber", value)}
                                        placeholder="Phone number"
                                    />
                                    <EditField
                                        label="Email"
                                        value={data.email}
                                        onChange={(value) => onFieldChange?.("email", value)}
                                        placeholder="Company email"
                                        type="email"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-600">About company</label>
                                    <TextAreaBox
                                        value={data.aboutCompany}
                                        onChange={(value: unknown) =>
                                            onFieldChange?.(
                                                "aboutCompany",
                                                typeof value === "string" ? value : ((value as { target?: { value?: string } })?.target?.value ?? ""),
                                            )
                                        }
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <ViewField label="Full name" value={displayValue(data.fullName)} icon={<UserRound size={13} />} />
                                    <ViewField label="Company name" value={displayValue(data.companyName)} icon={<Building2 size={13} />} />
                                    <ViewField label="Location" value={displayValue(locationLabel)} icon={<MapPin size={13} />} />
                                    <ViewField label="Phone number" value={displayValue(data.phoneNumber)} icon={<Phone size={13} />} />
                                    <ViewField label="Email" value={displayValue(data.email)} icon={<Mail size={13} />} />
                                </div>

                                <div>
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">About company</p>
                                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-4 text-sm leading-relaxed text-slate-700">
                                        <RichTextContent
                                            value={data.aboutCompany}
                                            className="text-sm leading-relaxed text-slate-700"
                                            emptyText="—"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                ) : (
                    <section className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        {editing ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <LookupSelect
                                    label="Organization type"
                                    value={data.organizationType}
                                    options={organizationTypeOptions}
                                    placeholder="Select organization type"
                                    disabled={lookupLoading}
                                    onChange={(value) => onFieldChange?.("organizationType", value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />
                                <LookupSelect
                                    label="Industry type"
                                    value={data.industryType}
                                    options={industryOptions}
                                    placeholder="Select industry"
                                    disabled={lookupLoading}
                                    onChange={(value) => onFieldChange?.("industryType", value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />
                                <LookupSelect
                                    label="Team size"
                                    value={data.teamSize}
                                    options={teamSizeOptions}
                                    placeholder="Select team size"
                                    disabled={lookupLoading}
                                    onChange={(value) => onFieldChange?.("teamSize", value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />
                                <EditField
                                    label="Year of establishment"
                                    value={data.yearOfEstablishment}
                                    onChange={(value) => onFieldChange?.("yearOfEstablishment", value)}
                                    type="date"
                                />
                                <div className="md:col-span-2">
                                    <EditField
                                        label="Company website"
                                        value={data.companyWebsite}
                                        onChange={(value) => onFieldChange?.("companyWebsite", value)}
                                        placeholder="https://example.com"
                                        type="url"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="mb-2 block text-xs font-medium text-slate-600">Company vision</label>
                                    <TextAreaBox
                                        value={data.companyVision}
                                        onChange={(value: unknown) =>
                                            onFieldChange?.(
                                                "companyVision",
                                                typeof value === "string" ? value : ((value as { target?: { value?: string } })?.target?.value ?? ""),
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <ViewField label="Organization type" value={displayValue(organizationTypeLabel)} />
                                <ViewField label="Industry type" value={displayValue(industryTypeLabel)} />
                                <ViewField label="Team size" value={displayValue(teamSizeLabel)} />
                                <ViewField
                                    label="Year of establishment"
                                    value={formatEstablishmentYear(data.yearOfEstablishment)}
                                    icon={<Calendar size={13} />}
                                />
                                <ViewField
                                    label="Company website"
                                    value={displayValue(data.companyWebsite)}
                                    icon={<Globe size={13} />}
                                />
                                <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 md:col-span-3">
                                    <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Company vision</div>
                                    <RichTextContent
                                        value={data.companyVision}
                                        className="text-sm leading-relaxed text-slate-800"
                                        emptyText="—"
                                    />
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
