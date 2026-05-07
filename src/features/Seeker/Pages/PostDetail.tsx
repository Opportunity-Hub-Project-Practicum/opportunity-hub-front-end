import { useParams } from 'react-router-dom';
import { Posts, getOrganizationById, formatSalary } from "../../../services/postService";
import { ArrowLeft, Bookmark, ArrowRight, Link2Icon, Calendar, Clock, GraduationCap, DollarSign, MapPin, Briefcase, Star } from 'lucide-react';
import BackButton from '../Components/BackButton';
import { useState } from 'react';
import CardCompany from '../Components/card/CardCompany';
import CardGrid from '../Components/card/CardGrid';


export default function PostDetail() {
    const { id } = useParams<{ id: string }>();
    const [isBookmarked, setIsBookmarked] = useState(false);


    const post = Posts.find(p => p.id === parseInt(id || '0'));

    if (!post) {
        return <div>Post not found</div>;
    }

    const organization = getOrganizationById(post.employer_id);
    const isVolunteer = post.type === 'volunteer';

    // Overview items configuration
    const getOverviewItems = () => {
        const items = [
            {
                label: 'Posted',
                value: new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                icon: Calendar,
                show: !!post.created_at
            },
            {
                label: 'Expire In',
                value: new Date(post.closed_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                icon: Clock,
                show: !!post.closed_date
            },
            {
                label: isVolunteer ? 'Benefit' : 'Salary',
                value: formatSalary(post),
                icon: DollarSign,
                show: true
            },
            {
                label: 'Education',
                value: post.job_education,
                icon: GraduationCap,
                show: !isVolunteer && !!post.job_education
            },
            {
                label: 'Location',
                value: post.location,
                icon: MapPin,
                show: !!post.location
            },
            {
                label: 'Job Role',
                value: post.job_role,
                icon: Briefcase,
                show: !isVolunteer && !!post.job_role
            },
            {
                label: 'Experience',
                value: post.job_experience,
                icon: Star,
                show: !isVolunteer && !!post.job_experience
            }
        ];

        return items.filter(item => item.show);
    };

    const overviewItems = getOverviewItems();

    return (
        <>
            <section className='page-container'>
                {/* Back Button */}

                <BackButton />
                {/* Header Section */}
                <div className='flex justify-between items-start rounded-lg bg-gray-100 p-5 mb-5'>
                    <div className='flex gap-4 '>
                        {organization?.image ? (
                            <img src={organization.image} alt="company logo" className="w-16 h-16 rounded-lg object-cover" />
                        ) : (
                            <div className="w-16 h-16 bg-slate-300 rounded-lg"></div>
                        )}

                        <div className='flex flex-col'>
                            <div className='flex gap-2'>
                                <h1 className='text-2xl font-bold'>{post.title}</h1>
                                <p className='flex px-1 text-small bg-subPrimary rounded-lg justify-center items-center'>{post.employment_type}</p>
                            </div>
                            <div className='flex gap-3 '>
                                {organization?.Category === 'web_url' && <div className='flex gap-2 justify-center items-center'><Link2Icon size={16} /> {organization.value}</div>}
                                {organization?.Category === 'social' && <div className='flex  gap-2 justify-center items-center'><Link2Icon size={16} /> {organization.value}</div>}
                                {organization?.Category === 'phone' && <div className='flex   gap-2 justify-center items-center'><Link2Icon size={16} /> {organization.value}</div>}
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-3'>
                        <button onClick={() => setIsBookmarked(!isBookmarked)} className="flex items-center justify-center w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded transition-colors">
                            <Bookmark size={18} className={`transition-colors ${isBookmarked ? "fill-yellow-400 stroke-yellow-500 text-yellow-500" : "stroke-slate-400 text-slate-400"}`} />
                        </button>
                        <button className='btn-primary-blue flex items-center gap-2'>
                            {isVolunteer ? "Join Now" : "Apply Now"}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className='grid grid-cols-3 gap-5 '>
                    <div className='flex flex-col gap-5 col-span-2'>
                        <span className='text-big'>{isVolunteer ? 'Volunteer Description' : 'Job Description'}</span>
                        <p>{post.post_description}</p>
                        <span className='text-big'>Responsibilities</span>
                        <p>{post.responsibility}</p>
                        <span>Share this job on: facebook, instargram...</span>
                    </div>

                    {/* Job Overview Section */}
                    <div className='flex flex-col gap-5'>
                        <div className='border rounded-lg border-primary p-5'>
                            <span className='text-big'>Job Overview</span>
                            <div className='grid grid-cols-3 gap-4 mt-4'>
                                {overviewItems.map((item, index) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <div key={index} className='flex flex-col'>
                                            <IconComponent className='text-primary mb-1' size={20} />
                                            <span className='text-small text-gray-500'>{item.label}</span>
                                            <span className='text-small font-semibold'>{item.value}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/*organization description*/}


                        {/* Company Info */}
                        <CardCompany organization={organization} />

                        <button className='bg-red-600 text-white rounded-lg p-2'>Report Post</button>
                    </div>
                </div>
            </section>
            <section className='flex flex-col page-container'>
                <div className='flex justify-between py-5'>
                    <span className='text-big'>Related {isVolunteer ? 'Volunteer' : 'Jobs'}</span>
                    <div className='flex gap-2 '
                    >
                        <button className='bg-subPrimary rounded-lg text-primaryDark p-1'><ArrowLeft /></button>
                        <button className='bg-subPrimary rounded-lg text-primaryDark p-1'><ArrowRight /></button>
                    </div>
                </div>
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-5'>
                    {Posts.filter(p =>
                        p.type === post.type &&
                        p.category === post.category &&
                        p.id !== post.id
                    ).slice(0, 6).map(relatedPost => {
                        const relatedOrg = getOrganizationById(relatedPost.employer_id);
                        return (
                            <CardGrid
                                key={relatedPost.id}
                                id={relatedPost.id}
                                organizationName={relatedOrg?.name || 'Unknown'}
                                title={relatedPost.title}
                                engagementType={relatedPost.work_place_type}
                                location={relatedPost.location}
                                salary={formatSalary(relatedPost)}
                                remainingDays={relatedPost.closed_date}
                                image={relatedOrg?.image}
                            />
                        );
                    })}
                </div>
            </section></>

    );
}