interface UrgentBadgeProps {
    className?: string;
}

export default function UrgentBadge({ className = "" }: UrgentBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 ${className}`.trim()}
        >
            Urgent
        </span>
    );
}
