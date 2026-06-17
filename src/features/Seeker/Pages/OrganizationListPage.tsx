import { ArrowRight, MapPin } from "lucide-react";
import SearchBar from "../Components/searchBar";
import FilterBox from "../Components/FilterBox";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/path";
import { formatApiError } from "../../../services/apiClient";
import { fetchPublicEmployers } from "../services/employerService";
import type { PublicEmployerApi } from "../types/employer";

function getOrganizationTypes(employers: PublicEmployerApi[]): string[] {
    const types = new Set<string>();

    for (const employer of employers) {
        const type = employer.organization_type?.trim();
        if (type) {
            types.add(type);
        }
    }

    return Array.from(types).sort((a, b) => a.localeCompare(b));
}

export default function OrganizationList() {
    const [viewType, setViewType] = useState("grid");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [employers, setEmployers] = useState<PublicEmployerApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

    const organizationTypes = useMemo(() => getOrganizationTypes(employers), [employers]);

    const filteredEmployers = useMemo(() => {
        if (selectedTypes.length === 0) {
            return employers;
        }

        return employers.filter((employer) => {
            const type = employer.organization_type?.trim();
            return type ? selectedTypes.includes(type) : false;
        });
    }, [employers, selectedTypes]);

    const handleTypeChange = (type: string) => {
        setSelectedTypes((prev) =>
            prev.includes(type)
                ? prev.filter((item) => item !== type)
                : [...prev, type],
        );
    };

    return (
        <div className="page-container">
            <SearchBar />
            <FilterBox viewType={viewType} setViewType={setViewType} />

            {loading && <p className="text-gray-500">Loading organizations...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <section className="grid grid-cols-3 gap-5">
                <div className="col-span-1 flex flex-col border border-gray-100 p-5 rounded-lg">
                    <span className="text-lg font-semibold mb-4">Organization Type</span>
                    {organizationTypes.length === 0 && !loading && (
                        <span className="text-sm text-gray-500">No organization types available.</span>
                    )}
                    {organizationTypes.map((type) => (
                        <label
                            key={type}
                            className="text-gray-600 gap-2 flex items-center cursor-pointer py-2 hover:text-primary transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleTypeChange(type)}
                                className="cursor-pointer"
                            />
                            {type}
                        </label>
                    ))}
                </div>
                <div className="col-span-2">
                    <div className="flex flex-col gap-4">
                        {!loading && filteredEmployers.length === 0 && !error && (
                            <p className="text-gray-500">No organizations found.</p>
                        )}
                        {filteredEmployers.map((employer) => {
                            const openPositions = employer.open_posts_count ?? 0;

                            return (
                                <div
                                    key={employer.user_id}
                                    className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            {employer.logo_img ? (
                                                <img
                                                    src={employer.logo_img}
                                                    alt={employer.company_name}
                                                    className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-300 rounded-lg" />
                                            )}
                                            <div className="flex flex-col gap-2 justify-between">
                                                <span className="font-semibold">{employer.company_name}</span>
                                                <div className="flex gap-5 text-sm text-gray-600">
                                                    {employer.industry_type && (
                                                        <span className="flex gap-2">
                                                            <MapPin size={16} />
                                                            {employer.industry_type}
                                                        </span>
                                                    )}
                                                    <span className="flex gap-2">
                                                        <MapPin size={16} />
                                                        {openPositions} Open Position{openPositions === 1 ? "" : "s"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                navigate(ROUTES.HOME.ORGANIZATION_DETAIL(employer.user_id))
                                            }
                                            className="btn-primary-blue flex flex-nowrap justify-center items-center gap-2"
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
