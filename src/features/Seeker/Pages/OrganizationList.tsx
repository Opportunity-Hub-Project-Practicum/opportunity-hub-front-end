import { ArrowRight, MapPin } from "lucide-react";
import SearchBar from "../Components/searchBar";
import FilterBox from "../Components/FilterBox";
import { useState } from "react";
import { Organizations, Posts } from "../../../services/postService";
import { useNavigate } from "react-router-dom";

export default function OrganizationList() {
    const [viewType, setViewType] = useState('grid')
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const navigate = useNavigate();
    const organizationTypes = [
        'Government',
        'Semi Government',
        'NGO',
        'Private Company',
        'International Agencies',
        'Others'
    ];

    const handleTypeChange = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    return (
        <div className="page-container">
            <SearchBar />
            <FilterBox viewType={viewType} setViewType={setViewType} />
            <section className="grid grid-cols-3 gap-5">
                <div className="col-span-1 flex flex-col border border-gray-100 p-5 rounded-lg">
                    <span className="text-lg font-semibold mb-4">Organization Type</span>
                    {organizationTypes.map(type => (
                        <label key={type} className="text-gray-600 gap-2 flex items-center cursor-pointer py-2 hover:text-primary transition-colors">
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
                        {Organizations.filter(org =>
                            selectedTypes.length === 0 || selectedTypes.includes(org.organization_type)
                        ).map(org => {
                            const openPositions = Posts.filter(post => post.employer_id === org.id).length;
                            return (
                                <div key={org.id} className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            {org.image ? (
                                                <img src={org.image} alt={org.name} className="w-16 h-16 rounded-lg object-cover border border-gray-100" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                                            )}
                                            <div className="flex flex-col gap-2 justify-between">
                                                <span className="font-semibold">{org.name}</span>
                                                <div className="flex gap-5 text-sm text-gray-600">
                                                    <span className="flex gap-2"><MapPin size={16} />{org.industry_type}</span>
                                                    <span className="flex gap-2"><MapPin size={16} />{openPositions} Open Positions</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/organizationDetail/${org.id}`)}
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