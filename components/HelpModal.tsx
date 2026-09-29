"use client";

import React, { useEffect } from "react";
import {
  Circle,
  Lock,
  RefreshCw,
  Settings,
  ShieldAlert,
  TriangleAlert,
  X,
} from "lucide-react";

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 font-bold border border-indigo-500/20">
        {n}
      </div>
      <div>
        <p className="text-zinc-200 text-sm font-medium mb-1">{title}</p>
        {children}
      </div>
    </div>
  );
}

export function HelpModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 shrink-0">
          <h3
            id="help-title"
            className="font-bold text-white flex items-center gap-2"
          >
            <ShieldAlert className="text-amber-500" size={20} />
            Разрешение подключения
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-zinc-400 mb-6">
            Современные браузеры блокируют подключение с защищенного сайта
            (HTTPS) к игровому серверу без шифрования (WS). Чтобы консоль
            заработала, нужно разрешить <b>небезопасный контент</b> для этого
            сайта.
          </p>

          <div className="space-y-4">
            <Step n={1} title="Нажмите на настройки сайта">
              <p className="text-xs text-zinc-500 mb-2">
                Слева от адресной строки браузера (замок или иконка настроек).
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-400">
                <Settings size={14} /> <span className="opacity-50">или</span>{" "}
                <Lock size={14} />
              </div>
            </Step>

            <Step n={2} title="Перейдите в «Настройки сайта»">
              <p className="text-xs text-zinc-500">
                В меню выберите пункт <b>Site Settings</b> (Настройки сайта).
              </p>
            </Step>

            <Step n={3} title="Разрешите Insecure Content">
              <p className="text-xs text-zinc-500 mb-2">
                Найдите <b>Insecure Content</b> (Небезопасный контент) и
                выберите <b>Allow</b> (Разрешить).
              </p>
              <div className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-xs flex justify-between items-center w-full max-w-62.5">
                <span className="text-zinc-400">Insecure Content</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  Allow <Circle size={6} fill="currentColor" />
                </span>
              </div>
            </Step>
          </div>

          <p className="mt-6 text-xs text-zinc-500">
            <b className="text-zinc-400">Firefox:</b> такой настройки в меню
            сайта нет. Откройте <code>about:config</code> и включите{" "}
            <code>network.websocket.allowInsecureFromHTTPS</code>.
          </p>

          <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3 items-start">
            <TriangleAlert size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              WebRcon в Rust не поддерживает шифрование: пароль и все команды
              передаются по сети открытым текстом. Не подключайтесь через
              публичный Wi-Fi. Надёжнее всего запустить клиент локально (см.
              GitHub) или поставить перед сервером TLS-прокси.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
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
  );
}
