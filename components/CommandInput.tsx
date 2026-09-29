"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

const HISTORY_KEY = "rcon:history";
const MAX_HISTORY = 100;

function loadHistory(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(saved)
      ? saved.filter((s) => typeof s === "string").slice(-MAX_HISTORY)
      : [];
  } catch {
    return [];
  }
}

export function CommandInput({
  isConnected,
  onSend,
}: {
  isConnected: boolean;
  onSend: (cmd: string) => void;
}) {
  const [command, setCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const history = useRef<string[] | null>(null);
  // -1 — редактируем новую команду, иначе индекс в истории с конца
  const historyIndex = useRef(-1);
  // Недописанная команда, чтобы вернуть её при выходе из истории
  const draft = useRef("");

  const getHistory = () => (history.current ??= loadHistory());

  useEffect(() => {
    if (isConnected) inputRef.current?.focus();
  }, [isConnected]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim();
    if (!cmd) return;

    onSend(cmd);

    const list = getHistory();
    if (list[list.length - 1] !== cmd) {
      list.push(cmd);
      if (list.length > MAX_HISTORY) list.splice(0, list.length - MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
      } catch {
        // не критично
      }
    }
    historyIndex.current = -1;
    draft.current = "";
    setCommand("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

    const list = getHistory();
    if (list.length === 0) return;
    e.preventDefault();

    let index = historyIndex.current;
    if (e.key === "ArrowUp") {
      if (index === -1) draft.current = command;
      index = Math.min(index + 1, list.length - 1);
    } else {
      index = Math.max(index - 1, -1);
    }

    historyIndex.current = index;
    setCommand(index === -1 ? draft.current : list[list.length - 1 - index]);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-3">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-mono">
          {">"}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => {
            historyIndex.current = -1;
            setCommand(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Введите команду... (↑/↓ — история)"
          aria-label="Команда"
          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-sm rounded-lg pl-8 pr-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-zinc-700"
          disabled={!isConnected}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
      <button
        type="submit"
        disabled={!isConnected}
        aria-label="Отправить"
        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 rounded-lg border border-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
