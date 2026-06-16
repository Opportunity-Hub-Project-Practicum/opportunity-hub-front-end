import { useRef, useState } from "react";
import {
    Upload as UploadIcon,
    Link as LinkIcon,
    Plus,
    Calendar,
    FileText,
    MoreHorizontal,
    Trash2,
    Briefcase,
    GraduationCap,
    CircleUserRound,
} from "lucide-react";

import WorkExperienceForm from "../features/Seeker/Components/modal/WorkExperienceForm";
import EducationModal from "../features/Seeker/Components/modal/Education";
import Upload from "../features/Seeker/libs/uploadFile";
import TextAreaBox from "./textAreaBox";
import SocialLinksSection from "./socialLink";

// ── Types ────────────────────────────────────────────────────────

export interface ResumeFile {
    id: string;
    name: string;
    size: string;
    raw?: globalThis.File;
    url?: string;
}

export interface SocialLink {
    id: string;
    platform: string;
    url: string;
    contactId?: number;
}

export interface ExperienceEntry {
    experienceId?: number;
    jobTitle?: string;
    company?: string;
    jobRole?: string;
    yearsOfExperience?: string;
    industry?: string;
    from?: string;
    to?: string;
    jobDescription?: string;
}

export interface EducationEntry {
    educationId?: number;
    school?: string;
    degree?: string;
    areaOfStudy?: string;
    location?: string;
    country?: string;
    from?: string;
    to?: string;
}

export interface SeekerFormData {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    website: string;
    gender: string;
    martialStatus: string;
    Phone: string;
    bio: string;
    profileImage: string | null;
    profileImageFile?: globalThis.File;
    socialLinks: SocialLink[];
    resume: ResumeFile[];
    education: EducationEntry[];
    experience: ExperienceEntry[];
}

// ── CV / Resume Section ──────────────────────────────────────────

