import { useState } from "react"
import ApplicationForm from "../Components/ApplicationForm"
import KanbanColumn from "../Components/card/KanbanColumn"
import AddColumnModal from "../Components/card/AddColumnModal"

export type Application = {
    id: string
    userName: string
    role: string
    appliedDate: string
    url_Cv: string
    image?: string
}

export type Column = {
    id: string
    name: string
    fixed: boolean
}

export default function MyJobViewApplicationPage() {
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingColumn, setEditingColumn] = useState<Column | null>(null)
    const [dragCardId, setDragCardId] = useState<string | null>(null)
    const [dragSrcColId, setDragSrcColId] = useState<string | null>(null)

    const [columns, setColumns] = useState<Column[]>([
        { id: "col-all", name: "All applications", fixed: true },
        { id: "col-reject", name: "Reject", fixed: true },
        { id: "col-hire", name: "Hire", fixed: true },
    ])

    const [cardsByColumn, setCardsByColumn] = useState<Record<string, Application[]>>({
        "col-all": [
            {
                id: "app-001",
                userName: "Sokha Meas",
                role: "Frontend Developer",
                appliedDate: "2026-05-21",
                url_Cv: "#",
            },
            {
                id: "app-002",
                userName: "Dara Kim",
                role: "UI Designer",
                appliedDate: "2026-05-19",
                url_Cv: "#",
            },
        ],
        "col-reject": [],
        "col-hire": [],
    })

    // ── Column management ─────────────────────────────────────────────────────

    function handleAddColumn(name: string) {
        const id = `col-${Date.now()}`
        setColumns((prev) => [...prev, { id, name, fixed: false }])
        setCardsByColumn((prev) => ({ ...prev, [id]: [] }))
    }

    function handleRenameColumn(colId: string, name: string) {
        setColumns((prev) =>
            prev.map((col) => (col.id === colId ? { ...col, name } : col))
        )
    }

    function handleDeleteColumn(colId: string) {
        const cards = cardsByColumn[colId] ?? []
        setCardsByColumn((prev) => {
            const next = { ...prev }
            // Move cards to "All applications" before deleting
            next["col-all"] = [...(next["col-all"] ?? []), ...cards]
            delete next[colId]
            return next
        })
        setColumns((prev) => prev.filter((col) => col.id !== colId))
    }

    // ── Drag & drop ───────────────────────────────────────────────────────────

    function handleDragStart(cardId: string, srcColId: string) {
        setDragCardId(cardId)
        setDragSrcColId(srcColId)
    }

    function handleDrop(targetColId: string) {
        if (!dragCardId || !dragSrcColId || dragSrcColId === targetColId) return

        setCardsByColumn((prev) => {
            const srcCards = prev[dragSrcColId] ?? []
            const card = srcCards.find((c) => c.id === dragCardId)
            if (!card) return prev
            return {
                ...prev,
                [dragSrcColId]: srcCards.filter((c) => c.id !== dragCardId),
                [targetColId]: [...(prev[targetColId] ?? []), card],
            }
        })

        setDragCardId(null)
        setDragSrcColId(null)
    }

    const isView = selectedApplicationId !== null

    return (
        <div className="p-4">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-medium text-gray-800">Applications</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                    <span className="text-base leading-none">+</span>
                    Add column
                </button>
            </div>

            {/* Board */}
            <div className="flex gap-4 overflow-x-auto pb-4 items-start">
                {columns.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        column={col}
                        cards={cardsByColumn[col.id] ?? []}
                        onViewCv={(applicationId) => setSelectedApplicationId(applicationId)}
                        onEdit={(col) => setEditingColumn(col)}
                        onDelete={handleDeleteColumn}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        draggingCardId={dragCardId}
                    />
                ))}
            </div>

            {/* CV modal */}
            {isView && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="min-h-screen flex items-center justify-center p-4">
                        <div
                            className="bg-black/40 fixed inset-0"
                            onClick={() => setSelectedApplicationId(null)}
                        />
                        <div className="w-full max-w-4xl mx-auto relative z-10">
                            <ApplicationForm
                                isOpen={isView}
                                applicationId={selectedApplicationId}
                                onClose={() => setSelectedApplicationId(null)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Add column modal */}
            <AddColumnModal
                isOpen={isAddModalOpen}
                title="Add column"
                initialValue=""
                onConfirm={(name) => {
                    handleAddColumn(name)
                    setIsAddModalOpen(false)
                }}
                onClose={() => setIsAddModalOpen(false)}
            />

            {/* Rename column modal */}
            <AddColumnModal
                isOpen={editingColumn !== null}
                title="Rename column"
                initialValue={editingColumn?.name ?? ""}
                onConfirm={(name) => {
                    if (editingColumn) handleRenameColumn(editingColumn.id, name)
                    setEditingColumn(null)
                }}
                onClose={() => setEditingColumn(null)}
            />
        </div>
    )
}
