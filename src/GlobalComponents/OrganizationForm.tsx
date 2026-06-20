import { UserRound } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

// Swap these imports to match your actual paths.
import Upload from "../features/Seeker/libs/uploadFile"
import type { File as UploadFile } from "../features/Seeker/libs/uploadFile"
import { getLookupOptions, useLookupValues } from "../hooks/useLookupValues"
import { LOOKUP_TYPES } from "../types/lookupValue"
import LookupSelect from "./LookupSelect"
import SocialLinksSection from "./socialLink"
import TextAreaBox from "./textAreaBox"

// ─── Types ────────────────────────────────────────────────────────────────────

export type SocialLink = {
    id: string
    platform: string
    url: string
}

export type EmployerData = {
    fullName: string
    password: string
    confirmPassword: string
    currentPassword: string
    companyName: string
    location: string
    phoneNumber: string
    email: string
    aboutCompany: string
    organizationType: string
    industryType: string
    teamSize: string
    yearOfEstablishment: string
    companyWebsite: string
    companyVision: string
    logo?: UploadFile
    socialLinks: SocialLink[]
}

export type EmployerFormProps = {
    /** Pre-fill any fields — component manages its own state from here. */
    initialData?: Partial<EmployerData>
    /** Fires on every field change with the full latest data object. */
    onChange?: (data: EmployerData) => void
    /** Controls the active tab from the parent when provided. */
    companyInfoTab?: boolean
    /** Notifies the parent whenever the user switches tabs. */
    onTabChange?: (isCompanyInfo: boolean) => void
    /** Registration keeps password required; settings makes account fields optional. */
    variant?: "register" | "settings"
}

// ─── Default state ────────────────────────────────────────────────────────────

