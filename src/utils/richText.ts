const RICH_FORMATTING_TAG_PATTERN = /<(strong|b|em|i|u|s|strike|a|ul|ol|li)\b/i;

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

function decodeHtmlEntities(text: string): string {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/gi, " ");
}

function plainTextFromSimpleHtml(html: string): string {
    const withNewlines = html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
        .replace(/<\/?p[^>]*>/gi, "");

    return decodeHtmlEntities(withNewlines).trim();
}

export function normalizeRichTextForStorage(value: string | null | undefined): string {
    const trimmed = value?.trim() ?? "";
    if (!trimmed || isEmptyRichText(trimmed)) {
        return "";
    }

    if (RICH_FORMATTING_TAG_PATTERN.test(trimmed)) {
        return trimmed;
    }

    return plainTextFromSimpleHtml(trimmed);
}
