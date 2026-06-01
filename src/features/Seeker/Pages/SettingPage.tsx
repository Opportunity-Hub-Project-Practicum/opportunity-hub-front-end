import { useState } from "react";
import {
    CircleUserRound, Settings,
    Briefcase, MapPin, XCircle,
} from "lucide-react";
import SeekerProfileSection, { type SeekerFormData } from "../../../GlobalComponents/SeekerProfileSection";

import Password from "../../../GlobalComponents/Password";

// ── Types ────────────────────────────────────────────────────────

interface SeekerNotifySetting {
    notifications: {
        employerShortlistedMe: boolean;
        newOpportunity: boolean;
        appliedJobsExpire: boolean;
        employerRejectedMe: boolean;
    };
    jobAlerts: { role: string; location: string };
    volunteerAlerts: { role: string; location: string };
    profilePrivacy: boolean;
}

// ── Main Page ────────────────────────────────────────────────────

export default function Setting() {
    const [seekerData, setSeekerData] = useState<SeekerFormData>({
        firstName: 'mokot',
        lastName: '',
        email: '',
        dob: '',
        website: '',
        gender: '',
        martialStatus: '',
        Phone: '',
        bio: '',
        profileImage: null,
        socialLinks: [{ id: '2', platform: 'facebook', url: '' }],
        resume: [],
        education: [],
        experience: [],
    });

    const [isProfile, setIsProfile] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [seekerNotifySetting, setSeekerNotifySetting] = useState<SeekerNotifySetting>({
        notifications: {
            employerShortlistedMe: false,
            newOpportunity: false,
            appliedJobsExpire: false,
            employerRejectedMe: false,
        },
        jobAlerts: { role: "", location: "" },
        volunteerAlerts: { role: "", location: "" },
        profilePrivacy: true,
    });

    const handleFieldChange = <K extends keyof SeekerFormData>(field: K, value: SeekerFormData[K]) => {
        setSeekerData(prev => ({ ...prev, [field]: value }));
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

            {/* ── Profile Tab ── */}
            {isProfile && (
                <SeekerProfileSection
                    seekerData={seekerData}
                    isEditing={isEditing}
                    onFieldChange={handleFieldChange}
                    onToggleEdit={() => setIsEditing(prev => !prev)}
                />
            )}

            {/* ── Account Tab ── */}
            {!isProfile && (
                <div className="w-full min-h-screen bg-white p-8 text-slate-700">
                    {/* Notification Section */}
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Notification</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { key: 'employerShortlistedMe', label: 'Notify me when employers shortlisted me' },
                                { key: 'newOpportunity', label: 'Notify me when there is new opportunity' },
                                { key: 'appliedJobsExpire', label: 'Notify me when my applied jobs are expire' },
                                { key: 'employerRejectedMe', label: 'Notify me when employers rejected me' },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={seekerNotifySetting.notifications[key as keyof typeof seekerNotifySetting.notifications]}
                                        onChange={(e) => setSeekerNotifySetting(prev => ({
                                            ...prev,
                                            notifications: { ...prev.notifications, [key]: e.target.checked },
                                        }))}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className={`text-sm ${seekerNotifySetting.notifications[key as keyof typeof seekerNotifySetting.notifications] ? "text-black" : "text-gray-400"}`}>
                                        {label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Job Alerts */}
                    <section className="mb-5">
                        <h2 className="text-lg font-semibold mb-2">Job Alerts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Role</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={seekerNotifySetting.jobAlerts.role}
                                        onChange={(e) => setSeekerNotifySetting(prev => ({ ...prev, jobAlerts: { ...prev.jobAlerts, role: e.target.value } }))}
                                        placeholder="Your job roles"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={seekerNotifySetting.jobAlerts.location}
                                        onChange={(e) => setSeekerNotifySetting(prev => ({ ...prev, jobAlerts: { ...prev.jobAlerts, location: e.target.value } }))}
                                        placeholder="City, state, country name"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Volunteer Alerts */}
                    <section className="mb-5">
                        <h2 className="text-lg font-semibold mb-2">Volunteer Alerts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Role</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={seekerNotifySetting.volunteerAlerts.role}
                                        onChange={(e) => setSeekerNotifySetting(prev => ({ ...prev, volunteerAlerts: { ...prev.volunteerAlerts, role: e.target.value } }))}
                                        placeholder="Your job roles"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={seekerNotifySetting.volunteerAlerts.location}
                                        onChange={(e) => setSeekerNotifySetting(prev => ({ ...prev, volunteerAlerts: { ...prev.volunteerAlerts, location: e.target.value } }))}
                                        placeholder="City, state, country name"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Profile Privacy */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-5">
                        <section>
                            <h2 className="text-lg font-semibold mb-2">Profile Privacy</h2>
                            <div className="flex items-center border border-gray-200 rounded-md p-3">
                                <button
                                    type="button"
                                    onClick={() => setSeekerNotifySetting(prev => ({ ...prev, profilePrivacy: !prev.profilePrivacy }))}
                                    className={`flex items-center rounded-full px-2 py-1 mr-3 ${seekerNotifySetting.profilePrivacy ? "bg-blue-600" : "bg-gray-200"}`}
                                >
                                    <div className="w-3 h-3 bg-white rounded-full mr-2" />
                                    <span className={`text-[10px] font-bold ${seekerNotifySetting.profilePrivacy ? "text-white" : "text-gray-500"}`}>
                                        {seekerNotifySetting.profilePrivacy ? "YES" : "NO"}
                                    </span>
                                </button>
                                <span className="text-sm text-gray-400">Your profile is public now</span>
                            </div>
                        </section>
                    </div>

                    <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors mb-12">
                        Save Changes
                    </button>
                    <hr className="mb-5 border-gray-100" />

                    <Password />

                    <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors mb-5">
                        Save Changes
                    </button>
                    <hr className="mb-5 border-gray-100" />

                    {/* Delete Account */}
                    <section className="max-w-3xl rounded-3xl border border-rose-100 bg-white p-5 shadow-sm md:p-6">
                        <h2 className="text-lg font-semibold mb-2">Delete Your Account</h2>
                        <p className="text-xs text-gray-400 max-w-2xl leading-relaxed mb-4">
                            If you delete your Jobpilot account, you will no longer be able to get information about the matched jobs,
                            following employers, and job alert, shortlisted jobs and more. You will be abandoned from all the services of Jobpilot.com.
                        </p>
                        <button className="flex items-center text-red-500 text-sm font-semibold hover:text-red-600 transition-colors">
                            <XCircle className="w-4 h-4 mr-2" />
                            Close Account
                        </button>
                    </section>
                </div>
            )}
        </div>
    );
}