const DEFAULT_DATA: EmployerData = {
    fullName: "",
    password: "",
    confirmPassword: "",
    currentPassword: "",
    companyName: "",
    location: "",
    phoneNumber: "",
    email: "",
    aboutCompany: "",
    organizationType: "",
    industryType: "",
    teamSize: "",
    yearOfEstablishment: "",
    companyWebsite: "",
    companyVision: "",
    logo: undefined,
    socialLinks: [],
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrganizationForm({
    initialData,
    onChange,
    companyInfoTab,
    onTabChange,
    variant = "register",
}: EmployerFormProps) {

    const [employerData, setEmployerData] = useState<EmployerData>({
        ...DEFAULT_DATA,
        ...initialData,
    })

    const [isCompanyInfo, setIsCompanyInfo] = useState(companyInfoTab ?? true)

    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
        initialData?.socialLinks ?? [{ id: "1", platform: "website", url: "" }]
    )

    const { lookupValues, loading: lookupLoading, error: lookupError } = useLookupValues()
    const organizationTypeOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.organizationType)
    const industryOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.industry)
    const teamSizeOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.teamSize)
    const locationOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.location)

    // Generic field updater — local state only; parent sync happens after render.
    const updateField = useCallback(
        <K extends keyof EmployerData>(key: K, value: EmployerData[K]) => {
            setEmployerData(prev => {
                return { ...prev, [key]: value }
            })
        },
        []
    )

    // Notify the parent only after the child state has committed.
    useEffect(() => {
        onChange?.(employerData)
    }, [employerData, onChange])

    // Keep socialLinks in sync with employerData.
    useEffect(() => {
        setEmployerData(prev => ({ ...prev, socialLinks }))
    }, [socialLinks])

    // Keep the local tab state aligned with the parent when controlled.
    useEffect(() => {
        if (typeof companyInfoTab === "boolean") {
            setIsCompanyInfo(companyInfoTab)
        }
    }, [companyInfoTab])

    const handleTabClick = (isInfoTab: boolean) => {
        setIsCompanyInfo(isInfoTab)
        onTabChange?.(isInfoTab)
    }

    const isSettings = variant === "settings"
    const logoPreviewUrl = employerData.logo?.url

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col w-full items-center">
            <div className="flex flex-col gap-3 w-full pb-2">
                {/* Tab nav - Made sticky to stay visible while scrolling */}
                <nav className="flex gap-5 w-full sticky top-0 bg-white z-10 py-1 justify-center">
                    <button
                        onClick={() => handleTabClick(true)}
                        className="flex flex-col gap-2 items-center"
                    >
                        <span className="flex gap-2 items-center text-sm font-semibold">
                            <UserRound className="text-primary" size={18} />
                            Company Info
                        </span>
                        <div className={`h-0.5 mt-1 w-full ${isCompanyInfo ? "bg-primary" : "bg-transparent"}`} />
                    </button>

                    <button
                        onClick={() => handleTabClick(false)}
                        className="flex flex-col gap-2 items-center"
                    >
                        <span className="flex gap-2 items-center text-sm font-semibold">
                            <UserRound className="text-primary" size={18} />
                            Company Detail
                        </span>
                        <div className={`h-0.5 mt-1 w-full ${!isCompanyInfo ? "bg-primary" : "bg-transparent"}`} />
                    </button>
                </nav>

                {/* ── Company Info tab ───────────────────────────────────────── */}
                {isCompanyInfo && (
                    <section className="w-full">
                        {lookupError && (
                            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {lookupError}
                            </p>
                        )}

                        {/* Logo + Social links */}
                        <div className="flex w-full gap-4">
                            <div className="shrink-0">
                                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                                    {logoPreviewUrl ? (
                                        <img
                                            src={logoPreviewUrl}
                                            alt="Company logo"
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    ) : (
                                        <UserRound size={28} className="text-gray-300" />
                                    )}
                                    <Upload
                                        kind="image"
                                        onUpload={(file) => updateField("logo", file)}
                                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    />
                                </div>
                                <span className="mt-2 flex items-center justify-center text-sm text-gray-600">
                                    {logoPreviewUrl ? "Change logo" : "Upload logo"}
                                </span>
                            </div>

                            <div className="w-full">
                                <SocialLinksSection links={socialLinks} setLinks={setSocialLinks} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 w-full mt-3">
                            <div className="flex flex-col gap-2">
                                <span>Your full name</span>
                                <input
                                    value={employerData.fullName}
                                    onChange={(e) => updateField("fullName", e.target.value)}
                                    type="text"
                                    placeholder="Full name"
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-blue-100 focus:ring-2"
                                />
                            </div>
                        </div>

                        {/* Company Name + Location + Phone Number */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-3">
                            <div className="flex flex-col gap-2">
                                <span>Company Name</span>
                                <input
                                    value={employerData.companyName}
                                    onChange={(e) => updateField("companyName", e.target.value)}
                                    type="text"
                                    placeholder="Company name"
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-blue-100 focus:ring-2"
                                />
                            </div>
                            <LookupSelect
                                label="Location"
                                value={employerData.location}
                                options={locationOptions}
                                placeholder="Select location"
                                disabled={lookupLoading}
                                onChange={(value) => updateField("location", value)}
                            />
                            <div className="flex flex-col gap-2">
                                <span>Phone Number</span>
                                <input
                                    value={employerData.phoneNumber}
                                    onChange={(e) => updateField("phoneNumber", e.target.value)}
                                    type="text"
                                    placeholder="Phone number"
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-blue-100 focus:ring-2"
                                />
                            </div>
                        </div>

                        {/* Email + Password + Confirm Password */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-3">
                            <div className="flex flex-col gap-2">
                                <span>Email</span>
                                <input
                                    value={employerData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    type="email"
                                    placeholder="your@company.com"
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-blue-100 focus:ring-2"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span>Password</span>
                                <input
                                    type="password"
                                    value={employerData.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                    placeholder={isSettings ? "Leave blank to keep" : "Password"}
                                    autoComplete="new-password"
                                    required={!isSettings}
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-blue-100 focus:ring-2"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span>Confirm password</span>
                                <input
                                    type="password"
                                    value={employerData.confirmPassword}
                                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                                    placeholder={isSettings ? "Confirm new" : "Confirm password"}
                                    autoComplete="new-password"
                                    required={!isSettings}
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-blue-100 focus:ring-2"
                                />
                            </div>
                            {isSettings && (
                                <div className="flex flex-col gap-2 md:col-span-3">
                                    <span>Current password</span>
                                    <input
                                        type="password"
                                        value={employerData.currentPassword}
                                        onChange={(e) => updateField("currentPassword", e.target.value)}
                                        placeholder="Required only when changing password"
                                        autoComplete="current-password"
                                        className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-blue-100 focus:ring-2"
                                    />
                                </div>
                            )}
                        </div>

                        {/* About Company */}
                        <div className="mt-3 w-full">
                            <span>About Company</span>
                            <div className="mt-1">
                                <TextAreaBox
                                    value={employerData.aboutCompany}
                                    onChange={(v: any) =>
                                        updateField("aboutCompany", typeof v === "string" ? v : (v.target?.value ?? ""))
                                    }
                                />
                            </div>
                        </div>


                    </section>
                )}

                {/* ── Company Detail tab ────────────────────────────────────── */}
                {!isCompanyInfo && (
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                        {lookupError && (
                            <p className="md:col-span-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {lookupError}
                            </p>
                        )}

                        <LookupSelect
                            label="Organization Type"
                            value={employerData.organizationType}
                            options={organizationTypeOptions}
                            placeholder="Select organization type"
                            disabled={lookupLoading}
                            onChange={(value) => updateField("organizationType", value)}
                        />

                        <LookupSelect
                            label="Industry Type"
                            value={employerData.industryType}
                            options={industryOptions}
                            placeholder="Select industry"
                            disabled={lookupLoading}
                            onChange={(value) => updateField("industryType", value)}
                        />

                        <LookupSelect
                            label="Team Size"
                            value={employerData.teamSize}
                            options={teamSizeOptions}
                            placeholder="Select team size"
                            disabled={lookupLoading}
                            onChange={(value) => updateField("teamSize", value)}
                        />

                        <div className="flex flex-col gap-2">
                            <span className="text-sm">Year of Establishment</span>
                            <input
                                type="date"
                                value={employerData.yearOfEstablishment}
                                onChange={(e) => updateField("yearOfEstablishment", e.target.value)}
                                max={new Date().toISOString().split("T")[0]}
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-blue-100 focus:ring-2"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-sm">Company Website</span>
                            <input
                                value={employerData.companyWebsite}
                                onChange={(e) => updateField("companyWebsite", e.target.value)}
                                type="url"
                                placeholder="https://example.com"
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-blue-100 focus:ring-2"
                            />
                        </div>

                        {/* Company Vision */}
                        <div className="md:col-span-3 flex flex-col gap-2">
                            <span className="text-sm">Company Vision</span>
                            <TextAreaBox
                                value={employerData.companyVision}
                                onChange={(v: any) =>
                                    updateField("companyVision", typeof v === "string" ? v : (v.target?.value ?? ""))
                                }
                            />
                        </div>

                    </section>
                )}

            </div>
        </div>
    )
}