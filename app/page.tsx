"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Send,
  Power,
  Server,
  Circle,
  Eraser,
  AlertCircle,
  HelpCircle,
  X,
  ShieldAlert,
  Settings,
  Lock,
  RefreshCw,
  ShieldCheck,
  Github,
} from "lucide-react";
import { RconProvider, useRcon } from "@/components/RconProvider";

// мне было нужно сделать этот проект за день для себя, поэтому я решил сделать синглтон, а потом уже решил открыть его для всех.
// мб попозже сделаю получше
function RconDashboard() {
  const {
    isConnected,
    isConnecting,
    connectionError,
    logs,
    connect,
    disconnect,
    sendCommand,
    clearLogs,
  } = useRcon();

  const [ip, setIp] = useState("");
  const [port, setPort] = useState("28016");
  const [password, setPassword] = useState("");
  const [command, setCommand] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);

  const [showHelp, setShowHelp] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleConnect = () => {
    if (!ip || !port || !password) return;
    connect({ ip, port, password });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      sendCommand(command);
      setCommand("");
    }
  };

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  useEffect(() => {
    if (isConnected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isConnected]);

  const getStatusColor = () => {
    if (isConnected)
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
        dot: "text-emerald-500",
        label: "Подключено",
      };
    if (isConnecting)
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/20",
        dot: "text-amber-500",
        label: "Подключение...",
      };
    if (connectionError)
      return {
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        border: "border-rose-500/20",
        dot: "text-rose-500",
        label: "Ошибка",
      };
    return {
      bg: "bg-zinc-500/10",
      text: "text-zinc-400",
      border: "border-zinc-500/20",
      dot: "text-zinc-500",
      label: "Отключено",
    };
  };

  const status = getStatusColor();

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
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.text} ${status.border} transition-all duration-300`}
          >
            <Circle size={8} className={`fill-current ${status.dot}`} />
            {status.label}
          </div>
        </header>

        {/* Контент сайта */}
        <div className="flex-1 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 shadow-xl overflow-hidden flex flex-col relative group hover:border-zinc-700/60 transition-colors duration-300">
          {showHelp && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="text-amber-500" size={20} />
                    Разрешение подключения
                  </h3>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Контент модалке */}
                <div className="p-6 overflow-y-auto">
                  <p className="text-sm text-zinc-400 mb-6">
                    Современные браузеры блокируют подключение с защищенного
                    сайта (HTTPS) к игровому серверу без шифрования (WS). Чтобы
                    консоль заработала, нужно разрешить{" "}
                    <b>небезопасный контент</b> для этого сайта.
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 font-bold border border-indigo-500/20">
                        1
                      </div>
                      <div>
                        <p className="text-zinc-200 text-sm font-medium mb-1">
                          Нажмите на настройки сайта
                        </p>
                        <p className="text-xs text-zinc-500 mb-2">
                          Слева от адресной строки браузера (замок или иконка
                          настроек).
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-400">
                          <Settings size={14} />{" "}
                          <span className="opacity-50">или</span>{" "}
                          <Lock size={14} />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 font-bold border border-indigo-500/20">
                        2
                      </div>
                      <div>
                        <p className="text-zinc-200 text-sm font-medium mb-1">
                          Перейдите в "Настройки сайта"
                        </p>
                        <p className="text-xs text-zinc-500">
                          В меню выберите пункт <b>Site Settings</b> (Настройки
                          сайта).
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 font-bold border border-indigo-500/20">
                        3
                      </div>
                      <div>
                        <p className="text-zinc-200 text-sm font-medium mb-1">
                          Разрешите Insecure Content
                        </p>
                        <p className="text-xs text-zinc-500 mb-2">
                          Найдите <b>Insecure Content</b> (Небезопасный контент)
                          и выберите <b>Allow</b> (Разрешить).
                        </p>
                        <div className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-xs flex justify-between items-center w-full max-w-62.5">
                          <span className="text-zinc-400">
                            Insecure Content
                          </span>
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            Allow <Circle size={6} fill="currentColor" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                    <p className="text-xs text-zinc-500 mb-3">
                      После настройки перезагрузите страницу
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors text-sm font-medium"
                    >
                      <RefreshCw size={16} />
                      Перезагрузить страницу
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* логин эыэыэ */}
          {!isConnected && (
            <div className="absolute inset-0 z-20 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl relative">
                <button
                  onClick={() => setShowHelp(true)}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-indigo-400 transition-colors"
                  title="Инструкция по подключению"
                >
                  <HelpCircle size={20} />
                </button>

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Terminal size={20} className="text-indigo-500" />
                  Подключение
                </h3>

                {connectionError && (
                  <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2 items-start">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <span>{connectionError}</span>
                    </div>
                    <button
                      onClick={() => setShowHelp(true)}
                      className="self-end text-xs underline hover:text-rose-300 opacity-80"
                    >
                      Как исправить?
                    </button>
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                      IP Адрес
                    </label>
                    <input
                      type="text"
                      placeholder="127.0.0.1"
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-zinc-700"
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                        Порт
                      </label>
                      <input
                        type="number"
                        placeholder="28016"
                        className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-zinc-700"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                        Пароль
                      </label>
                      <input
                        type="password"
                        placeholder="••••••"
                        className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-zinc-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConnecting ? "Соединение..." : "Войти в консоль"}
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
                  <div className="flex gap-3 items-start opacity-75">
                    <ShieldCheck
                      size={16}
                      className="text-emerald-500 mt-0.5 shrink-0"
                    />
                    <div className="text-[10px] text-zinc-500 leading-relaxed">
                      <span className="text-zinc-300 font-medium">
                        100% Clientside.
                      </span>{" "}
                      Данные не отправляются на сторонние сервера.
                    </div>
                  </div>

                  <a
                    href="https://github.com/hammzat/rustrcon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 items-center opacity-75 hover:opacity-100 transition-opacity group cursor-pointer"
                  >
                    <Github
                      size={16}
                      className="text-zinc-400 group-hover:text-white transition-colors mt-0.5 shrink-0"
                    />
                    <div className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      Весь исходный код доступен на{" "}
                      <span className="underline decoration-zinc-700 underline-offset-2 group-hover:decoration-white">
                        GitHub
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Тулбвр консоли */}
          <div className="h-12 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4 shrink-0">
            <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
              <span
                className={isConnected ? "text-emerald-500" : "text-zinc-600"}
              >
                ●
              </span>
              {isConnected ? `${ip}:${port}` : "Disconnected"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearLogs}
                className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-md transition-all"
                title="Очистить"
              >
                <Eraser size={16} />
              </button>
              <button
                onClick={disconnect}
                className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all"
                title="Отключиться"
              >
                <Power size={16} />
              </button>
            </div>
          </div>

          {/* Логи */}
          <div className="flex-1 bg-zinc-950 p-4 overflow-y-auto font-mono text-sm space-y-1">
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
                <span
                  className={`flex-1 whitespace-pre-wrap ${
                    log.type === "error"
                      ? "text-rose-400"
                      : log.type === "warning"
                      ? "text-amber-400"
                      : log.type === "chat"
                      ? "text-blue-400"
                      : log.type === "cmd"
                      ? "text-zinc-500 italic"
                      : log.type === "success"
                      ? "text-emerald-400"
                      : "text-zinc-300"
                  }`}
                >
                  {log.type === "cmd" ? `> ${log.message}` : log.message}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>

          {/* Ввод */}
          <div className="p-4 bg-zinc-900 border-t border-zinc-800">
            <form onSubmit={handleSend} className="relative flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-mono">
                  {">"}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Введите команду..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-sm rounded-lg pl-8 pr-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-zinc-700"
                  disabled={!isConnected}
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={!isConnected}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 rounded-lg border border-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
              >
                <Send size={18} />
              </button>
            </form>

            <div className="mt-2 flex justify-between items-center px-1">
              <div className="flex gap-2 text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">
                <span>Rust</span>
                <span className="text-zinc-700">•</span>
                <span>WebRcon</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-3 h-3 rounded border flex items-center justify-center transition-all ${
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
                <input
                  type="checkbox"
                  className="hidden"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                />
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
