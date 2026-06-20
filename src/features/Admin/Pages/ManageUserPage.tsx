import { CheckCircle2, Users, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import SeekerProfileSection from "../../../GlobalComponents/SeekerProfileSection";
import SearchBox from "../../../GlobalComponents/SearchBox";
import EmptyState from "../../../GlobalComponents/EmptyState";
import { Skeleton } from "../../../GlobalComponents/Skeleton";
import EmployerProfileSection from "../../Employer/Components/EmployerProfileSection";
import { formatApiError } from "../../../services/apiClient";
import { mapProfileApiToSettings as mapEmployerProfileToForm } from "../../Employer/lib/employerProfileMappers";
import type { EmployerProfileApi } from "../../Employer/types/employerProfile";
import { mapProfileApiToSettings as mapSeekerProfileToForm } from "../../Seeker/lib/seekerProfileMappers";
import {
    banAdminEmployer,
    banAdminSeeker,
    fetchAdminEmployer,
    fetchAdminEmployers,
    fetchAdminSeeker,
    fetchAdminSeekers,
    unbanAdminEmployer,
    unbanAdminSeeker,
} from "../services/adminUserService";
import type { AdminSeekerApi, ManageUserFilter } from "../types/adminUser";

function formatJoinedDate(value: string | null | undefined): string {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function matchesSearch(value: string, query: string): boolean {
    return value.toLowerCase().includes(query.trim().toLowerCase());
}

export default function ManageUserPage() {
    const [entityFilter, setEntityFilter] = useState<ManageUserFilter>("user");
    const [search, setSearch] = useState("");
    const [seekers, setSeekers] = useState<AdminSeekerApi[]>([]);
    const [employers, setEmployers] = useState<EmployerProfileApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSeekerId, setSelectedSeekerId] = useState<number | null>(null);
    const [selectedEmployerId, setSelectedEmployerId] = useState<number | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [seekerProfileData, setSeekerProfileData] =
        useState<ReturnType<typeof mapSeekerProfileToForm>["profile"] | null>(null);
    const [employerProfileData, setEmployerProfileData] =
        useState<ReturnType<typeof mapEmployerProfileToForm>["formData"] | null>(null);
    const [selectedIsBanned, setSelectedIsBanned] = useState(false);
    const [banActionLoading, setBanActionLoading] = useState(false);

    const loadListings = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (entityFilter === "user") {
                const data = await fetchAdminSeekers();
                setSeekers(data);
            } else {
                const data = await fetchAdminEmployers();
                setEmployers(data);
            }
        } catch (loadError) {
            setError(formatApiError(loadError));
        } finally {
            setLoading(false);
        }
    }, [entityFilter]);

    useEffect(() => {
        loadListings();
    }, [loadListings]);

    const filteredSeekers = useMemo(() => {
        if (!search.trim()) {
            return seekers;
        }

        return seekers.filter((seeker) => {
            const name = seeker.full_name ?? "";
            const email = seeker.email ?? "";
            return matchesSearch(name, search) || matchesSearch(email, search);
        });
    }, [search, seekers]);

    const filteredEmployers = useMemo(() => {
        if (!search.trim()) {
            return employers;
        }

        return employers.filter((employer) => {
            const name = employer.company_name ?? "";
            const email = employer.company_email ?? "";
            const industry = employer.industry_type ?? "";
            return (
                matchesSearch(name, search)
                || matchesSearch(email, search)
                || matchesSearch(industry, search)
            );
        });
    }, [employers, search]);

    const handleViewSeekerProfile = async (seekerId: number) => {
        setSelectedSeekerId(seekerId);
        setSelectedEmployerId(null);
        setProfileLoading(true);
        setProfileError(null);
        setSeekerProfileData(null);
        setEmployerProfileData(null);

        try {
            const seeker = await fetchAdminSeeker(seekerId);
            setSeekerProfileData(mapSeekerProfileToForm(seeker).profile);
            setSelectedIsBanned(seeker.is_ban);
        } catch (loadError) {
            setProfileError(formatApiError(loadError));
        } finally {
            setProfileLoading(false);
        }
    };

    const handleViewEmployerProfile = async (employerId: number) => {
        setSelectedEmployerId(employerId);
        setSelectedSeekerId(null);
        setProfileLoading(true);
        setProfileError(null);
        setSeekerProfileData(null);
        setEmployerProfileData(null);

        try {
            const employer = await fetchAdminEmployer(employerId);
            setEmployerProfileData(mapEmployerProfileToForm(employer, null).formData);
            setSelectedIsBanned(employer.is_ban);
        } catch (loadError) {
            setProfileError(formatApiError(loadError));
        } finally {
            setProfileLoading(false);
        }
    };

    const closeProfileModal = () => {
        setSelectedSeekerId(null);
        setSelectedEmployerId(null);
        setSeekerProfileData(null);
        setEmployerProfileData(null);
        setProfileError(null);
        setSelectedIsBanned(false);
        setBanActionLoading(false);
    };

    const handleToggleBan = async () => {
        setBanActionLoading(true);
        setProfileError(null);

        try {
            if (selectedSeekerId != null) {
                const updated = selectedIsBanned
                    ? await unbanAdminSeeker(selectedSeekerId)
                    : await banAdminSeeker(selectedSeekerId);

                setSelectedIsBanned(updated.is_ban);
                setSeekers((current) =>
                    current.map((seeker) =>
                        seeker.user_id === selectedSeekerId
                            ? { ...seeker, is_ban: updated.is_ban }
                            : seeker,
                    ),
                );
            } else if (selectedEmployerId != null) {
                const updated = selectedIsBanned
                    ? await unbanAdminEmployer(selectedEmployerId)
                    : await banAdminEmployer(selectedEmployerId);

                setSelectedIsBanned(updated.is_ban);
                setEmployers((current) =>
                    current.map((employer) =>
                        employer.user_id === selectedEmployerId
                            ? { ...employer, is_ban: updated.is_ban }
                            : employer,
                    ),
                );
            }
        } catch (actionError) {
            setProfileError(formatApiError(actionError));
        } finally {
            setBanActionLoading(false);
        }
    };

    const isProfileModalOpen = selectedSeekerId != null || selectedEmployerId != null;
    const listColumnLabel = entityFilter === "user" ? "User" : "Organisation";
    const detailColumnLabel = entityFilter === "user" ? "Email" : "Industry";

    return (
        <div>
            <SearchBox search={search} setSearch={setSearch} />

            <div className="flex justify-end m-5">

                <select
                    id="entity-filter"
                    value={entityFilter}
                    onChange={(event) => {
                        setEntityFilter(event.target.value as ManageUserFilter);
                        setSearch("");
                    }}
                    className="w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#0A65CC]"
                >
                    <option value="user">User</option>
                    <option value="organisation">Organisation (Employer)</option>
                </select>
            </div>

            <div className="hidden md:grid grid-cols-6 bg-[#F1F2F4] px-6 py-3 text-[12px] font-medium tracking-wider text-[#474C54] uppercase items-center">
                <div className="col-span-3 flex items-center space-x-8">
                    <span>{listColumnLabel}</span>
                </div>
                <div className="text-left pl-2">Status</div>
                <div className="text-left">{detailColumnLabel}</div>
                <div className="text-left pl-4">Actions</div>
            </div>

            {loading && (
                <div className="space-y-3 px-2 py-4 md:px-0">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="m-4 alert-error">{error}</div>
            )}

            {!loading && !error && entityFilter === "user" && filteredSeekers.length === 0 && (
                <EmptyState icon={Users} title="No users found" description="Try a different search term." />
            )}

            {!loading && !error && entityFilter === "organisation" && filteredEmployers.length === 0 && (
                <EmptyState icon={Users} title="No organisations found" description="Try a different search term." />
            )}

            <div className="w-full divide-y divide-[#E4E5E8]">
                {entityFilter === "user" && filteredSeekers.map((item) => (
                    <div
                        key={item.user_id}
                        className="grid grid-cols-1 gap-3 md:grid-cols-6 px-6 py-5 md:items-center hover:bg-gray-50/40 transition-colors"
                    >
                        <div className="col-span-1 md:col-span-3 space-y-1">
                            <h2 className="text-base font-medium text-[#18191C]">
                                {item.full_name ?? `User #${item.user_id}`}
                            </h2>
                            <div className="flex items-center space-x-1.5 text-sm text-[#767F8C]">
                                <span>Joined: {formatJoinedDate(item.created_at)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-start md:pl-2">
                            <span className="text-xs font-medium uppercase text-gray-400 md:hidden">Status</span>
                            {!item.is_ban ? (
                                <span className="inline-flex items-center space-x-1.5 text-sm text-[#28A745] font-medium">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Active</span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center space-x-1.5 text-sm text-[#DC3545] font-medium">
                                    <XCircle className="h-4 w-4" />
                                    <span>Ban</span>
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between md:justify-start space-x-2 text-sm text-[#5E6670]">
                            <span className="text-xs font-medium uppercase text-gray-400 md:hidden">Email</span>
                            <span className="flex items-center gap-2 truncate">
                                <Users className="h-4 w-4 text-[#9199A3] hidden md:inline" />
                                {item.email ?? "—"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between md:pl-4">
                            <button
                                type="button"
                                onClick={() => handleViewSeekerProfile(item.user_id)}
                                className="bg-subPrimary text-primary text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-subPrimary/70 transition-colors"
                            >
                                View profile
                            </button>
                        </div>
                    </div>
                ))}

                {entityFilter === "organisation" && filteredEmployers.map((item) => (
                    <div
                        key={item.user_id}
                        className="grid grid-cols-1 gap-3 md:grid-cols-6 px-6 py-5 md:items-center hover:bg-gray-50/40 transition-colors"
                    >
                        <div className="col-span-1 md:col-span-3 space-y-1">
                            <h2 className="text-base font-medium text-[#18191C]">
                                {item.company_name}
                            </h2>
                            <div className="flex items-center space-x-1.5 text-sm text-[#767F8C]">
                                <span>Joined: {formatJoinedDate(item.created_at)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-start md:pl-2">
                            <span className="text-xs font-medium uppercase text-gray-400 md:hidden">Status</span>
                            {!item.is_ban ? (
                                <span className="inline-flex items-center space-x-1.5 text-sm text-[#28A745] font-medium">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Active</span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center space-x-1.5 text-sm text-[#DC3545] font-medium">
                                    <XCircle className="h-4 w-4" />
                                    <span>Ban</span>
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between md:justify-start space-x-2 text-sm text-[#5E6670]">
                            <span className="text-xs font-medium uppercase text-gray-400 md:hidden">{detailColumnLabel}</span>
                            <span className="truncate">{item.industry_type ?? "—"}</span>
                        </div>

                        <div className="flex items-center justify-between md:pl-4">
                            <button
                                type="button"
                                onClick={() => handleViewEmployerProfile(item.user_id)}
                                className="bg-subPrimary text-primary text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-subPrimary/70 transition-colors"
                            >
                                View profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
                        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                            {!profileLoading && !profileError && (seekerProfileData || employerProfileData) && (
                                <button
                                    type="button"
                                    onClick={handleToggleBan}
                                    disabled={banActionLoading}
                                    className={`rounded-sm px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${selectedIsBanned
                                        ? "bg-[#28A745] text-white hover:bg-[#218838]"
                                        : "bg-[#DC3545] text-white hover:bg-[#c82333]"
                                        }`}
                                >
                                    {banActionLoading
                                        ? "Saving..."
                                        : selectedIsBanned
                                            ? "Unban"
                                            : "Ban"}
                                </button>
                            )}
                            <button
                                onClick={closeProfileModal}
                                type="button"
                                className="rounded-full bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        {profileLoading && (
                            <div className="py-12 text-center text-sm text-[#767F8C]">
                                Loading profile...
                            </div>
                        )}

                        {!profileLoading && profileError && (
                            <div className="py-12 text-center text-sm text-red-600">
                                {profileError}
                            </div>
                        )}

                        {!profileLoading && !profileError && seekerProfileData && (
                            <SeekerProfileSection
                                seekerData={seekerProfileData}
                                viewOnly
                            />
                        )}

                        {!profileLoading && !profileError && employerProfileData && (
                            <EmployerProfileSection
                                data={employerProfileData}
                                viewOnly
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
