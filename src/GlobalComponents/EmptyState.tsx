import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className = "" }: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-subPrimary/50 text-primary mb-4">
                <Icon size={26} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            {description && <p className="text-sm text-gray-500 max-w-sm">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
