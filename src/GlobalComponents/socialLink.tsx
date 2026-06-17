import React from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';

interface SocialLink {
    id: string;
    platform: string;
    url: string;
}

const SOCIAL_PLATFORMS = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'website', label: 'Website' },
];

const SocialLinksSection: React.FC<{
    links: SocialLink[];
    setLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
    readOnly?: boolean;
}> = ({ links, setLinks, readOnly = false }) => {
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
                {!readOnly && (
                    <button
                        type="button"
                        onClick={addLink}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <Plus size={13} /> Add link
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-2">
                {links.map((link) => {
                    const Icon = ChevronDown;
                    return (
                        <div key={link.id} className="flex items-center gap-2">
                            <div className="relative shrink-0">
                                <select
                                    value={link.platform}
                                    onChange={(e) => updateLink(link.id, 'platform', e.target.value)}
                                    disabled={readOnly}
                                    className={`appearance-none border border-gray-200 rounded-lg pl-8 pr-7 py-2 text-sm bg-white outline-none text-gray-700 ${readOnly ? "cursor-not-allowed bg-gray-50" : "focus:ring-2 focus:ring-blue-100 cursor-pointer"}`}
                                >
                                    {SOCIAL_PLATFORMS.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                                <Icon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                            </div>

                            <input
                                type="text"
                                value={link.url}
                                onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                disabled={readOnly}
                                placeholder="Profile link/url..."
                                className={`flex-1 border border-gray-200 rounded-lg p-2 text-sm outline-none ${readOnly ? "bg-gray-50 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-100"}`}
                            />

                            {!readOnly && (
                                <button
                                    type="button"
                                    onClick={() => removeLink(link.id)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                                    aria-label="Remove link"
                                >
                                    <X size={18} className="border border-gray-300 rounded-full p-0.5" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SocialLinksSection;
