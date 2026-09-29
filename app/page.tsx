"use client";

import React, { useCallback, useState } from "react";
import { Circle, Eraser, Power, Server } from "lucide-react";
import { RconProvider, useRcon } from "@/components/RconProvider";
import { HelpModal } from "@/components/HelpModal";
import { ConnectForm } from "@/components/ConnectForm";
import { LogView } from "@/components/LogView";
import { CommandInput } from "@/components/CommandInput";

function getStatus(
  isConnected: boolean,
  isConnecting: boolean,
  hasError: boolean
) {
  if (isConnected)
    return {
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      dot: "text-emerald-500",
      label: "Подключено",
    };
  if (isConnecting)
    return {
      className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      dot: "text-amber-500",
      label: "Подключение...",
    };
  if (hasError)
    return {
      className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      dot: "text-rose-500",
      label: "Ошибка",
    };
  return {
    className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    dot: "text-zinc-500",
    label: "Отключено",
  };
}

function RconDashboard() {
  const {
    isConnected,
    isConnecting,
    connectionError,
    target,
    logs,
    disconnect,
    sendCommand,
    clearLogs,
  } = useRcon();

  const [autoScroll, setAutoScroll] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const closeHelp = useCallback(() => setShowHelp(false), []);

  const status = getStatus(isConnected, isConnecting, !!connectionError);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-indigo-500/30 flex flex-col items-center py-10 px-4 relative">
      <a
        href="https://aristocratos.ru"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-4 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200 transition-all duration-300 z-50 bg-[#181a1b] border border-[#333] rounded-full px-3 py-2 hover:border-[#555] hover:shadow-lg hover:shadow-blue-900/20"
      >
        <span className="font-medium">сделано с ❤️ by aristocratos</span>
      </a>

      <div className="w-full max-w-4xl flex flex-col gap-6 h-[85vh] mt-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
              <Server className="text-indigo-500" size={28} />
              Rust Console
            </h1>
            <p className="text-zinc-400 text-sm">
              Clientside WebRCON Implementation
            </p>
          </div>

          <div
            role="status"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.className} transition-all duration-300`}
          >
            <Circle size={8} className={`fill-current ${status.dot}`} />
            {status.label}
          </div>
        </header>

        <div className="flex-1 min-h-0 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 shadow-xl overflow-hidden flex flex-col relative group hover:border-zinc-700/60 transition-colors duration-300">
          {showHelp && <HelpModal onClose={closeHelp} />}

          {!isConnected && <ConnectForm onShowHelp={() => setShowHelp(true)} />}

          {/* Тулбар консоли */}
          <div className="h-12 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4 shrink-0">
            <div className="text-xs text-zinc-500 font-mono flex items-center gap-2 min-w-0">
              <span
                className={isConnected ? "text-emerald-500" : "text-zinc-600"}
              >
                ●
              </span>
              <span className="truncate">
                {isConnected && target ? target : "Disconnected"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearLogs}
                className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-md transition-all"
                title="Очистить"
                aria-label="Очистить"
              >
                <Eraser size={16} />
              </button>
              <button
                onClick={disconnect}
                className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all"
                title="Отключиться"
                aria-label="Отключиться"
              >
                <Power size={16} />
              </button>
            </div>
          </div>

          <LogView
            logs={logs}
            isConnected={isConnected}
            autoScroll={autoScroll}
            onAutoScrollChange={setAutoScroll}
          />

          {/* Ввод */}
          <div className="p-4 bg-zinc-900 border-t border-zinc-800">
            <CommandInput isConnected={isConnected} onSend={sendCommand} />

            <div className="mt-2 flex justify-between items-center px-1">
              <div className="flex gap-2 text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">
                <span>Rust</span>
                <span className="text-zinc-700">•</span>
                <span>WebRcon</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                />
                <div
                  className={`w-3 h-3 rounded border flex items-center justify-center transition-all peer-focus-visible:ring-1 peer-focus-visible:ring-indigo-500 ${
                    autoScroll
                      ? "bg-indigo-500 border-indigo-500"
                      : "border-zinc-700 bg-zinc-950"
                  }`}
                >
                  {autoScroll && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors select-none">
                  Авто-скролл
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <RconProvider>
      <RconDashboard />
    </RconProvider>
  );
}
