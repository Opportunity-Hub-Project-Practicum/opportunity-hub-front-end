import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

interface AddColumnModalProps {
    isOpen: boolean
    title: string
    initialValue?: string
    onConfirm: (name: string) => void
    onClose: () => void
}

export default function AddColumnModal({
    isOpen,
    title,
    initialValue = "",
    onConfirm,
    onClose,
}: AddColumnModalProps) {
    const [value, setValue] = useState(initialValue)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue)
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [isOpen, initialValue])

    if (!isOpen) return null

    function handleConfirm() {
        const trimmed = value.trim()
        if (!trimmed) return
        onConfirm(trimmed)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-black/40 fixed inset-0" onClick={onClose} />
            <div className="relative z-10 bg-white rounded-xl border border-gray-200 shadow-lg p-6 w-80">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleConfirm()
                        if (e.key === "Escape") onClose()
                    }}
                    placeholder="Column name"
                    maxLength={30}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary mb-4 bg-gray-50"
                />

                {/* Footer */}
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!value.trim()}
                        className="text-sm px-4 py-2 rounded-lg bg-primary text-white hover:bg-primaryDark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}
