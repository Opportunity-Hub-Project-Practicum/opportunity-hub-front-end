import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import ApplicationForm from "../Components/ApplicationForm"
import KanbanBoardColumn from "../Components/card/KanbanColumn"
import AddColumnModal from "../Components/card/AddColumnModal"
import { ROUTES } from "../../../routes/path"
import { formatApiError } from "../../../services/apiClient"
import {
    applyDropUpdateToApplication,
    buildCardsByColumn,
    buildDropUpdate,
    buildKanbanColumns,
    isSameColumnPlacement,
    moveCardBetweenColumns,
} from "../lib/employerApplicationMappers"
import {
    fetchEmployerPostApplications,
    updateEmployerApplicationStatus,
} from "../services/employerApplicationService"
import {
    createManagementColumn,
    deleteManagementColumn,
    fetchManagementColumns,
    updateManagementColumn,
} from "../services/managementColumnService"
import { fetchEmployerPosts } from "../services/employerPostService"
import type { KanbanApplication, KanbanColumn } from "../types/employerApplication"

export default function MyJobViewApplicationPage() {
    const navigate = useNavigate()
    const { postId } = useParams<{ postId: string }>()
    const [postTitle, setPostTitle] = useState<string>("")
    const [columns, setColumns] = useState<KanbanColumn[]>([])
    const [selectedApplication, setSelectedApplication] = useState<KanbanApplication | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingColumn, setEditingColumn] = useState<KanbanColumn | null>(null)
    const [dragCardId, setDragCardId] = useState<string | null>(null)
    const [dragSrcColId, setDragSrcColId] = useState<string | null>(null)
    const [cardsByColumn, setCardsByColumn] = useState<Record<string, KanbanApplication[]>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusError, setStatusError] = useState<string | null>(null)
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

    const loadBoard = useCallback(async () => {
        if (!postId) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            const [applications, managementColumns, posts] = await Promise.all([
                fetchEmployerPostApplications(postId),
                fetchManagementColumns(),
                fetchEmployerPosts(),
            ])

            const post = posts.find((item) => String(item.post_id) === String(postId))
            setPostTitle(post?.post_title ?? `Post #${postId}`)
            setColumns(buildKanbanColumns(managementColumns))
            setCardsByColumn(buildCardsByColumn(applications, managementColumns))
        } catch (loadError) {
            setError(formatApiError(loadError))
            setColumns([])
            setCardsByColumn({})
        } finally {
            setLoading(false)
        }
    }, [postId])

    useEffect(() => {
        if (!postId) {
            navigate(`${ROUTES.EMPLOYER.ROOT}/${ROUTES.EMPLOYER.MY_JOBS}`, { replace: true })
            return
        }

        void loadBoard()
    }, [loadBoard, navigate, postId])

    async function handleAddColumn(name: string) {
        setStatusError(null)

        try {
            await createManagementColumn(name)
            await loadBoard()
        } catch (createError) {
            setStatusError(formatApiError(createError))
        }
    }

    async function handleRenameColumn(column: KanbanColumn, name: string) {
        if (!column.columnId) {
            return
        }

        setStatusError(null)

        try {
            await updateManagementColumn(column.columnId, name)
            await loadBoard()
        } catch (renameError) {
            setStatusError(formatApiError(renameError))
        }
    }

    async function handleDeleteColumn(column: KanbanColumn) {
        if (!column.columnId) {
            return
        }

        setStatusError(null)

        try {
            await deleteManagementColumn(column.columnId)
            await loadBoard()
        } catch (deleteError) {
            setStatusError(formatApiError(deleteError))
        }
    }

    function handleDragStart(cardId: string, srcColId: string) {
        setDragCardId(cardId)
        setDragSrcColId(srcColId)
    }

    async function handleDrop(targetColId: string) {
        if (!postId || !dragCardId || !dragSrcColId || dragSrcColId === targetColId) {
            return
        }

        const dropUpdate = buildDropUpdate(targetColId)
        if (!dropUpdate) {
            return
        }

        const sourceCards = cardsByColumn[dragSrcColId] ?? []
        const card = sourceCards.find((item) => item.id === dragCardId)
        if (!card || isSameColumnPlacement(card.raw, targetColId)) {
            setDragCardId(null)
            setDragSrcColId(null)
            return
        }

        const previousCardsByColumn = cardsByColumn
        const updatedApplication = applyDropUpdateToApplication(card.raw, dropUpdate)

        setCardsByColumn((prev) => moveCardBetweenColumns(
            prev,
            dragCardId,
            dragSrcColId,
            targetColId,
            updatedApplication,
        ))
        setDragCardId(null)
        setDragSrcColId(null)
        setStatusError(null)
        setIsUpdatingStatus(true)

        try {
            await updateEmployerApplicationStatus(postId, card.applicationId, dropUpdate)
        } catch (updateError) {
            setCardsByColumn(previousCardsByColumn)
            setStatusError(formatApiError(updateError))
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    const isView = selectedApplication !== null

    return (
        <div className="p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <Link
                        to={`${ROUTES.EMPLOYER.ROOT}/${ROUTES.EMPLOYER.MY_JOBS}`}
                        className="text-sm text-[#0A65CC] hover:underline"
                    >
                        Back to My Jobs
                    </Link>
                    <h1 className="mt-1 text-lg font-medium text-gray-800">
                        Applications{postTitle ? ` — ${postTitle}` : ""}
                    </h1>
                </div>

                <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
                >
                    <span className="text-base leading-none">+</span>
                    Add column
                </button>
            </div>

            {loading && (
                <div className="py-10 text-sm text-[#767F8C]">Loading applications...</div>
            )}

            {!loading && error && (
                <div className="py-10 text-sm text-red-600">{error}</div>
            )}

            {!loading && !error && (
                <>
                    {statusError && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {statusError}
                        </div>
                    )}

                    {isUpdatingStatus && (
                        <div className="mb-4 text-sm text-[#767F8C]">Updating application status...</div>
                    )}

                    <div className="flex items-start gap-4 overflow-x-auto pb-4">
                        {columns.map((col) => (
                            <KanbanBoardColumn
                                key={col.id}
                                column={col}
                                cards={cardsByColumn[col.id] ?? []}
                                onViewCv={(applicationId) => {
                                    const card = Object.values(cardsByColumn)
                                        .flat()
                                        .find((item) => item.id === applicationId)
                                    setSelectedApplication(card ?? null)
                                }}
                                onEdit={(column) => setEditingColumn(column)}
                                onDelete={(columnId) => {
                                    const column = columns.find((item) => item.id === columnId)
                                    if (column) {
                                        void handleDeleteColumn(column)
                                    }
                                }}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                draggingCardId={dragCardId}
                            />
                        ))}
                    </div>
                </>
            )}

            {isView && postId && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/40"
                            onClick={() => setSelectedApplication(null)}
                        />
                        <div className="relative z-10 mx-auto w-full max-w-4xl">
                            <ApplicationForm
                                isOpen={isView}
                                application={selectedApplication}
                                postId={postId}
                                onClose={() => setSelectedApplication(null)}
                                onStatusUpdated={loadBoard}
                            />
                        </div>
                    </div>
                </div>
            )}

            <AddColumnModal
                isOpen={isAddModalOpen}
                title="Add column"
                initialValue=""
                onConfirm={(name) => {
                    void handleAddColumn(name)
                    setIsAddModalOpen(false)
                }}
                onClose={() => setIsAddModalOpen(false)}
            />

            <AddColumnModal
                isOpen={editingColumn !== null}
                title="Rename column"
                initialValue={editingColumn?.name ?? ""}
                onConfirm={(name) => {
                    if (editingColumn) {
                        void handleRenameColumn(editingColumn, name)
                    }
                    setEditingColumn(null)
                }}
                onClose={() => setEditingColumn(null)}
            />
        </div>
    )
}
