export function isEmptyRichText(value: string | null | undefined): boolean {
    if (!value?.trim()) {
        return true;
    }

    const textOnly = value
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .trim();

    return textOnly.length === 0;
}
