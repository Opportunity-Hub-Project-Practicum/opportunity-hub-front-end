import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { isEmptyRichText } from "../utils/richText";

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Link2,
    List,
    ListOrdered,
} from "lucide-react";

interface TextAreaBoxProps {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

const TextAreaBox: React.FC<TextAreaBoxProps> = ({
    value,
    onChange,
    readOnly = false,
}) => {

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                link: false,
                underline: false,
            }),
            Underline,
            Link.configure({
                openOnClick: false,
            }),
        ],

        content: value,
        editable: !readOnly,

        editorProps: {
            attributes: {
                class: "outline-none focus:outline-none border-0 focus:border-0 ring-0 focus:ring-0 shadow-none p-3 min-h-35 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
            },
        },

        onUpdate: ({ editor }) => {
            if (!readOnly) {
                const html = editor.getHTML();
                onChange(isEmptyRichText(html) ? "" : html);
            }
        },
    });

    useEffect(() => {
        if (editor) {
            editor.setEditable(!readOnly);
        }
    }, [editor, readOnly]);

    useEffect(() => {
        if (!editor) return;

        const currentHtml = editor.getHTML();
        if (value !== currentHtml) {
            editor.commands.setContent(value || "");
        }
    }, [editor, value]);

    if (!editor) return null;

    return (
        <div className="flex flex-col gap-1 md:col-span-2 mt-1">


            <div className="border border-gray-200 rounded-lg overflow-hidden">

                {/* Toolbar */}
                {!readOnly && (
                    <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50">

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-1.5 rounded ${editor.isActive("bold") ? "bg-gray-300" : "hover:bg-gray-200"}`}
                        >
                            <Bold size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`p-1.5 rounded ${editor.isActive("italic") ? "bg-gray-300" : "hover:bg-gray-200"}`}
                        >
                            <Italic size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={`p-1.5 rounded ${editor.isActive("underline") ? "bg-gray-300" : "hover:bg-gray-200"}`}
                        >
                            <UnderlineIcon size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={`p-1.5 rounded ${editor.isActive("strike") ? "bg-gray-300" : "hover:bg-gray-200"}`}
                        >
                            <Strikethrough size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`p-1.5 rounded ${editor.isActive("bulletList") ? "bg-gray-300" : "hover:bg-gray-200"}`}
                        >
                            <List size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`p-1.5 rounded ${editor.isActive("orderedList") ? "bg-gray-300" : "hover:bg-gray-200"}`}
                        >
                            <ListOrdered size={14} />
                        </button>

                        <div className="w-px h-4 bg-gray-300 mx-1" />

                        <button
                            type="button"
                            onClick={() => {
                                const url = prompt("Enter URL");
                                if (url) {
                                    editor.chain().focus().setLink({ href: url }).run();
                                }
                            }}
                            className="p-1.5 rounded hover:bg-gray-200"
                        >
                            <Link2 size={14} />
                        </button>

                    </div>
                )}

                {/* Editor (IMPORTANT FIX HERE) */}
                <EditorContent
                    editor={editor}
                    className={`border-0 outline-none focus:outline-none ${readOnly ? "bg-gray-50" : ""}`}
                />

            </div>
        </div>
    );
};

export default TextAreaBox;