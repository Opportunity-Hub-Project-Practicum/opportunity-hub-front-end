import { DollarSign, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/path";
import {
    formatSeekerApplicationStatus,
    seekerApplicationStatusClassName,
} from "../lib/seekerPostBan";
import type { AppliedCardItem } from "../types/application";

type SeekerAppliedPostRowProps = {
    item: AppliedCardItem;
};

export default function SeekerAppliedPostRow({ item }: SeekerAppliedPostRowProps) {
    const isBanned = item.postIsBanned;

    return (
        <div
            className={`grid grid-cols-6 border m-2 lg:p-4 rounded-lg transition-all duration-300 ${
                isBanned
                    ? "cursor-default opacity-80"
                    : "hover:border-primary hover:shadow-lg hover:scale-101"
            }`}
        >
            <div className="col-span-3 flex justify-between">
                <div className="flex gap-2 lg:gap-5">
                    <img
                        src={item.image}
                        alt={item.organizationName}
                        className="rounded-lg border w-15 h-15 object-cover bg-white"
                    />
                    <div className="flex flex-col justify-around w-full">
                        <div className="flex gap-1 flex-wrap">
                            <p className="font-semibold">
                                {item.organizationName} - {item.title}
                            </p>
                            <span className="rounded-2xl bg-subPrimary px-2 text-primaryDark w-fit h-fit text-sm">
                                {item.workPlaceType}
                            </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {item.location && (
                                <span className="flex text-small justify-center items-center text-gray-500">
                                    <MapPin className="text-primary" size={15} />
                                    {item.location}
                                </span>
                            )}
                            {item.salary && (
                                <span className="flex text-small justify-center items-center text-gray-500">
                                    <DollarSign className="text-primary" size={15} />
                                    {item.salary}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <span className="text-gray-600 flex items-center">{item.appliedDate}</span>
            <span
                className={`flex items-center ${seekerApplicationStatusClassName(item.status, item.postIsBanned)}`}
            >
                {formatSeekerApplicationStatus(item.status, item.postIsBanned)}
            </span>
            {isBanned ? (
                <span className="bg-gray-200 text-gray-500 flex justify-center items-center rounded-2xl m-2 cursor-not-allowed">
                    View Post
                </span>
            ) : (
                <Link
                    to={ROUTES.HOME.POST_DETAIL(item.postId)}
                    className="bg-primary text-white flex justify-center items-center rounded-2xl m-2"
                >
                    View Post
                </Link>
            )}
        </div>
    );
}
