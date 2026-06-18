import type { AlertItemType } from "../types/alertItem";

export function getAlertPageEmptyMessage(type: AlertItemType, alertItemCount: number): string {
    if (alertItemCount === 0) {
        return type === "job"
            ? "No job alerts saved yet. Select categories and locations on the Account settings tab to see matching posts here."
            : "No volunteer alerts saved yet. Select categories and locations on the Account settings tab to see matching posts here.";
    }

    return type === "job"
        ? "No job posts match your saved alerts right now. Check back later or add more categories and locations in Account settings."
        : "No volunteer posts match your saved alerts right now. Check back later or add more categories and locations in Account settings.";
}
