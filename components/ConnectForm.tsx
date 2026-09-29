"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, Github, HelpCircle, ShieldCheck, Terminal } from "lucide-react";
import { useRcon } from "@/components/RconProvider";

// Пароль намеренно не сохраняем
const STORAGE_KEY = "rcon:last-server";

const inputClass =
  "w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-zinc-700";
const labelClass =
  "block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider";

export function ConnectForm({ onShowHelp }: { onShowHelp: () => void }) {
  const { isConnecting, connectionError, connect } = useRcon();

  const [ip, setIp] = useState("");
  const [port, setPort] = useState("28016");
  const [password, setPassword] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      // localStorage недоступен при SSR, поэтому читаем после монтирования
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (typeof saved?.ip === "string") setIp(saved.ip);
      if (typeof saved?.port === "string") setPort(saved.port);
    } catch {
      // приватный режим или битые данные — просто пустая форма
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedIp = ip.trim();
    const trimmedPort = port.trim();
    if (!trimmedIp || !trimmedPort || !password) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ip: trimmedIp, port: trimmedPort })
      );
    } catch {
      // не критично
    }
    connect({ ip: trimmedIp, port: trimmedPort, password });
  };

  return (
    <div className="absolute inset-0 z-20 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl relative">
        <button
          type="button"
          onClick={onShowHelp}
          className="absolute top-4 right-4 text-zinc-600 hover:text-indigo-400 transition-colors"
          title="Инструкция по подключению"
          aria-label="Инструкция по подключению"
        >
          <HelpCircle size={20} />
        </button>

        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Terminal size={20} className="text-indigo-500" />
          Подключение
        </h3>

        {connectionError && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex flex-col gap-2">
            <div className="flex gap-2 items-start">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{connectionError}</span>
            </div>
            <button
              type="button"
              onClick={onShowHelp}
              className="self-end text-xs underline hover:text-rose-300 opacity-80"
            >
              Как исправить?
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rcon-ip" className={labelClass}>
              IP Адрес
            </label>
            <input
              id="rcon-ip"
              type="text"
              inputMode="url"
              placeholder="127.0.0.1"
              required
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label htmlFor="rcon-port" className={labelClass}>
                Порт
              </label>
              <input
                id="rcon-port"
                type="number"
                min={1}
                max={65535}
                placeholder="28016"
                required
                className={inputClass}
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="rcon-password" className={labelClass}>
                Пароль
              </label>
              <input
                id="rcon-password"
                type="password"
                placeholder="••••••"
                required
                autoComplete="current-password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? "Соединение..." : "Войти в консоль"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
          <div className="flex gap-3 items-start opacity-75">
            <ShieldCheck size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            <div className="text-[10px] text-zinc-500 leading-relaxed">
              <span className="text-zinc-300 font-medium">Без бэкенда.</span>{" "}
              IP, порт и пароль не отправляются никуда, кроме вашего
              Rust-сервера.
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
  );
}
