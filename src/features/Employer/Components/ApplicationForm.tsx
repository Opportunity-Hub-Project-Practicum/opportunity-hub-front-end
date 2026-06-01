import {
    Star, UserPlus, Cake, MapPin,
    Briefcase, GraduationCap, Download, Globe, Phone, Mail, FileText,
    ArrowLeft,
} from 'lucide-react';


interface ApplicationFormProp {
    isOpen: boolean,
    applicationId?: string | null,
    onClose: () => void
}


export default function ApplicationForm(
    { isOpen, applicationId, onClose }: ApplicationFormProp
) {
    if (!isOpen) {
        return null
    }
    return (
        <div className="w-full bg-slate-200 p-8 rounded-lg border border-slate-200  overflow-y-auto">
            <button className='mb-5'
                onClick={onClose}
            ><ArrowLeft /></button>
            {applicationId && (
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Application ID: {applicationId}
                </p>
            )}
            {/* Profile Header Block */}
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#E4E5E8] mb-8">
                <div className="flex items-center space-x-4">
                    {/* Avatar Placeholder */}
                    <div className="w-16 h-16 bg-[#767F8C] rounded-full shrink-0" />
                    <div>
                        <h1 className="text-xl font-semibold ">Esther Howard</h1>
                        <p className="text-sm text-[#5E6670]">Website Designer (UI/UX)</p>
                    </div>
                </div>

                {/* Header CTA Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <button type="button" className="p-3 bg-[#E8F1FC] text-primary rounded-md hover:bg-[#D4E6FC] transition-colors" title="Bookmark candidate">
                        <Star className="h-5 w-5 fill-none stroke-2" />
                    </button>

                    <button type="button" className="flex-1 md:flex-none inline-flex items-center justify-center px-5 py-3 border border-primary  text-primary  rounded-md text-sm font-semibold hover:bg-blue-50 transition-colors">
                        Add To Waiting
                    </button>

                    <button type="button" className="flex-1 md:flex-none inline-flex items-center justify-center px-5 py-3 bg-[#E02424] text-white rounded-md text-sm font-semibold hover:bg-red-700 transition-colors">
                        Reject
                    </button>

                    <button type="button" className="flex-1 md:flex-none inline-flex items-center justify-center space-x-2 px-5 py-3 bg-primary  text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors">
                        <UserPlus className="h-4 w-4" />
                        <span>Hire Candidates</span>
                    </button>
                </div>
            </div>

            {/* Main Two-Column Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">

                {/* Left Column: Biography & Cover Letter (Spans 2 columns) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Biography Block */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider ">Biography</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            I've been passionate about graphic design and digital art from an early age with a keen interest in Website and Mobile Application User Interfaces. I can create high-quality and aesthetically pleasing designs in a quick turnaround time. Check out the portfolio section of my profile to see samples of my work and feel free to discuss your designing needs. I mostly use Adobe Photoshop, Illustrator, XD and Figma. *Website User Experience and Interface (UI/UX) Design - for all kinds of Professional and Personal websites. *Mobile Application User Experience and Interface Design - for all kinds of iOS/Android and Hybrid Mobile Applications. *Wireframe Designs.
                        </p>
                    </div>

                    <hr className="border-[#E4E5E8]" />

                    {/* Cover Letter Block */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider">Cover Letter</h3>
                        <div className="text-sm text-gray-600 space-y-4 leading-relaxed">
                            <p>Dear Sir,</p>
                            <p>
                                I am writing to express my interest in the fourth grade instructional position that is currently available in the Fort Wayne Community School System. I learned of the opening through a notice posted on JobZone, IPFW's job database. I am confident that my academic background and curriculum development skills would be successfully utilized in this teaching position.
                            </p>
                            <p>
                                I have just completed my Bachelor of Science degree in Elementary Education and have successfully completed Praxis I and Praxis II. During my student teaching experience, I developed and initiated a three-week curriculum sequence on animal species and earth resources. This collaborative unit involved working with three other third grade teachers within my team, and culminated in a field trip to the Indianapolis Zoo Animal Research Unit.
                            </p>
                            <div className="pt-2 space-y-1">
                                <p>Sincerely,</p>
                                <p className="font-medium ">Esther Howard</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-200" />

                    {/* Social Links Sub-Section */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium ">Follow me Social Media</p>
                        <div className="flex items-center space-x-2.5">
                            <a href="#" className="p-2.5 bg-slate-200 text-gray-600 rounded hover:bg-blue-600 hover:text-white transition-colors">
                                <Star className="h-4 w-4 fill-current stroke-none" />
                            </a>
                            <a href="#" className="p-2.5 bg-blue-600 text-white rounded hover:opacity-90 transition-opacity">
                                <Star className="h-4 w-4 fill-current stroke-none" />
                            </a>
                            <a href="#" className="p-2.5 bg-slate-200 text-[#474C54] rounded hover:bg-blue-600 hover:text-white transition-colors">
                                <Star className="h-4 w-4 fill-current stroke-none" />
                            </a>
                            <a href="#" className="p-2.5 bg-slate-200 text-[#474C54] rounded hover:bg-blue-600 hover:text-white transition-colors">
                                {/* Simulated Reddit/Custom icon using generic standard shapes */}
                                <span className="font-bold text-xs px-0.5">r/</span>
                            </a>
                            <a href="#" className="p-2.5 bg-slate-200 text-[#474C54] rounded hover:bg-blue-600 hover:text-white transition-colors">
                                <Mail className="h-4 w-4" />
                            </a>
                            <a href="#" className="p-2.5 bg-slate-200 text-[#474C54] rounded hover:bg-[#DC3545] hover:text-white transition-colors">
                                <Star className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Right Column: Informational Sidebar Cards */}
                <div className="space-y-6">

                    {/* Box 1: Core Candidate Demographics Grid */}
                    <div className="bg-white border border-[#E8F1FC] rounded-lg p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><Cake className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="text-[11px] uppercase text-gray-600 font-medium tracking-wide pt-1">Date of Birth</p>
                            <p className="text-sm font-medium ">14 June, 2021</p>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><Globe className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="text-[11px] uppercase text-gray-600 font-medium tracking-wide pt-1">Nationality</p>
                            <p className="text-sm font-medium ">Cambodia</p>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><FileText className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="text-[11px] uppercase text-gray-600 font-medium tracking-wide pt-1">Marital Status</p>
                            <p className="text-sm font-medium ">Single</p>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><UserPlus className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="text-[11px] uppercase text-gray-600 font-medium tracking-wide pt-1">Gender</p>
                            <p className="text-sm font-medium ">Male</p>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><Briefcase className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="text-[11px] uppercase text-gray-600 font-medium tracking-wide pt-1">Experience</p>
                            <p className="text-sm font-medium ">7 Years</p>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><GraduationCap className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="text-[11px] uppercase text-gray-600 font-medium tracking-wide pt-1">Educations</p>
                            <p className="text-sm font-medium ">Master Degree</p>
                        </div>
                    </div>

                    {/* Box 2: Download Resume Module */}
                    <div className="bg-white border border-[#E8F1FC] rounded-lg p-6 space-y-3">
                        <h4 className="text-sm font-semibold ">Download My Resume</h4>
                        <div className="flex items-center justify-between border border-[#E4E5E8] rounded-md p-3.5 bg-[#FCFDFE]">
                            <div className="flex items-center space-x-3">
                                <div className="text-red-500 bg-red-50 p-2 rounded"><FileText className="h-6 w-6" /></div>
                                <div>
                                    <p className="text-xs font-medium text-[#474C54] truncate max-w-35">Esther Howard</p>
                                    <p className="text-[11px] text-gray-600 uppercase font-bold">PDF</p>
                                </div>
                            </div>
                            <button type="button" className="p-2.5 bg-[#E8F1FC] text-[#0A65CC] rounded hover:bg-[#D4E6FC] transition-colors">
                                <Download className="h-4 w-4 stroke-[2.5]" />
                            </button>
                        </div>
                    </div>

                    {/* Box 3: Contact Information Module */}
                    <div className="bg-white border border-[#E8F1FC] rounded-lg p-6 space-y-5">
                        <h4 className="text-sm font-semibold ">Contact Information</h4>

                        {/* Website Row */}
                        <div className="flex items-start space-x-3">
                            <Globe className="h-5 w-5 text-[#0A65CC] mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                                <p className="text-[11px] uppercase font-medium tracking-wide text-gray-600">Website</p>
                                <a href="https://www.estherhoward.com" target="_blank" rel="noreferrer" className="text-sm  hover:text-[#0A65CC] break-all font-medium">
                                    www.estherhoward.com
                                </a>
                            </div>
                        </div>

                        <hr className="border-[#E8F1FC]" />

                        {/* Location Row */}
                        <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-[#0A65CC] mt-0.5 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-[11px] uppercase font-medium tracking-wide text-gray-600">Location</p>
                                <p className="text-sm font-medium ">Beverly Hills, California 90202</p>
                                <p className="text-xs text-[#5E6670] leading-relaxed">
                                    Zone/Block Basement 1 Unit B2, 1372 Spring Avenue, Portland,
                                </p>
                            </div>
                        </div>

                        <hr className="border-[#E8F1FC]" />

                        {/* Phone Row */}
                        <div className="flex items-start space-x-3">
                            <Phone className="h-5 w-5 text-[#0A65CC] mt-0.5 shrink-0" />
                            <div className="space-y-3 w-full">
                                <div className="space-y-0.5">
                                    <p className="text-[11px] uppercase font-medium tracking-wide text-gray-600">Phone</p>
                                    <p className="text-sm font-medium ">+1-202-555-0141</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[11px] uppercase font-medium tracking-wide text-gray-600">Secondary Phone</p>
                                    <p className="text-sm font-medium ">+1-202-555-0189</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-[#E8F1FC]" />

                        {/* Email Row */}
                        <div className="flex items-start space-x-3">
                            <Mail className="h-5 w-5 text-[#0A65CC] mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                                <p className="text-[11px] uppercase font-medium tracking-wide text-gray-600">Email Address</p>
                                <a href="mailto:esther.howard@gmail.com" className="text-sm  hover:text-[#0A65CC] font-medium break-all">
                                    esther.howard@gmail.com
                                </a>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}