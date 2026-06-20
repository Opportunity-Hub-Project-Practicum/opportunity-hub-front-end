import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import SearchBox from "../../../GlobalComponents/SearchBox";
import EmptyState from "../../../GlobalComponents/EmptyState";
import { Skeleton } from "../../../GlobalComponents/Skeleton";
import { formatApiError } from "../../../services/apiClient";
import {
    createAdminJobRole,
    deleteAdminJobRole,
    fetchAdminJobRoles,
    updateAdminJobRole,
} from "../services/adminJobRoleService";
import {
    createAdminLocation,
    deleteAdminLocation,
    fetchAdminLocations,
    updateAdminLocation,
} from "../services/adminLocationService";
import type {
    AdminJobRoleApi,
    AdminLocationApi,
    ManageValueFilter,
} from "../types/adminValue";

type ValueItem = AdminLocationApi | AdminJobRoleApi;

type FormMode = "create" | "edit";

function formatCreatedDate(value: string | null | undefined): string {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function matchesSearch(name: string, query: string): boolean {
    return name.toLowerCase().includes(query.trim().toLowerCase());
}

function getItemId(item: ValueItem, filter: ManageValueFilter): number {
    return filter === "location"
        ? (item as AdminLocationApi).location_id
        : (item as AdminJobRoleApi).job_role_id;
}

export default function ManageValuesPage() {
    const [valueFilter, setValueFilter] = useState<ManageValueFilter>("location");
    const [search, setSearch] = useState("");
    const [locations, setLocations] = useState<AdminLocationApi[]>([]);
    const [jobRoles, setJobRoles] = useState<AdminJobRoleApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formMode, setFormMode] = useState<FormMode | null>(null);
    const [editingItem, setEditingItem] = useState<ValueItem | null>(null);
    const [formName, setFormName] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<ValueItem | null>(null);
    const [deleteSubmitting, setDeleteSubmitting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const loadValues = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (valueFilter === "location") {
                const data = await fetchAdminLocations();
                setLocations(data);
            } else {
                const data = await fetchAdminJobRoles();
                setJobRoles(data);
            }
        } catch (loadError) {
            setError(formatApiError(loadError));
        } finally {
            setLoading(false);
        }
    }, [valueFilter]);

    useEffect(() => {
        loadValues();
    }, [loadValues]);

    const currentItems = useMemo(() => {
        const items = valueFilter === "location" ? locations : jobRoles;

        if (!search.trim()) {
            return items;
        }

        return items.filter((item) => matchesSearch(item.name, search));
    }, [jobRoles, locations, search, valueFilter]);

    const listLabel = valueFilter === "location" ? "Location" : "Category";
    const emptyLabel = valueFilter === "location" ? "locations" : "categories";

    const openCreateModal = () => {
        setFormMode("create");
        setEditingItem(null);
        setFormName("");
        setFormError(null);
    };

    const openEditModal = (item: ValueItem) => {
        setFormMode("edit");
        setEditingItem(item);
        setFormName(item.name);
        setFormError(null);
    };

    const closeFormModal = () => {
        setFormMode(null);
        setEditingItem(null);
        setFormName("");
        setFormError(null);
    };

    const openDeleteModal = (item: ValueItem) => {
        setDeleteTarget(item);
        setDeleteError(null);
    };

    const closeDeleteModal = () => {
        setDeleteTarget(null);
        setDeleteError(null);
    };

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const trimmedName = formName.trim();
        if (!trimmedName) {
            setFormError("Name is required.");
            return;
        }

        setFormSubmitting(true);
        setFormError(null);

        try {
            if (valueFilter === "location") {
                if (formMode === "create") {
                    await createAdminLocation(trimmedName);
                } else if (editingItem) {
                    await updateAdminLocation(
                        (editingItem as AdminLocationApi).location_id,
                        trimmedName,
                    );
                }
            } else if (formMode === "create") {
                await createAdminJobRole(trimmedName);
            } else if (editingItem) {
                await updateAdminJobRole(
                    (editingItem as AdminJobRoleApi).job_role_id,
                    trimmedName,
                );
            }

            closeFormModal();
            await loadValues();
        } catch (submitError) {
            setFormError(formatApiError(submitError));
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) {
            return;
        }

        setDeleteSubmitting(true);
        setDeleteError(null);

        try {
            if (valueFilter === "location") {
                await deleteAdminLocation((deleteTarget as AdminLocationApi).location_id);
            } else {
                await deleteAdminJobRole((deleteTarget as AdminJobRoleApi).job_role_id);
            }

            closeDeleteModal();
            await loadValues();
        } catch (submitError) {
            setDeleteError(formatApiError(submitError));
        } finally {
            setDeleteSubmitting(false);
        }
    };

    return (
        <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-semibold text-[#18191C]">Manage Values</h1>

            </div>

            <SearchBox search={search} setSearch={setSearch} />

            <div className="mb-5 flex justify-end gap-5">
                <select
                    id="value-filter"
                    value={valueFilter}
                    onChange={(event) => {
                        setValueFilter(event.target.value as ManageValueFilter);
                        setSearch("");
                    }}
                    className="w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary"
                >
                    <option value="location">Location</option>
                    <option value="category">Category (Job Role)</option>
                </select>
                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primaryDark"
                >
                    <Plus className="h-4 w-4" />
                    Add {listLabel}
                </button>
            </div>

            <div className="hidden md:grid grid-cols-4 bg-[#F1F2F4] px-6 py-3 text-[12px] font-medium tracking-wider text-[#474C54] uppercase items-center">
                <div className="col-span-2">Name</div>
                <div>Created</div>
                <div className="text-left pl-4">Actions</div>
            </div>

            {loading && (
                <div className="space-y-3 py-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="m-4 alert-error">{error}</div>
            )}

            {!loading && !error && currentItems.length === 0 && (
                <EmptyState icon={Tags} title={`No ${emptyLabel} found`} description="Try a different search term." />
            )}

            <div className="w-full divide-y divide-[#E4E5E8]">
                {!loading && !error && currentItems.map((item) => (
                    <div
                        key={getItemId(item, valueFilter)}
                        className="grid grid-cols-1 gap-2 md:grid-cols-4 px-6 py-5 md:items-center hover:bg-gray-50/40 transition-colors"
                    >
                        <div className="col-span-1 md:col-span-2">
                            <h2 className="text-base font-medium text-[#18191C]">{item.name}</h2>
                        </div>

                        <div className="text-sm text-[#767F8C]">
                            {formatCreatedDate(item.created_at)}
                        </div>

                        <div className="flex items-center gap-2 md:pl-4">
                            <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                className="inline-flex items-center gap-1.5 rounded-sm bg-subPrimary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-subPrimary/70"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => openDeleteModal(item)}
                                className="inline-flex items-center gap-1.5 rounded-sm bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {formMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                        <button
                            type="button"
                            onClick={closeFormModal}
                            className="absolute right-4 top-4 rounded-full bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                        >
                            ✕
                        </button>

                        <h2 className="mb-4 text-lg font-semibold text-[#18191C]">
                            {formMode === "create" ? `Add ${listLabel}` : `Edit ${listLabel}`}
                        </h2>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="value-name"
                                    className="mb-1.5 block text-sm font-medium text-[#474C54]"
                                >
                                    Name
                                </label>
                                <input
                                    id="value-name"
                                    type="text"
                                    value={formName}
                                    onChange={(event) => setFormName(event.target.value)}
                                    maxLength={150}
                                    placeholder={`Enter ${listLabel.toLowerCase()} name`}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary"
                                />
                            </div>

                            {formError && (
                                <p className="text-sm text-red-600">{formError}</p>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeFormModal}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formSubmitting}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primaryDark disabled:opacity-60"
                                >
                                    {formSubmitting ? "Saving..." : formMode === "create" ? "Create" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                        <h2 className="mb-2 text-lg font-semibold text-[#18191C]">Delete {listLabel}</h2>
                        <p className="mb-4 text-sm text-[#5E6670]">
                            Are you sure you want to delete &quot;{deleteTarget.name}&quot;? Posts using
                            this value will have it cleared.
                        </p>

                        {deleteError && (
                            <p className="mb-4 text-sm text-red-600">{deleteError}</p>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                disabled={deleteSubmitting}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {deleteSubmitting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