const CvResumeSection: React.FC<{
    resumes: ResumeFile[];
    setResumes: React.Dispatch<React.SetStateAction<ResumeFile[]>>;
    readOnly: boolean;
}> = ({ resumes, setResumes, readOnly }) => {
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDelete = (id: string) => {
        setResumes(prev => prev.filter(r => r.id !== id));
        setMenuOpen(null);
    };

    return (
        <div className="flex flex-col gap-2 md:col-span-2 mt-1">
            <label className="text-xs font-medium text-gray-700">Your Cv/Resume</label>
            {resumes.length === 0 && readOnly ? (
                <p className="text-sm text-gray-400">No resume uploaded.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {resumes.map((resume) => (
                        <div
                            key={resume.id}
                            className="relative border border-gray-200 rounded-lg p-3 flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <FileText size={20} className="text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-800 truncate">{resume.name}</p>
                                <p className="text-xs text-gray-400">{resume.size}</p>
                            </div>
                            {!readOnly && (
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(menuOpen === resume.id ? null : resume.id)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                            )}

                            {!readOnly && menuOpen === resume.id && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                                    <div className="absolute right-2 top-10 z-20 bg-white border border-gray-100 rounded-lg shadow-lg py-1 min-w-32.5">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(resume.id)}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-500 hover:bg-gray-50 transition-colors"
                                        >
                                            <Trash2 size={13} /> Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {!readOnly && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center gap-1 text-center min-h-17 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-1.5 text-primary">
                                <Plus size={16} />
                                <span className="text-xs font-medium text-gray-700">Add Cv/Resume</span>
                            </div>
                            <p className="text-xs text-gray-400">Browse file or drop here. only pdf</p>
                            <Upload onUpload={(resume) => setResumes([resume])} inputRef={fileInputRef} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

// ── Field display helper (view-only) ─────────────────────────────

const Field: React.FC<{ label: string; value?: string; placeholder?: string }> = ({ label, value, placeholder = '—' }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-sm text-gray-800">{value || placeholder}</span>
    </div>
);

// ── Props ────────────────────────────────────────────────────────

export interface ProfileSectionProps {
    /** Current form data */
    seekerData: SeekerFormData;
    /**
     * When true: renders everything as plain read-only text, hides the
     * Edit button, and removes all add/delete controls.
     * Defaults to false (editable mode with Edit/Done toggle).
     */
    viewOnly?: boolean;
    /** Whether fields are currently being edited (ignored when viewOnly=true) */
    isEditing?: boolean;
    /** Called whenever a top-level field changes (ignored when viewOnly=true) */
    onFieldChange?: <K extends keyof SeekerFormData>(field: K, value: SeekerFormData[K]) => void;
    /** Called when the Edit / Done button is clicked (ignored when viewOnly=true) */
    onToggleEdit?: () => void;
}

// ── ProfileSection ───────────────────────────────────────────────

export default function SeekerProfileSection({
    seekerData,
    viewOnly = false,
    isEditing = false,
    onFieldChange,
    onToggleEdit,
}: ProfileSectionProps) {
    const [modal, setModal] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // In viewOnly mode nothing is ever editable
    const editing = viewOnly ? false : isEditing;
    const readOnly = !editing;

    const handleFieldChange = <K extends keyof SeekerFormData>(field: K, value: SeekerFormData[K]) => {
        onFieldChange?.(field, value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            handleFieldChange("profileImage", URL.createObjectURL(file));
            handleFieldChange("profileImageFile", file);
        } else if (file) {
            alert("File size exceeds 5 MB limit");
        }
    };

    return (
        <div className="max-w-5xl">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
                {!viewOnly && (
                    <button
                        type="button"
                        onClick={onToggleEdit}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${editing ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                        {editing ? "Done" : "Edit Profile"}
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-6">
                {/* Profile Picture + Name/Email/DOB */}
                <div className="flex gap-5">
                    {/* Avatar */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-gray-700">Profile Picture</label>
                        {viewOnly ? (
                            <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                {seekerData.profileImage
                                    ? <img src={seekerData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    : <CircleUserRound size={64} className="text-gray-300" />
                                }
                            </div>
                        ) : (
                            <>
                                <div
                                    onClick={() => editing && fileInputRef.current?.click()}
                                    className={`w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-3 text-center overflow-hidden ${editing ? "bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" : "bg-gray-100 cursor-not-allowed"}`}
                                >
                                    {seekerData.profileImage ? (
                                        <img src={seekerData.profileImage} alt="Uploaded" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                                                <UploadIcon className="text-gray-400" size={24} />
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                <span className="font-semibold text-gray-800">Browse photo</span> or drop here
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Max 5 MB.</p>
                                        </>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={!editing} />
                            </>
                        )}
                    </div>

                    {/* Name / Email / DOB */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 py-10">
                        {viewOnly ? (
                            <>
                                <Field label="First Name" value={seekerData.firstName} />
                                <Field label="Last Name" value={seekerData.lastName} />
                                <Field label="Email" value={seekerData.email} />
                                <Field label="Date of Birth" value={seekerData.dob} />
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        value={seekerData.firstName}
                                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                                        disabled={readOnly}
                                        className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        value={seekerData.lastName}
                                        onChange={(e) => handleFieldChange('lastName', e.target.value)}
                                        disabled={readOnly}
                                        className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">EMAIL</label>
                                    <input
                                        type="text"
                                        value={seekerData.email}
                                        disabled
                                        placeholder="CAN NOT CHANGE"
                                        className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">Date of Birth</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={seekerData.dob}
                                            onChange={(e) => handleFieldChange('dob', e.target.value)}
                                            disabled={readOnly}
                                            placeholder="dd/mm/yyyy"
                                            className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                                        />
                                        <Calendar className="absolute right-2 top-2 text-gray-400" size={16} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Website */}
                {viewOnly ? (
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-500">Personal Website</span>
                        {seekerData.website
                            ? <a href={seekerData.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">{seekerData.website}</a>
                            : <span className="text-sm text-gray-400">—</span>
                        }
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-xs font-medium text-gray-700">Personal Website</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={seekerData.website}
                                onChange={(e) => handleFieldChange('website', e.target.value)}
                                disabled={readOnly}
                                placeholder="Website url..."
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm pl-8 outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                            />
                            <LinkIcon className="absolute left-2 top-2 text-primary" size={16} />
                        </div>
                    </div>
                )}

                {/* Gender */}
                {viewOnly ? (
                    <Field label="Gender" value={seekerData.gender} />
                ) : (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-700">Gender</label>
                        <select
                            value={seekerData.gender}
                            onChange={(e) => handleFieldChange('gender', e.target.value)}
                            disabled={readOnly}
                            className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white outline-none appearance-none disabled:bg-gray-50"
                        >
                            <option>Select...</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                )}

                {/* Marital Status */}
                {viewOnly ? (
                    <Field label="Marital Status" value={seekerData.martialStatus} />
                ) : (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-700">Marital Status</label>
                        <select
                            value={seekerData.martialStatus}
                            onChange={(e) => handleFieldChange('martialStatus', e.target.value)}
                            disabled={readOnly}
                            className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white outline-none appearance-none disabled:bg-gray-50"
                        >
                            <option>Select...</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                        </select>
                    </div>
                )}

                {/* Phone */}
                {viewOnly ? (
                    <Field label="Phone Number" value={seekerData.Phone} />
                ) : (
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-xs font-medium text-gray-700">Phone Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={seekerData.Phone}
                                onChange={(e) => handleFieldChange('Phone', e.target.value)}
                                disabled={readOnly}
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none disabled:bg-gray-50"
                            />
                            <button
                                disabled={readOnly}
                                className={`absolute right-2 top-2 border rounded-full p-0.5 ${editing ? "text-blue-600 border-blue-600" : "text-gray-300 border-gray-300 cursor-not-allowed"}`}
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Experience */}
                <div className="flex flex-col gap-4 md:col-span-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">Experience</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                            {seekerData.experience.length}
                        </span>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                        {seekerData.experience.length > 0 ? (
                            <div className="space-y-3 mb-4">
                                {seekerData.experience.map((exp, index) => (
                                    <div key={`${exp.jobTitle || 'experience'}-${index}`} className="rounded-lg border border-gray-100 p-3 bg-gray-50">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex gap-3">
                                                <Briefcase size={40} className="text-primary shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{exp.jobTitle || `Experience ${index + 1}`}</p>
                                                    <p className="text-xs text-gray-600 mt-0.5">
                                                        {[exp.company, exp.jobRole].filter(Boolean).join(' • ') || 'No company/role provided'}
                                                    </p>
                                                    {exp.jobDescription && viewOnly && (
                                                        <p className="text-xs text-gray-500 mt-1">{exp.jobDescription}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {(exp.from || exp.to) && (
                                                <span className="text-xs text-gray-500 whitespace-nowrap">{[exp.from, exp.to].filter(Boolean).join(' - ')}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 mb-4">No experience added yet.</p>
                        )}
                        {editing && (
                            <button className="btn-primary-blue inline-flex items-center gap-2" onClick={() => setModal('experience')}>
                                <Plus size={14} /> Add Experience
                            </button>
                        )}
                    </div>

                    {/* Education */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">Education</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                            {seekerData.education.length}
                        </span>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                        {seekerData.education.length > 0 ? (
                            <div className="space-y-3 mb-4">
                                {seekerData.education.map((edu, index) => (
                                    <div key={`${edu.school || 'education'}-${index}`} className="rounded-lg border border-gray-100 p-1.5 bg-gray-50">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex gap-3">
                                                <GraduationCap size={40} className="text-primary shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{edu.school || `Education ${index + 1}`}</p>
                                                    <p className="text-xs text-gray-600 mt-0.5">
                                                        {[edu.degree, edu.areaOfStudy].filter(Boolean).join(' • ') || 'No degree/field provided'}
                                                    </p>
                                                    {edu.country && viewOnly && (
                                                        <p className="text-xs text-gray-500 mt-0.5">{edu.country}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {(edu.from || edu.to) && (
                                                <span className="text-xs text-gray-500 whitespace-nowrap">{[edu.from, edu.to].filter(Boolean).join(' - ')}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 mb-4">No education added yet.</p>
                        )}
                        {editing && (
                            <button className="btn-primary-blue inline-flex items-center gap-2" onClick={() => setModal('education')}>
                                <Plus size={14} /> Add Education
                            </button>
                        )}
                    </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-700">Biography</span>
                    {viewOnly ? (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{seekerData.bio || '—'}</p>
                    ) : (
                        <TextAreaBox
                            value={seekerData.bio}
                            onChange={(value) => handleFieldChange('bio', value)}
                            readOnly={readOnly}
                        />
                    )}
                </div>

                {/* CV/Resume */}
                <CvResumeSection
                    resumes={seekerData.resume}
                    readOnly={readOnly}
                    setResumes={(updater) =>
                        handleFieldChange('resume', typeof updater === 'function' ? updater(seekerData.resume) : updater)
                    }
                />

                {/* Social Links */}
                <SocialLinksSection
                    links={seekerData.socialLinks}
                    readOnly={readOnly}
                    setLinks={(updater) =>
                        handleFieldChange('socialLinks', typeof updater === 'function' ? updater(seekerData.socialLinks) : updater)
                    }
                />
            </div>

            {/* Modals */}
            {modal === 'experience' && (
                <>
                    <div className="fixed inset-0 z-40 w-screen h-screen backdrop-blur-sm" />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div className="h-5/6 p-4 border border-gray-100 rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto bg-white">
                            <WorkExperienceForm
                                onClose={() => setModal('')}
                                onSave={(data) => {
                                    handleFieldChange('experience', [...seekerData.experience, data]);
                                    setModal('');
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
            {modal === 'education' && (
                <EducationModal
                    onClose={() => setModal('')}
                    onSave={(data) => {
                        handleFieldChange('education', [...seekerData.education, data]);
                        setModal('');
                    }}
                />
            )}
        </div>
    );
}