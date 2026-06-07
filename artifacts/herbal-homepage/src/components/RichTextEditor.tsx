import React, { useRef, useEffect, useCallback } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

interface ToolbarBtn {
  label: string;
  title: string;
  cmd?: string;
  arg?: string;
  action?: () => void;
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, []);

  const exec = useCallback((cmd: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    const html = editorRef.current?.innerHTML ?? "";
    onChange(html === "<br>" ? "" : html);
  }, [onChange]);

  const handleInput = () => {
    if (isComposing.current) return;
    const html = editorRef.current?.innerHTML ?? "";
    onChange(html === "<br>" ? "" : html);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  };

  const buttons: ToolbarBtn[] = [
    { label: "B", title: "Bold", cmd: "bold" },
    { label: "I", title: "Italic", cmd: "italic" },
    { label: "U", title: "Underline", cmd: "underline" },
    { label: "S", title: "Strikethrough", cmd: "strikeThrough" },
    { label: "H2", title: "Heading 2", cmd: "formatBlock", arg: "H2" },
    { label: "H3", title: "Heading 3", cmd: "formatBlock", arg: "H3" },
    { label: "¶", title: "Paragraph", cmd: "formatBlock", arg: "P" },
    { label: "• List", title: "Bullet List", cmd: "insertUnorderedList" },
    { label: "1. List", title: "Numbered List", cmd: "insertOrderedList" },
    { label: "🔗", title: "Insert Link", action: insertLink },
    { label: "⬛ Quote", title: "Blockquote", cmd: "formatBlock", arg: "BLOCKQUOTE" },
    { label: "✕", title: "Remove Formatting", cmd: "removeFormat" },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-2 py-1.5 flex flex-wrap gap-1">
        {buttons.map((btn) => (
          <button
            key={btn.title}
            type="button"
            title={btn.title}
            onMouseDown={(e) => {
              e.preventDefault();
              if (btn.action) btn.action();
              else if (btn.cmd) exec(btn.cmd, btn.arg);
            }}
            className="px-2 py-1 rounded text-xs font-medium text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors select-none"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => { isComposing.current = false; handleInput(); }}
        data-placeholder={placeholder || "Write here..."}
        className="min-h-[200px] p-3 text-sm text-gray-800 outline-none prose prose-sm max-w-none
          [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-1.5 [&_h3]:mt-2
          [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5
          [&_blockquote]:border-l-4 [&_blockquote]:border-green-400 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-600
          [&_a]:text-blue-600 [&_a]:underline
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
      />
    </div>
  );
}
