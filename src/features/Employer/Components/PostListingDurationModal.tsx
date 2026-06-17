import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ListingItem } from "../lib/myJobMappers";
import {
    closedDateFromDaysOpen,
    defaultClosingDateInput,
    defaultDaysOpen,
    toApiClosedDate,
} from "../lib/myJobMappers";

type DurationMode = "days" | "date";

interface PostListingDurationModalProps {
    isOpen: boolean;
    listing: ListingItem | null;
    isSaving: boolean;
    error: string | null;
    onClose: () => void;
    onSave: (closedDate: string) => void;
    onCloseListing: () => void;
}

export default function PostListingDurationModal({
    isOpen,
    listing,
    isSaving,
    error,
    onClose,
    onSave,
    onCloseListing,
}: PostListingDurationModalProps) {
    const [mode, setMode] = useState<DurationMode>("days");
    const [daysOpen, setDaysOpen] = useState("30");
    const [closingDate, setClosingDate] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !listing) {
            return;
        }

        setMode("days");
        setDaysOpen(String(defaultDaysOpen(listing)));
        setClosingDate(defaultClosingDateInput(listing));
        setValidationError(null);
    }, [isOpen, listing]);

    if (!isOpen || !listing) {
        return null;
    }

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateValue = minDate.toISOString().slice(0, 10);

    const handleSave = () => {
        setValidationError(null);

        if (mode === "days") {
            const parsedDays = Number.parseInt(daysOpen, 10);
            if (!Number.isFinite(parsedDays) || parsedDays < 1) {
                setValidationError("Enter at least 1 day.");
                return;
            }

            onSave(closedDateFromDaysOpen(parsedDays));
            return;
        }

        if (!closingDate) {
            setValidationError("Choose a closing date.");
            return;
        }

        const selected = new Date(`${closingDate}T23:59:59`);
        if (selected <= new Date()) {
            setValidationError("Closing date must be in the future.");
            return;
        }

        onSave(toApiClosedDate(closingDate));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Set listing duration</h3>
                        <p className="mt-1 text-sm text-gray-500">{listing.title}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 transition-colors hover:text-gray-600"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mb-4 flex gap-2">
                    <button
                        type="button"
                        onClick={() => setMode("days")}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${mode === "days" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"}`}
                    >
                        Days open
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("date")}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${mode === "date" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"}`}
                    >
                        Closing date
                    </button>
                </div>

                {mode === "days" ? (
                    <div className="mb-4">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            How many days should this listing stay open?
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={daysOpen}
                            onChange={(e) => setDaysOpen(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                ) : (
                    <div className="mb-4">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            When should this listing close?
                        </label>
                        <input
                            type="date"
                            min={minDateValue}
                            value={closingDate}
                            onChange={(e) => setClosingDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                )}

                {(validationError || error) && (
                    <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {validationError ?? error}
                    </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                    {listing.status === "Active" ? (
                        <button
                            type="button"
                            onClick={onCloseListing}
                            disabled={isSaving}
                            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
                        >
                            Close listing now
                        </button>
                    ) : (
                        <span className="text-sm text-gray-500">Reopen with your chosen duration.</span>
                    )}

                    <div className="ml-auto flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                        >
                            {isSaving ? "Saving..." : listing.status === "Expire" ? "Reopen listing" : "Save duration"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
