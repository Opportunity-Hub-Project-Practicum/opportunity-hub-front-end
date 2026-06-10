import type {
    EmployerApplicationApi,
    KanbanApplication,
    KanbanColumn,
    UpdateEmployerApplicationStatusPayload,
} from "../types/employerApplication";
import type { ManagementColumnApi } from "../types/managementColumn";
import { resolveAssetUrl } from "./resolveAssetUrl";

export const FIXED_KANBAN_COLUMNS: KanbanColumn[] = [
    { id: "col-all", name: "All applications", fixed: true },
    { id: "col-reject", name: "Reject", fixed: true },
    { id: "col-hire", name: "Hire", fixed: true },
];

export function customColumnKey(columnId: number): string {
    return `col-custom-${columnId}`;
}

export function parseCustomColumnId(columnKey: string): number | null {
    if (!columnKey.startsWith("col-custom-")) {
        return null;
    }

    const columnId = Number(columnKey.replace("col-custom-", ""));
    return Number.isNaN(columnId) ? null : columnId;
}

export function mapManagementColumnsToKanban(columns: ManagementColumnApi[]): KanbanColumn[] {
    return columns.map((column) => ({
        id: customColumnKey(column.column_id),
        name: column.column_name,
        fixed: false,
        columnId: column.column_id,
    }));
}

export function buildKanbanColumns(customColumns: ManagementColumnApi[]): KanbanColumn[] {
    return [...FIXED_KANBAN_COLUMNS, ...mapManagementColumnsToKanban(customColumns)];
}

function formatAppliedDate(isoDate: string | null): string {
    if (!isoDate) {
        return "";
    }

    return new Date(isoDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function mapEmployerApplicationToKanbanCard(
    application: EmployerApplicationApi,
): KanbanApplication {
    return {
        id: application.uuid,
        applicationId: application.application_id,
        userName: application.seeker_name?.trim() || "Unknown applicant",
        role: "Applicant",
        appliedDate: formatAppliedDate(application.submission_date),
        url_Cv: resolveAssetUrl(application.cv_resume_file),
        status: application.status,
        seekerId: application.seeker_id,
        seekerUuid: application.seeker_uuid,
        seekerEmail: application.seeker_email,
        raw: application,
    };
}

export function kanbanColumnForApplication(application: EmployerApplicationApi): string {
    if (application.status === "rejected") {
        return "col-reject";
    }

    if (application.status === "hired") {
        return "col-hire";
    }

    if (application.current_column_id) {
        return customColumnKey(application.current_column_id);
    }

    return "col-all";
}

export function buildCardsByColumn(
    applications: EmployerApplicationApi[],
    customColumns: ManagementColumnApi[],
): Record<string, KanbanApplication[]> {
    const cardsByColumn: Record<string, KanbanApplication[]> = {
        "col-all": [],
        "col-reject": [],
        "col-hire": [],
    };

    for (const column of customColumns) {
        cardsByColumn[customColumnKey(column.column_id)] = [];
    }

    for (const application of applications) {
        const card = mapEmployerApplicationToKanbanCard(application);
        const columnKey = kanbanColumnForApplication(application);

        if (!cardsByColumn[columnKey]) {
            cardsByColumn["col-all"].push(card);
            continue;
        }

        cardsByColumn[columnKey].push(card);
    }

    return cardsByColumn;
}

export function buildDropUpdate(
    targetColumnId: string,
): UpdateEmployerApplicationStatusPayload | null {
    switch (targetColumnId) {
        case "col-all":
            return { status: "pending", current_column_id: null };
        case "col-reject":
            return { status: "rejected", current_column_id: null };
        case "col-hire":
            return { status: "hired", current_column_id: null };
        default: {
            const customColumnId = parseCustomColumnId(targetColumnId);
            if (customColumnId === null) {
                return null;
            }

            return {
                status: "pending",
                current_column_id: customColumnId,
            };
        }
    }
}

export function applyDropUpdateToApplication(
    application: EmployerApplicationApi,
    update: UpdateEmployerApplicationStatusPayload,
): EmployerApplicationApi {
    return {
        ...application,
        status: update.status,
        current_column_id: update.current_column_id ?? null,
    };
}

export function moveCardBetweenColumns(
    cardsByColumn: Record<string, KanbanApplication[]>,
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    updatedApplication: EmployerApplicationApi,
): Record<string, KanbanApplication[]> {
    const sourceCards = cardsByColumn[sourceColumnId] ?? [];
    const card = sourceCards.find((item) => item.id === cardId);

    if (!card) {
        return cardsByColumn;
    }

    const updatedCard = mapEmployerApplicationToKanbanCard(updatedApplication);

    return {
        ...cardsByColumn,
        [sourceColumnId]: sourceCards.filter((item) => item.id !== cardId),
        [targetColumnId]: [
            ...(cardsByColumn[targetColumnId] ?? []).filter((item) => item.id !== cardId),
            updatedCard,
        ],
    };
}

export function isSameColumnPlacement(
    application: EmployerApplicationApi,
    targetColumnId: string,
): boolean {
    return kanbanColumnForApplication(application) === targetColumnId;
}
