import { X } from "lucide-react";

type ResolvePostReportModalProps = {
    isOpen: boolean;
    postTitle: string;
    loading?: boolean;
    onClose: () => void;
    onIgnore: () => void;
    onBan: () => void;
};

export default function ResolvePostReportModal({
    isOpen,
    postTitle,
    loading = false,
    onClose,
    onIgnore,
    onBan,
}: ResolvePostReportModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="resolve-post-report-title"
                className="w-full max-w-lg rounded-lg bg-white shadow-xl"
            >
                <div className="flex items-start justify-between border-b border-[#E4E5E8] px-6 py-4">
                    <div>
                        <h2
                            id="resolve-post-report-title"
                            className="text-lg font-semibold text-[#18191C]"
                        >
                            Resolve Report
                        </h2>
                        <p className="mt-1 text-sm text-[#767F8C]">{postTitle}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded p-1 text-[#767F8C] transition-colors hover:bg-[#F1F2F4] hover:text-[#18191C] disabled:opacity-60"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-6 py-5">
                    <p className="text-sm leading-relaxed text-[#5E6670]">
                        How would you like to resolve the reports for this post?
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-[#5E6670]">
                        <li>
                            <span className="font-semibold text-[#18191C]">Ignore:</span>{" "}
                            Dismiss the reports and keep the post active.
                        </li>
                        <li>
                            <span className="font-semibold text-[#18191C]">Ban:</span>{" "}
                            Dismiss the reports and ban the post.
                        </li>
                    </ul>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-[#E4E5E8] px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-sm bg-[#F1F2F4] px-4 py-2.5 text-sm font-semibold text-[#18191C] transition-colors hover:bg-[#E4E5E8] disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onIgnore}
                        disabled={loading}
                        className="rounded-sm bg-[#28A745] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#218838] disabled:opacity-60"
                    >
                        Ignore
                    </button>
                    <button
                        type="button"
                        onClick={onBan}
                        disabled={loading}
                        className="rounded-sm bg-[#DC3545] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c82333] disabled:opacity-60"
                    >
                        Ban
                    </button>
                </div>
            </div>
        </div>
    );
}
