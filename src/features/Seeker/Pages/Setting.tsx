import { useState, useRef } from "react";
import {
    CircleUserRound, Settings, Upload, Link as LinkIcon,
    Plus, Calendar, Bold, Italic, Underline, Strikethrough,
    Link2, List, ListOrdered, FileText, MoreHorizontal,
    Pencil, Trash2, X, Star, Globe, ChevronDown
} from "lucide-react";
import WorkExperienceForm from "../Components/modal/WorkExperienceForm";
import EducationModal from "../Components/modal/Education";

// ── Types ────────────────────────────────────────────────────────

interface ResumeFile {
    id: string;
    name: string;
    size: string;
}

interface SocialLink {
    id: string;
    platform: string;
    url: string;
}

const SOCIAL_PLATFORMS = [
    { value: 'instagram', label: 'Instagram', Icon: Star },
    { value: 'facebook', label: 'Star', Icon: Star },
    { value: 'twitter', label: 'Twitter', Icon: Star },
    { value: 'linkedin', label: 'LinkedIn', Icon: Star },
    { value: 'website', label: 'Website', Icon: Globe },
];

function getPlatformIcon(value: string) {
    return SOCIAL_PLATFORMS.find(p => p.value === value)?.Icon ?? Globe;
}

// ── Biography Editor ─────────────────────────────────────────────

const BiographyEditor: React.FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);

    const exec = (cmd: string, value?: string) => {
        document.execCommand(cmd, false, value);
        editorRef.current?.focus();
    };

    return (
        <div className="flex flex-col gap-1 md:col-span-2 mt-1">
            <label className="text-xs font-medium text-gray-700">Biography</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Write down your biography here. Let the employers know who you are..."
                    className="min-h-35 p-3 text-sm text-gray-700 outline-none biography-editor"
                />
                {/* Toolbar */}
                <div className="flex items-center gap-1 px-3 py-2 border-t border-gray-100 bg-gray-50">
                    {[
                        { icon: <Bold size={14} />, cmd: 'bold' },
                        { icon: <Italic size={14} />, cmd: 'italic' },
                        { icon: <Underline size={14} />, cmd: 'underline' },
                        { icon: <Strikethrough size={14} />, cmd: 'strikeThrough' },
                    ].map(({ icon, cmd }) => (
                        <button
                            key={cmd}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
                            className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors"
                        >
                            {icon}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            const url = prompt('Enter URL');
                            if (url) exec('createLink', url);
                        }}
                        className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                        <Link2 size={14} />
                    </button>


                </div>
            </div>
        </div>
    );
};

// ── CV / Resume Section ──────────────────────────────────────────

