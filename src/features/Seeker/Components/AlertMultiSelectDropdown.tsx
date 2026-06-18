import { useEffect, useId, useRef, useState, type ComponentType } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { LookupValueItem } from "../../../types/lookupValue";

function toggleSelection(value: string, current: string[]): string[] {
    return current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
}

function getTriggerLabel(selected: string[], placeholder: string): string {
    if (selected.length === 0) {
        return placeholder;
    }

    if (selected.length <= 2) {
        return selected.join(", ");
    }

    return `${selected.slice(0, 2).join(", ")} +${selected.length - 2} more`;
}

type AlertMultiSelectDropdownProps = {
    label: string;
    placeholder: string;
    icon?: ComponentType<{ className?: string }>;
    options: LookupValueItem[];
    selected: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
};

export default function AlertMultiSelectDropdown({
    label,
    placeholder,
    icon: Icon,
    options,
    selected,
    onChange,
    disabled = false,
}: AlertMultiSelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const listId = useId();

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current?.contains(event.target as Node)) {
                return;
            }

            setIsOpen(false);
            setSearchQuery("");
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredOptions = normalizedQuery === ""
        ? options
        : options.filter((option) => option.name.toLowerCase().includes(normalizedQuery));

    const triggerLabel = getTriggerLabel(selected, placeholder);

    return (
        <div ref={containerRef} className="relative space-y-2">
            <div className="flex items-center justify-between gap-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                    {Icon && <Icon className="text-blue-500 w-4 h-4 shrink-0" />}
                    {label}
                </label>
                {selected.length > 0 && (
                    <span className="text-xs text-slate-500">{selected.length} selected</span>
                )}
            </div>

            <button
                type="button"
                onClick={() => {
                    if (disabled) {
                        return;
                    }

                    setIsOpen((open) => !open);
                    if (isOpen) {
                        setSearchQuery("");
                    }
                }}
                disabled={disabled}
                aria-expanded={isOpen}
                aria-controls={listId}
                className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors
                    ${disabled ? "cursor-wait border-gray-200 bg-gray-50 text-slate-400" : "cursor-pointer border-gray-200 bg-white hover:border-blue-300"}
                    ${isOpen ? "border-blue-400 ring-2 ring-blue-100" : ""}`}
            >
                <span className={`truncate ${selected.length === 0 ? "text-slate-400" : "text-slate-700"}`}>
                    {triggerLabel}
                </span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div
                    id={listId}
                    className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
                >
                    {options.length > 6 && (
                        <div className="border-b border-gray-100 p-2">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder={`Search ${label.toLowerCase()}...`}
                                    className="w-full rounded-md border border-gray-200 py-2 pl-8 pr-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                    )}

                    <div className="max-h-56 overflow-y-auto p-2 space-y-1">
                        {options.length === 0 ? (
                            <p className="px-2 py-3 text-sm text-slate-500">No options available.</p>
                        ) : filteredOptions.length === 0 ? (
                            <p className="px-2 py-3 text-sm text-slate-500">No matches found.</p>
                        ) : (
                            filteredOptions.map((option) => (
                                <label
                                    key={option.id}
                                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 hover:bg-slate-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(option.name)}
                                        onChange={() => onChange(toggleSelection(option.name, selected))}
                                        className="h-4 w-4 cursor-pointer rounded text-blue-600"
                                    />
                                    <span className="text-sm text-slate-700">{option.name}</span>
                                </label>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
