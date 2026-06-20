import { ArrowRight, MapPin } from "lucide-react";
import EmployerSearchBar from "../Components/EmployerSearchBar";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/path";
import { formatApiError } from "../../../services/apiClient";
import { resolveAssetUrl } from "../../Employer/lib/resolveAssetUrl";
import { fetchPublicEmployers } from "../services/employerService";
import type { PublicEmployerApi } from "../types/employer";
import {
    EMPTY_EMPLOYER_SEARCH_FILTERS,
    filterPublicEmployers,
    hasActiveEmployerSearch,
} from "../lib/filterEmployers";
import { useLookupValues } from "../../../hooks/useLookupValues";

export default function OrganizationList() {

    const [employers, setEmployers] = useState<PublicEmployerApi[]>([]);
    const [searchFilters, setSearchFilters] = useState(EMPTY_EMPLOYER_SEARCH_FILTERS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { lookupValues } = useLookupValues();

    useEffect(() => {
        let isMounted = true;

        const loadEmployers = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchPublicEmployers();
                if (!isMounted) {
                    return;
                }
                setEmployers(data);
            } catch (err) {
                if (!isMounted) {
                    return;
                }
                setError(formatApiError(err));
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadEmployers();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredEmployers = useMemo(
        () => filterPublicEmployers(employers, searchFilters, lookupValues),
        [employers, lookupValues, searchFilters],
    );

    return (
        <div className="page-container">
            <EmployerSearchBar filters={searchFilters} onFiltersChange={setSearchFilters} />


            {loading && <p className="text-gray-500">Loading organizations...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <section className="px-5 md:px-4 lg:px-6">
                <div className="mx-auto max-w-7xl">
                    {!loading && filteredEmployers.length === 0 && !error && (
                        <p className="text-gray-500">
                            {hasActiveEmployerSearch(searchFilters)
                                ? "No organizations match your search."
                                : "No organizations found."}
                        </p>
                    )}

                    <div className="flex flex-col gap-4">
                        {filteredEmployers.map((employer) => {
                            const openPositions = employer.open_posts_count ?? 0;
                            const logoUrl = resolveAssetUrl(employer.logo_img);

                            return (
                                <div
                                    key={employer.user_id}
                                    className="rounded-lg border border-gray-100 p-5 transition-shadow hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            {logoUrl ? (
                                                <img
                                                    src={logoUrl}
                                                    alt={employer.company_name}
                                                    className="h-16 w-16 rounded-lg border border-gray-100 object-cover"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-lg bg-gray-300" />
                                            )}
                                            <div className="flex flex-col justify-between gap-2">
                                                <span className="font-semibold">{employer.company_name}</span>
                                                <div className="flex flex-wrap gap-5 text-sm text-gray-600">
                                                    {employer.organization_type && (
                                                        <span>{employer.organization_type}</span>
                                                    )}
                                                    {employer.industry_type && (
                                                        <span>{employer.industry_type}</span>
                                                    )}
                                                    {employer.map_location && (
                                                        <span className="flex gap-2">
                                                            <MapPin size={16} />
                                                            {employer.map_location}
                                                        </span>
                                                    )}
                                                    <span className="flex gap-2">
                                                        {openPositions} Open Position{openPositions === 1 ? "" : "s"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                navigate(ROUTES.HOME.ORGANIZATION_DETAIL(employer.user_id))
                                            }
                                            className="btn-primary-blue flex flex-nowrap items-center justify-center gap-2"
                                        >
                                            Open Position
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
