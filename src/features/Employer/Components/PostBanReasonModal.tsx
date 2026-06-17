import { X } from "lucide-react";
import type { EmployerPostBanReportApi } from "../types/employerPost";

type PostBanReasonModalProps = {
    isOpen: boolean;
    postTitle: string;
    reports: EmployerPostBanReportApi[];
    onClose: () => void;
};

function formatReportDate(value: string): string {
    return new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export default function PostBanReasonModal({
    isOpen,
    postTitle,
    reports,
    onClose,
}: PostBanReasonModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="post-ban-reason-title"
                className="w-full max-w-lg rounded-lg bg-white shadow-xl"
            >
                <div className="flex items-start justify-between border-b border-[#E4E5E8] px-6 py-4">
                    <div>
                        <h2 id="post-ban-reason-title" className="text-lg font-semibold text-[#18191C]">
                            Ban Report
                        </h2>
                        <p className="mt-1 text-sm text-[#767F8C]">{postTitle}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded p-1 text-[#767F8C] transition-colors hover:bg-[#F1F2F4] hover:text-[#18191C]"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="max-h-[24rem] space-y-3 overflow-y-auto px-6 py-4">
                    {reports.length === 0 ? (
                        <p className="py-6 text-center text-sm text-[#767F8C]">
                            No report details are available for this post.
                        </p>
                    ) : (
                        reports.map((report) => (
                            <div
                                key={report.report_id}
                                className="rounded-lg border border-[#E4E5E8] bg-[#F8F9FA] p-4"
                            >
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <span className="text-xs font-medium uppercase tracking-wide text-[#DC3545]">
                                        {report.report_status}
                                    </span>
                                    <span className="text-xs text-[#9199A3]">
                                        {formatReportDate(report.created_date)}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed text-[#5E6670]">
                                    {report.report_reason}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t border-[#E4E5E8] px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-sm bg-[#F1F2F4] px-4 py-2.5 text-sm font-semibold text-[#18191C] transition-colors hover:bg-[#E4E5E8]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
