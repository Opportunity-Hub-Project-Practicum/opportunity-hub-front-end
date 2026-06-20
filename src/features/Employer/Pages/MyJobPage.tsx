import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/path';
import SearchBox from '../../../GlobalComponents/SearchBox';
import EmployerPostListTable from '../Components/EmployerPostListTable';
import PostListingDurationModal from '../Components/PostListingDurationModal';
import { formatApiError } from '../../../services/apiClient';
import { useEmployerPostListingActions } from '../hooks/useEmployerPostListingActions';
import {
    mapEmployerPostToListingItem,
    type ListingItem,
} from '../lib/myJobMappers';
import { fetchEmployerPosts } from '../services/employerPostService';

type PostTab = 'JOBS' | 'Volunteer';
type JobStatusFilter = 'All Jobs' | 'Active' | 'Expired' | 'Banned';

export default function MyJobPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<PostTab>('JOBS');
    const [jobStatusFilter, setJobStatusFilter] = useState<JobStatusFilter>('All Jobs');
    const [search, setSearch] = useState('');
    const [listings, setListings] = useState<ListingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        updatingPostId,
        modalError,
        selectedListing,
        handleSaveDuration,
        handleCloseListingNow,
        openDurationModal,
        closeDurationModal,
    } = useEmployerPostListingActions(setListings, setError);

    const loadListings = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const posts = await fetchEmployerPosts();
            setListings(posts.map(mapEmployerPostToListingItem));
        } catch (loadError) {
            setError(formatApiError(loadError));
            setListings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadListings();
    }, [loadListings]);

    const displayedListings = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        const expectedPostType = activeTab === 'JOBS' ? 'job' : 'volunteer';

        return listings.filter((item) => {
            if (item.postType !== expectedPostType) {
                return false;
            }

            if (normalizedSearch && !item.title.toLowerCase().includes(normalizedSearch)) {
                return false;
            }

            if (jobStatusFilter === 'Active' && item.status !== 'Active') {
                return false;
            }

            if (jobStatusFilter === 'Expired' && item.status !== 'Expire') {
                return false;
            }

            if (jobStatusFilter === 'Banned' && item.status !== 'Banned') {
                return false;
            }

            return true;
        });
    }, [activeTab, jobStatusFilter, listings, search]);

    return (
        <div className="page-container">
            <SearchBox search={search} setSearch={setSearch} />
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-xl font-medium tracking-tight">
                    My Jobs <span className="text-[#767F8C] font-normal text-big">({displayedListings.length})</span>
                </h1>

                <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <span className="text-sm text-[#5E6670]">Job status</span>
                    <div className="relative">
                        <select
                            value={jobStatusFilter}
                            onChange={(e) => setJobStatusFilter(e.target.value as JobStatusFilter)}
                            className="bg-white border border-[#E4E5E8] rounded-md pl-4 pr-10 py-2 text-sm text-[#18191C] font-normal appearance-none focus:outline-none focus:border-primary min-w-35"
                        >
                            <option>All Jobs</option>
                            <option>Active</option>
                            <option>Expired</option>
                            <option>Banned</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                    </div>
                </div>
            </div>

            <EmployerPostListTable
                listings={displayedListings}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onViewApplications={(postId) => {
                    navigate(`${ROUTES.EMPLOYER.ROOT}/${ROUTES.EMPLOYER.MY_JOB_VIEW_APPLICATION(postId)}`);
                }}
                onTogglePostStatus={openDurationModal}
                onClosePost={(item) => void handleCloseListingNow(item)}
                updatingPostId={updatingPostId}
                loading={loading}
                error={error}
            />

            <PostListingDurationModal
                isOpen={selectedListing != null}
                listing={selectedListing}
                isSaving={selectedListing != null && updatingPostId === selectedListing.postId}
                error={modalError}
                onClose={closeDurationModal}
                onSave={(closedDate) => void handleSaveDuration(closedDate)}
                onCloseListing={() => {
                    if (selectedListing) {
                        void handleCloseListingNow(selectedListing);
                    }
                }}
            />
        </div>
    );
}
