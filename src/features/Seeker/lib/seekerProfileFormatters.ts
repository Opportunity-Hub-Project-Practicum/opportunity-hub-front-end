export function formatDisplayDate(value: string | null | undefined): string {
    if (!value) {
        return "Not provided";
    }

    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatLabel(value: string | null | undefined): string {
    if (!value) {
        return "Not provided";
    }

    return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
