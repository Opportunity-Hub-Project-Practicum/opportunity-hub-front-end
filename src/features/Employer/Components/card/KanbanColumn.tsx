import { useState } from "react"
import { ArrowRight, Download, Edit2, Trash2 } from "lucide-react"
import type { KanbanApplication, KanbanColumn as Column } from "../../types/employerApplication"

interface KanbanColumnProps {
    column: Column
    cards: KanbanApplication[]
    draggingCardId: string | null
    onViewCv: (applicationId: string) => void
    onViewSeekerProfile: (seekerId: number) => void
    onEdit: (column: Column) => void
    onDelete: (colId: string) => void
    onDragStart: (cardId: string, srcColId: string) => void
    onDrop: (targetColId: string) => void
}

const AVATAR_COLORS = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-violet-100 text-violet-700",
]

const COL_DOTS: Record<string, string> = {
    "col-all": "bg-blue-500",
    "col-reject": "bg-red-400",
    "col-hire": "bg-emerald-500",
}

function initials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
}

function ConfirmDeleteDialog({
    cardCount,
    colName,
    onConfirm,
    onCancel,
}: {
    cardCount: number
    colName: string
    onConfirm: () => void
    onCancel: () => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-black/40 fixed inset-0" onClick={onCancel} />
            <div className="relative z-10 bg-white rounded-xl border border-gray-200 shadow-lg p-6 w-80">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Delete "{colName}"?</h3>
                <p className="text-sm text-gray-500 mb-5">
                    {cardCount > 0
                        ? `${cardCount} card(s) will be moved to "All applications".`
                        : "This column is empty and will be removed."}
                </p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onCancel}
                        className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="text-sm px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function KanbanColumn({
    column,
    cards,
    draggingCardId,
    onViewCv,
    onViewSeekerProfile,
    onEdit,
    onDelete,
    onDragStart,
    onDrop,
}: KanbanColumnProps) {
    const [isDragOver, setIsDragOver] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const dotColor = COL_DOTS[column.id] ?? "bg-gray-400"

    return (
        <>
            <div
                className={`flex w-56 min-w-56 flex-col rounded-xl border bg-[#F8F9FA] transition-colors ${isDragOver ? "border-primary/40 bg-blue-50" : "border-[#E4E5E8]"
                    }`}
                onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={() => {
                    setIsDragOver(false)
                    onDrop(column.id)
                }}
                data-col-id={column.id}
            >
                {/* Column header */}
                <div className="flex items-center gap-2 border-b border-[#E4E5E8] px-3 py-3">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
                    <span className="flex-1 truncate text-sm font-semibold text-[#18191C]">
                        {column.name}
                    </span>
                    <span className="rounded-full border border-[#E4E5E8] bg-white px-2 py-0.5 text-xs font-medium text-[#767F8C]">
                        {cards.length}
                    </span>
                    {column.fixed && (
                        <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-1.5 py-0.5">
                            fixed
                        </span>
                    )}
                    {!column.fixed && (
                        <div className="flex gap-1">
                            <button
                                onClick={() => onEdit(column)}
                                className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors"
                                title="Rename column"
                                aria-label="Rename column"
                            >
                                <Edit2 size={13} />
                            </button>
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors"
                                title="Delete column"
                                aria-label="Delete column"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 p-2 min-h-16 flex-1">
                    {cards.map((app, i) => (
                        <div
                            key={app.id}
                            draggable
                            onDragStart={() => onDragStart(app.id, column.id)}
                            className={`cursor-grab rounded-xl border border-[#E4E5E8] bg-white p-3 shadow-sm transition-all active:cursor-grabbing ${draggingCardId === app.id ? "opacity-40" : "opacity-100 hover:border-primary/20 hover:shadow-md"
                                }`}
                        >
                            {/* Avatar + name */}
                            <div className="mb-2.5 flex items-center gap-2.5">
                                {app.image ? (
                                    <img
                                        className="h-9 w-9 shrink-0 rounded-full border border-gray-100 object-cover ring-1 ring-gray-100"
                                        src={app.image}
                                        alt={app.userName}
                                    />
                                ) : (
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${AVATAR_COLORS[i % AVATAR_COLORS.length]
                                            }`}
                                    >
                                        {initials(app.userName)}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <button
                                        type="button"
                                        onClick={() => onViewSeekerProfile(app.seekerId)}
                                        className="truncate text-left text-sm font-medium text-[#0A65CC] hover:underline"
                                    >
                                        {app.userName}
                                    </button>
                                    <p className="truncate text-xs text-[#767F8C]">{app.role}</p>
                                </div>
                            </div>

                            <hr className="mb-2.5 border-gray-100" />

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => onViewCv(app.id)}
                                    type="button"
                                    className="flex w-fit items-center gap-1.5 text-xs text-[#5E6670] transition-colors hover:text-primary"
                                >
                                    <ArrowRight size={14} />
                                    View Application
                                </button>
                                <span className="text-xs text-[#767F8C]">
                                    Applied: {app.appliedDate}
                                </span>
                                <a
                                    href={app.url_Cv}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex w-fit items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primaryDark"
                                >
                                    <Download size={14} />
                                    Download CV
                                </a>
                            </div>
                        </div>
                    ))}

                    {cards.length === 0 && (
                        <p className="text-[11px] text-gray-400 text-center py-3">
                            No applications
                        </p>
                    )}
                </div>
            </div>

            {confirmDelete && (
                <ConfirmDeleteDialog
                    cardCount={cards.length}
                    colName={column.name}
                    onConfirm={() => {
                        setConfirmDelete(false)
                        onDelete(column.id)
                    }}
                    onCancel={() => setConfirmDelete(false)}
                />
            )}
        </>
    )
}
