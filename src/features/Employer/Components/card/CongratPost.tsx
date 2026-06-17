import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routes/path";

export default function CongratPost({ type }: { type: string }) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-[#E4E5E8] bg-white p-5 shadow-sm lg:p-6">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle2 className="text-green-600" size={20} />
                </div>
                <div className="space-y-1">
                    <p className="font-semibold text-[#18191C]">
                        Congratulations, your {type} is successfully posted!
                    </p>
                    <p className="text-sm text-[#767F8C]">
                        you can manage your form in MY JOB section
                    </p>
                </div>
            </div>

            <Link
                className="btn-primary-white inline-flex w-fit items-center gap-2 text-primaryDark"
                to={ROUTES.EMPLOYER.MY_JOBS}
            >
                View JOb
                <ArrowRight size={16} />
            </Link>

            <hr className="border-gray-100" />
        </div>
    );
}