const CvResumeSection: React.FC = () => {
    const [resumes, setResumes] = useState<ResumeFile[]>([

    ]);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') { alert('Only PDF files are allowed'); return; }
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setResumes(prev => [...prev, {
            id: Date.now().toString(),
            name: file.name.replace('.pdf', ''),
            size: `${sizeMB} MB`,
        }]);
        e.target.value = '';
    };

    const handleDelete = (id: string) => {
        setResumes(prev => prev.filter(r => r.id !== id));
        setMenuOpen(null);
    };

    return (
        <div className="flex flex-col gap-2 md:col-span-2 mt-1">
            <label className="text-xs font-medium text-gray-700">Your Cv/Resume</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {resumes.map((resume) => (
                    <div
                        key={resume.id}
                        className="relative border border-gray-200 rounded-lg p-3 flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <FileText size={20} className="text-blue-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">{resume.name}</p>
                            <p className="text-xs text-gray-400">{resume.size}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMenuOpen(menuOpen === resume.id ? null : resume.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                        >
                            <MoreHorizontal size={16} />
                        </button>

                        {/* Dropdown menu */}
                        {menuOpen === resume.id && (
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

                {/* Add CV card */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors text-center min-h-17"
                >
                    <div className="flex items-center gap-1.5 text-blue-500">
                        <Plus size={16} />
                        <span className="text-xs font-medium text-gray-700">Add Cv/Resume</span>
                    </div>
                    <p className="text-xs text-gray-400">Browse file or drop here. only pdf</p>
                </button>
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
            </div>
        </div>
    );
};

// ── Social Links Section ─────────────────────────────────────────

const SocialLinksSection: React.FC = () => {
    const [links, setLinks] = useState<SocialLink[]>([

        { id: '2', platform: 'facebook', url: '' },
    ]);

    const addLink = () => {
        setLinks(prev => [...prev, { id: Date.now().toString(), platform: 'website', url: '' }]);
    };

    const removeLink = (id: string) => {
        setLinks(prev => prev.filter(l => l.id !== id));
    };

    const updateLink = (id: string, field: 'platform' | 'url', value: string) => {
        setLinks(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    return (
        <div className="flex flex-col gap-2 md:col-span-2 mt-1">
            <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">Social Links</label>
                <button
                    type="button"
                    onClick={addLink}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <Plus size={13} /> Add link
                </button>
            </div>
            <div className="flex flex-col gap-2">
                {links.map((link) => {
                    const Icon = getPlatformIcon(link.platform);
                    return (
                        <div key={link.id} className="flex items-center gap-2">
                            {/* Platform selector */}
                            <div className="relative shrink-0">
                                <select
                                    value={link.platform}
                                    onChange={(e) => updateLink(link.id, 'platform', e.target.value)}
                                    className="appearance-none border border-gray-200 rounded-lg pl-8 pr-7 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 cursor-pointer"
                                >
                                    {SOCIAL_PLATFORMS.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                                <Icon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* URL input */}
                            <input
                                type="text"
                                value={link.url}
                                onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                placeholder="Profile link/url..."
                                className="flex-1 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            />

                            {/* Remove */}
                            <button
                                type="button"
                                onClick={() => removeLink(link.id)}
                                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                                aria-label="Remove link"
                            >
                                <X size={18} className="border border-gray-300 rounded-full p-0.5" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ── Main Page ────────────────────────────────────────────────────

export default function Setting() {
    const [isProfile, setIsProfile] = useState(true);
    const [modal, setModal] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = (event) => setUploadedImage(event.target?.result as string);
            reader.readAsDataURL(file);
        } else if (file) {
            alert("File size exceeds 5 MB limit");
        }
    };

    return (
        <div className="w-full p-3 bg-white min-h-screen">
            {/* Navigation Tabs */}
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

            {isProfile && (
                <div className="max-w-5xl">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">Basic Information</h2>

                    <div className="flex flex-col  gap-6">


                        {/* Form Fields */}
                        <div className="flex gap-5">
                            {/* Profile Picture Upload */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-gray-700">Profile Picture</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-3 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden"
                                >
                                    {uploadedImage ? (
                                        <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                                                <Upload className="text-gray-400" size={24} />
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                <span className="font-semibold text-gray-800">Browse photo</span> or drop here
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Max 5 MB.</p>
                                        </>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 py-10">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">First Name</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">Last Name</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">EMAIL</label>
                                    <input type="text" disabled placeholder="CAN NOT CHANGE" className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">Date of Birth</label>
                                    <div className="relative">
                                        <input type="text" placeholder="dd/mm/yyyy" className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                                        <Calendar className="absolute right-2 top-2 text-gray-400" size={16} />
                                    </div>
                                </div>




                            </div>
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-medium text-gray-700">Personal Website</label>
                            <div className="relative">
                                <input type="text" placeholder="Website url..." className="w-full border border-gray-200 rounded-lg p-2 text-sm pl-8 outline-none focus:ring-2 focus:ring-blue-100" />
                                <LinkIcon className="absolute left-2 top-2 text-blue-500" size={16} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-700">Gender</label>
                            <select className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white outline-none appearance-none">
                                <option>Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-700">Marital Status</label>
                            <select className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white outline-none appearance-none">
                                <option>Select...</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-medium text-gray-700">Phone Number</label>
                            <div className="relative">
                                <input type="text" className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none" />
                                <button className="absolute right-2 top-2 text-blue-600 border border-blue-600 rounded-full p-0.5">
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Experience & Education buttons */}
                        <div className="flex flex-col gap-3 md:col-span-2">
                            <span className="text-sm font-medium text-gray-700">Experience</span>
                            <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                                <button className="btn-primary-blue" onClick={() => setModal('experience')}>
                                    Add experience
                                </button>
                            </div>

                            <span className="text-sm font-medium text-gray-700">Education</span>
                            <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                                <button className="btn-primary-blue" onClick={() => setModal('education')}>
                                    Add Education
                                </button>
                            </div>
                        </div>
                        {/* ── NEW SECTIONS ── */}
                        <BiographyEditor />
                        <CvResumeSection />
                        <SocialLinksSection />
                    </div>
                </div>

            )}

            {/* Modals */}
            {modal === 'experience' && (
                <>
                    <div className="fixed inset-0 z-40 w-screen h-screen backdrop-blur-sm" />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div className="h-5/6 p-4 border border-gray-100 rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto bg-white">
                            <WorkExperienceForm onClose={() => setModal('')} />
                        </div>
                    </div>
                </>
            )}
            {modal === 'education' && (
                <EducationModal onClose={() => setModal('')} />
            )}

            <style>{`
                .biography-editor:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}