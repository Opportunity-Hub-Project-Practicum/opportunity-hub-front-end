import { useRef, useState, type ReactNode } from "react";
import {
    Building2,
    Calendar,
    Globe,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Upload as UploadIcon,
    UserRound,
} from "lucide-react";
import type { EmployerData } from "../../../GlobalComponents/OrganizationForm";
import SocialLinksSection from "../../../GlobalComponents/socialLink";
import TextAreaBox from "../../../GlobalComponents/textAreaBox";
import Upload from "../../Seeker/libs/uploadFile";

type EmployerProfileSectionProps = {
    data: EmployerData;
    isEditing: boolean;
    isSaving?: boolean;
    onFieldChange: <K extends keyof EmployerData>(field: K, value: EmployerData[K]) => void;
    onStartEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
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
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-start gap-2"
        >
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <UserRound className="text-primary" size={18} />
                {label}
            </span>
            <div className={`mt-1 h-0.5 w-full ${active ? "bg-primary" : "bg-transparent"}`} />
        </button>
    );
}

export default function EmployerProfileSection({
    data,
    isEditing,
    isSaving = false,
    onFieldChange,
    onStartEdit,
    onSave,
    onCancel,
}: EmployerProfileSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCompanyInfo, setIsCompanyInfo] = useState(true);
    const logoUrl = data.logo?.url;
    const activeSocialLinks = data.socialLinks.filter((link) => link.url.trim().length > 0);

    return (
        <div className="page-container flex flex-col items-center  py-6">
            <div className="mb-6 flex w-full max-w-4xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">Company profile</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {isEditing ? "Edit your company information." : "View your company profile."}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {isEditing ? (
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
            </div>

            <div className="flex w-full max-w-4xl flex-col gap-5 px-2">
                <nav className="mb-2 flex w-full gap-8 border-b border-slate-100 pb-1">
                    <TabButton
                        active={isCompanyInfo}
                        label="Company Info"
                        onClick={() => setIsCompanyInfo(true)}
                    />
                    <TabButton
                        active={!isCompanyInfo}
                        label="Company Detail"
                        onClick={() => setIsCompanyInfo(false)}
                    />
                </nav>

                {isCompanyInfo ? (
                    <section className="w-full space-y-6">
                        <div className="flex w-full flex-col gap-4 md:flex-row">
                            <div className="shrink-0">
                                <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-4">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Company logo" className="absolute inset-0 h-full w-full object-cover" />
                                    ) : (
                                        <Building2 size={36} className="text-slate-300" />
                                    )}

                                    {isEditing && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute inset-0 flex items-center justify-center bg-slate-900/45 text-xs font-medium text-white opacity-0 transition hover:opacity-100"
                                            >
                                                <UploadIcon size={16} className="mr-1" />
                                                Change
                                            </button>
                                            <Upload
                                                kind="image"
                                                inputRef={fileInputRef}
                                                onUpload={(file) => onFieldChange("logo", file)}
                                            />
                                        </>
                                    )}
                                </div>
                                <span className="mt-2 flex justify-center text-sm text-slate-500">
                                    {isEditing ? (logoUrl ? "Change logo" : "Upload logo") : "Company logo"}
                                </span>
                            </div>

                            <div className="w-full">
                                {isEditing ? (
                                    <SocialLinksSection
                                        links={data.socialLinks}
                                        setLinks={(links) => {
                                            const nextLinks = typeof links === "function" ? links(data.socialLinks) : links;
                                            onFieldChange("socialLinks", nextLinks);
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
                                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-blue-600 hover:bg-slate-50"
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
                        </div>

                        {isEditing ? (
                            <>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <EditField
                                        label="Your full name"
                                        value={data.fullName}
                                        onChange={(value) => onFieldChange("fullName", value)}
                                        placeholder="Full name"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <EditField
                                        label="Company name"
                                        value={data.companyName}
                                        onChange={(value) => onFieldChange("companyName", value)}
                                        placeholder="Company name"
                                    />
                                    <EditField
                                        label="Location"
                                        value={data.location}
                                        onChange={(value) => onFieldChange("location", value)}
                                        placeholder="Location"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <EditField
                                        label="Phone number"
                                        value={data.phoneNumber}
                                        onChange={(value) => onFieldChange("phoneNumber", value)}
                                        placeholder="Phone number"
                                    />
                                    <EditField
                                        label="Email"
                                        value={data.email}
                                        onChange={(value) => onFieldChange("email", value)}
                                        placeholder="Company email"
                                        type="email"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-600">About company</label>
                                    <TextAreaBox
                                        value={data.aboutCompany}
                                        onChange={(value: unknown) =>
                                            onFieldChange(
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
                                    <ViewField label="Location" value={displayValue(data.location)} icon={<MapPin size={13} />} />
                                    <ViewField label="Phone number" value={displayValue(data.phoneNumber)} icon={<Phone size={13} />} />
                                    <ViewField label="Email" value={displayValue(data.email)} icon={<Mail size={13} />} />
                                </div>

                                <div>
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">About company</p>
                                    <p className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                                        {displayValue(data.aboutCompany)}
                                    </p>
                                </div>
                            </>
                        )}
                    </section>
                ) : (
                    <section className="w-full">
                        {isEditing ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <EditField
                                    label="Organization type"
                                    value={data.organizationType}
                                    onChange={(value) => onFieldChange("organizationType", value)}
                                    placeholder="Organization type"
                                />
                                <EditField
                                    label="Industry type"
                                    value={data.industryType}
                                    onChange={(value) => onFieldChange("industryType", value)}
                                    placeholder="Industry type"
                                />
                                <EditField
                                    label="Team size"
                                    value={data.teamSize}
                                    onChange={(value) => onFieldChange("teamSize", value)}
                                    placeholder="Team size"
                                />
                                <EditField
                                    label="Year of establishment"
                                    value={data.yearOfEstablishment}
                                    onChange={(value) => onFieldChange("yearOfEstablishment", value)}
                                    type="date"
                                />
                                <div className="md:col-span-2">
                                    <EditField
                                        label="Company website"
                                        value={data.companyWebsite}
                                        onChange={(value) => onFieldChange("companyWebsite", value)}
                                        placeholder="https://example.com"
                                        type="url"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="mb-2 block text-xs font-medium text-slate-600">Company vision</label>
                                    <TextAreaBox
                                        value={data.companyVision}
                                        onChange={(value: unknown) =>
                                            onFieldChange(
                                                "companyVision",
                                                typeof value === "string" ? value : ((value as { target?: { value?: string } })?.target?.value ?? ""),
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <ViewField label="Organization type" value={displayValue(data.organizationType)} />
                                <ViewField label="Industry type" value={displayValue(data.industryType)} />
                                <ViewField label="Team size" value={displayValue(data.teamSize)} />
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
                                    <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                                        {displayValue(data.companyVision)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
