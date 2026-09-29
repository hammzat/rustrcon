"use client";

import React, { useLayoutEffect, useRef } from "react";
import { LogEntry } from "@/lib/types";

const typeClass: Record<LogEntry["type"], string> = {
  error: "text-rose-400",
  warning: "text-amber-400",
  chat: "text-blue-400",
  cmd: "text-zinc-500 italic",
  success: "text-emerald-400",
  server: "text-zinc-300",
};

// Насколько близко к низу (px) считаем, что пользователь «внизу»
const BOTTOM_THRESHOLD = 24;

export function LogView({
  logs,
  isConnected,
  autoScroll,
  onAutoScrollChange,
}: {
  logs: LogEntry[];
  isConnected: boolean;
  autoScroll: boolean;
  onAutoScrollChange: (value: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Скроллим сам контейнер, а не scrollIntoView: тот дёргает всю страницу
  // (особенно на мобильных) и тормозит на плотном потоке логов
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (autoScroll && el) el.scrollTop = el.scrollHeight;
  }, [logs, autoScroll]);

  // Прокрутили вверх — выключаем автоскролл, вернулись вниз — включаем
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD;
    if (atBottom !== autoScroll) onAutoScrollChange(atBottom);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 bg-zinc-950 p-4 overflow-y-auto font-mono text-sm space-y-1"
    >
      {logs.length === 0 && isConnected && (
        <div className="text-zinc-700 text-center mt-10 italic">
          Консоль готова.
        </div>
      )}
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex gap-3 leading-relaxed wrap-break-word hover:bg-zinc-900/30 rounded px-2 -mx-2 transition-colors"
        >
          <span className="text-zinc-600 text-xs py-0.5 select-none shrink-0 w-15">
            {log.timestamp}
          </span>
          <span className={`flex-1 min-w-0 whitespace-pre-wrap ${typeClass[log.type]}`}>
            {log.type === "cmd" ? `> ${log.message}` : log.message}
          </span>
        </div>
      ))}
    </div>
  );
}
