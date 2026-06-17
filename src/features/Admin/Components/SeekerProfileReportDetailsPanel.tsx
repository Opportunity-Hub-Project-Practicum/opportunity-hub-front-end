import { formatSeekerReportDateTime } from "../services/adminSeekerProfileReportService";
import type { AdminSeekerProfileReportApi } from "../types/adminSeekerProfileReport";

type SeekerProfileReportDetailsPanelProps = {
    reports: AdminSeekerProfileReportApi[];
};

export default function SeekerProfileReportDetailsPanel({
    reports,
}: SeekerProfileReportDetailsPanelProps) {
    return (
        <div className="flex h-full min-h-[24rem] flex-col rounded-xl border border-[#E4E5E8] bg-[#F8F9FA] lg:min-h-0">
            <div className="border-b border-[#E4E5E8] px-5 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[#474C54]">
                    Report Details
                </h3>
                <p className="mt-1 text-xs text-[#767F8C]">
                    {reports.length} report{reports.length === 1 ? "" : "s"} from employers
                </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {reports.length === 0 && (
                    <p className="py-8 text-center text-sm text-[#767F8C]">
                        No reports found for this seeker.
                    </p>
                )}

                {reports.map((report) => (
                    <div
                        key={report.seeker_profile_report_id}
                        className="rounded-lg border border-[#E4E5E8] bg-white p-4 shadow-sm"
                    >
                        <div className="mb-2 flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-[#18191C]">
                                    {report.employer_name ?? `Employer #${report.employer_id}`}
                                </p>
                                <p className="text-xs text-[#767F8C]">
                                    {report.employer_email ?? "No email"}
                                </p>
                            </div>
                            <span className="shrink-0 text-xs text-[#9199A3]">
                                {formatSeekerReportDateTime(report.created_at)}
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-[#5E6670]">
                            {report.report_reason}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
