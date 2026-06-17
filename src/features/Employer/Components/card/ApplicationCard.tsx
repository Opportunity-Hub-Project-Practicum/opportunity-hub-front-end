import { ArrowRight, Download } from "lucide-react";

interface ApplicationCardProp {
    applicationId: string;
    userName: string;
    role: string;
    appliedDate: string;
    url_Cv: string;
    image?: string;
    columnName: string;
    onViewCv?: (applicationId: string) => void;
}

export function ApplicationCard({
    applicationId,
    userName,
    role,
    appliedDate,
    url_Cv,
    image,
    columnName,
    onViewCv,
}: ApplicationCardProp) {
    return (
        <div className="w-fit rounded-xl border border-[#E4E5E8] bg-[#F8F9FA] p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#767F8C]">
                {columnName}
            </span>

            <div className="mt-3 w-65 rounded-xl border border-[#E4E5E8] bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <img
                        className="h-12 w-12 rounded-full border border-gray-100 object-cover ring-1 ring-gray-100"
                        src={image}
                        alt={userName}
                    />

                    <div className="min-w-0">
                        <p className="truncate font-medium text-[#18191C]">{userName}</p>
                        <p className="truncate text-sm text-[#767F8C]">{role}</p>
                    </div>
                </div>

                <hr className="my-3 border-gray-100" />

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => onViewCv?.(applicationId)}
                        type="button"
                        className="flex w-fit items-center gap-2 text-sm text-[#5E6670] transition-colors hover:text-primary"
                    >
                        <ArrowRight size={16} />
                        View CV
                    </button>

                    <span className="text-sm text-[#767F8C]">
                        Applied date: {appliedDate}
                    </span>
                </div>

                <a
                    href={url_Cv}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex w-fit items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primaryDark"
                >
                    <Download size={16} />
                    Download CV
                </a>
            </div>
        </div>
    );
}
