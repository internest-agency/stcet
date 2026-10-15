"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Bold,
  Code,
  Eraser,
  Eye,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Type,
  Underline,
  Undo2,
} from "lucide-react";
import { sanitizeHtml } from "@/src/lib/content/html";

type EditorMode = "visual" | "html" | "preview";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  minHeight?: number;
  /** When provided, a hidden input serializes the value for plain form posts. */
  name?: string;
}

const TOOLBAR = "flex flex-wrap items-center gap-0.5";
const TAB_BUTTON =
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors";

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-700"
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

/**
 * A dependency-free rich-text editor with three modes:
 *  - Visual: a `contentEditable` surface with a formatting toolbar.
 *  - HTML: a raw source textarea for pasting/editing markup directly.
 *  - Preview: the sanitized result exactly as the public site will render it.
 *
 * The parent owns the value; the editor never parses or stores anything on its
 * own. Switching modes is lossless because the visual surface flushes its HTML
 * into the shared value before it unmounts.
 */
export default function RichTextEditor({
  label,
  value,
  onChange,
  error,
  hint,
  required,
  minHeight = 160,
  name,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<EditorMode>("visual");
  const id = useId();

  useEffect(() => {
    if (mode !== "visual") return;
    const editor = editorRef.current;
    if (!editor) return;
    // Don't clobber the caret or selection while the editor has focus.
    if (document.activeElement === editor) return;
    if (editor.innerHTML !== value) {
      editor.innerHTML = value;
    }
  }, [value, mode]);

  const syncFromEditor = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    onChange(editor.innerHTML);
  }, [onChange]);

  const exec = useCallback(
    (command: string, argument?: string) => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.focus();
      document.execCommand(command, false, argument);
      syncFromEditor();
    },
    [syncFromEditor],
  );

  const createLink = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const url = window.prompt("Enter the link URL", "https://");
    if (!url || !url.trim()) return;
    document.execCommand("createLink", false, url.trim());
    syncFromEditor();
  }, [syncFromEditor]);

  const switchMode = useCallback(
    (next: EditorMode) => {
      if (mode === "visual" && next !== "visual") {
        syncFromEditor();
      }
      setMode(next);
    },
    [mode, syncFromEditor],
  );

  const borderClass = error ? "border-red-400" : "border-gray-300";

  return (
    <div className="block text-sm font-semibold text-gray-700">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id}>{label}</label>
        <div className="flex items-center gap-1 rounded-md bg-gray-100 p-0.5">
          <button
            aria-pressed={mode === "visual"}
            className={`${TAB_BUTTON} ${
              mode === "visual"
                ? "bg-white text-primary-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => switchMode("visual")}
            type="button"
          >
            <Type aria-hidden className="size-3.5" /> Visual
          </button>
          <button
            aria-pressed={mode === "html"}
            className={`${TAB_BUTTON} ${
              mode === "html"
                ? "bg-white text-primary-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => switchMode("html")}
            type="button"
          >
            <Code aria-hidden className="size-3.5" /> HTML
          </button>
          <button
            aria-pressed={mode === "preview"}
            className={`${TAB_BUTTON} ${
              mode === "preview"
                ? "bg-white text-primary-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => switchMode("preview")}
            type="button"
          >
            <Eye aria-hidden className="size-3.5" /> Preview
          </button>
        </div>
      </div>

      <div
        className={`mt-1.5 overflow-hidden rounded-md border bg-white focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-100 ${borderClass}`}
      >
        {mode === "visual" ? (
          <div className={TOOLBAR + " flex-wrap gap-0.5 border-b border-gray-200 bg-gray-50 px-1.5 py-1"}>
            <ToolbarButton label="Undo" onClick={() => exec("undo")}>
              <Undo2 aria-hidden className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Redo" onClick={() => exec("redo")}>
              <Redo2 aria-hidden className="size-4" />
            </ToolbarButton>
            <span aria-hidden className="mx-1 h-5 w-px bg-gray-200" />
            <ToolbarButton
              label="Paragraph"
              onClick={() => exec("formatBlock", "<p>")}
            >
              <Pilcrow aria-hidden className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Heading 2"
              onClick={() => exec("formatBlock", "<h2>")}
            >
              <Heading2 aria-hidden className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Heading 3"
              onClick={() => exec("formatBlock", "<h3>")}
            >
              <Heading3 aria-hidden className="size-4" />
            </ToolbarButton>
            <span aria-hidden className="mx-1 h-5 w-px bg-gray-200" />
            <ToolbarButton label="Bold" onClick={() => exec("bold")}>
              <Bold aria-hidden className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Italic" onClick={() => exec("italic")}>
              <Italic aria-hidden className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Underline" onClick={() => exec("underline")}>
              <Underline aria-hidden className="size-4" />
            </ToolbarButton>
            <span aria-hidden className="mx-1 h-5 w-px bg-gray-200" />
            <ToolbarButton
              label="Bulleted list"
              onClick={() => exec("insertUnorderedList")}
            >
              <List aria-hidden className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Numbered list"
              onClick={() => exec("insertOrderedList")}
            >
              <ListOrdered aria-hidden className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Quote"
              onClick={() => exec("formatBlock", "<blockquote>")}
            >
              <Quote aria-hidden className="size-4" />
            </ToolbarButton>
            <span aria-hidden className="mx-1 h-5 w-px bg-gray-200" />
            <ToolbarButton label="Insert link" onClick={createLink}>
              <Link2 aria-hidden className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Clear formatting"
              onClick={() => exec("removeFormat")}
            >
              <Eraser aria-hidden className="size-4" />
            </ToolbarButton>
          </div>
        ) : null}

        {mode === "visual" ? (
          <div
            aria-invalid={error ? true : undefined}
            aria-label={label}
            aria-multiline="true"
            className="rich-text overflow-y-auto px-3 py-2.5 text-sm font-normal text-gray-900 outline-none"
            contentEditable
            id={id}
            onBlur={syncFromEditor}
            onInput={syncFromEditor}
            ref={editorRef}
            role="textbox"
            style={{ minHeight }}
            suppressContentEditableWarning
          />
        ) : null}

        {mode === "html" ? (
          <textarea
            aria-invalid={error ? true : undefined}
            aria-label={`${label} HTML source`}
            className="block w-full resize-y bg-gray-50 px-3 py-2.5 font-mono text-[13px] font-normal leading-6 text-gray-900 outline-none"
            id={id}
            onChange={(event) => onChange(event.target.value)}
            style={{ minHeight }}
            value={value}
          />
        ) : null}

        {mode === "preview" ? (
          <div
            className="rich-text overflow-y-auto px-3 py-2.5 text-sm font-normal text-gray-900"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
          />
        ) : null}
      </div>

      {name ? <input name={name} type="hidden" value={value} /> : null}

      {hint ? (
        <span className="mt-1 block text-xs font-normal text-gray-500">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="mt-1 block text-xs font-semibold text-red-700">
          {error}
        </span>
      ) : null}
      {required ? (
        <span className="sr-only">This field is required.</span>
      ) : null}
    </div>
  );
}
