import type { LookupValueItem } from "../types/lookupValue";

type LookupSelectProps = {
    label?: string;
    value: string;
    options: LookupValueItem[];
    placeholder: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    className?: string;
};

export default function LookupSelect({
    label,
    value,
    options,
    placeholder,
    disabled = false,
    onChange,
    className = "w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-blue-100 focus:ring-2",
}: LookupSelectProps) {
    return (
        <div className="flex flex-col gap-2">
            {label ? <span className="text-sm">{label}</span> : null}
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                className={className}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
