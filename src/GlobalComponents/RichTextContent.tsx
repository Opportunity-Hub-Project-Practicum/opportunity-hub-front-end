import { isEmptyRichText } from "../utils/richText";

type RichTextContentProps = {
    value: string | null | undefined;
    className?: string;
    emptyText?: string;
};

export default function RichTextContent({
    value,
    className = "",
    emptyText = "—",
}: RichTextContentProps) {
    if (isEmptyRichText(value)) {
        return <span className={className}>{emptyText}</span>;
    }

    return (
        <div
            className={`rich-text-content [&_p]:mb-2 last:[&_p]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 ${className}`}
            dangerouslySetInnerHTML={{ __html: value! }}
        />
    );
}
