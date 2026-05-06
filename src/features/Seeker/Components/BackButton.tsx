import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function BackButton() {
    const navigate = useNavigate();
    return (
        <div className="max-w-7xl py-3">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm rounded-lg hover:bg-blue-50 transition-colors"
            >
                <ArrowLeft size={18} />
                Back
            </button>
        </div>
    );
}