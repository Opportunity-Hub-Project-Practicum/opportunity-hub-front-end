import type {
    AlertItemApi,
    AlertItemType,
    AlertItemsFormState,
    SyncAlertItemPayload,
} from "../types/alertItem";

function uniqueNonEmpty(values: Array<string | null | undefined>): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const value of values) {
        const trimmed = value?.trim();
        if (!trimmed || seen.has(trimmed)) {
            continue;
        }

        seen.add(trimmed);
        result.push(trimmed);
    }

    return result;
}

function extractSelections(
    alertItems: AlertItemApi[],
    type: AlertItemType,
): AlertItemsFormState["job"] {
    const filtered = alertItems.filter((item) => item.type === type);

    return {
        categories: uniqueNonEmpty(filtered.map((item) => item.role_name)),
        locations: uniqueNonEmpty(filtered.map((item) => item.location)),
    };
}

export function alertItemsToFormState(alertItems: AlertItemApi[]): AlertItemsFormState {
    return {
        job: extractSelections(alertItems, "job"),
        volunteer: extractSelections(alertItems, "volunteer"),
    };
}

/** Number of saved alert_items rows for a given type (job or volunteer). */
export function countAlertItemsByType(alertItems: AlertItemApi[], type: AlertItemType): number {
    return alertItems.filter((item) => item.type === type).length;
}

function buildAlertItemsForType(
    type: AlertItemType,
    selection: AlertItemsFormState["job"],
): SyncAlertItemPayload[] {
    const categories = uniqueNonEmpty(selection.categories);
    const locations = uniqueNonEmpty(selection.locations);

    if (categories.length === 0 && locations.length === 0) {
        return [];
    }

    if (categories.length > 0 && locations.length > 0) {
        const items: SyncAlertItemPayload[] = [];

        for (const category of categories) {
            for (const location of locations) {
                items.push({
                    type,
                    role_name: category,
                    location,
                });
            }
        }

        return items;
    }

    if (categories.length > 0) {
        return categories.map((category) => ({
            type,
            role_name: category,
            location: null,
        }));
    }

    return locations.map((location) => ({
        type,
        role_name: null,
        location,
    }));
}

function dedupeAlertItems(items: SyncAlertItemPayload[]): SyncAlertItemPayload[] {
    const seen = new Set<string>();

    return items.filter((item) => {
        const key = [
            item.type,
            item.role_name?.trim() ?? "",
            item.location?.trim() ?? "",
        ].join("|");

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

export function formStateToAlertItems(formState: AlertItemsFormState): SyncAlertItemPayload[] {
    return dedupeAlertItems([
        ...buildAlertItemsForType("job", formState.job),
        ...buildAlertItemsForType("volunteer", formState.volunteer),
    ]);
}
