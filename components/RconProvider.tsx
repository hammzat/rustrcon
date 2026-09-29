"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LogEntry,
  RconConfig,
  RconContextType,
  RustRconMessage,
} from "@/lib/types";

const MAX_LOGS = 500;

const RconContext = createContext<RconContextType | undefined>(undefined);

export function useRcon() {
  const context = useContext(RconContext);
  if (!context) throw new Error("useRcon must be used within an RconProvider");
  return context;
}

// IPv6 адрес в URL нужно оборачивать в квадратные скобки
function formatHost(ip: string) {
  const host = ip.trim();
  if (host.includes(":") && !host.startsWith("[")) return `[${host}]`;
  return host;
}

function classifyMessage(data: RustRconMessage): LogEntry["type"] {
  const msgLower = data.Message.toLowerCase();

  if (
    data.Type === "Chat" ||
    msgLower.includes("[chat]") ||
    msgLower.startsWith("chat:")
  )
    return "chat";
  if (data.Type === "Error" || data.Stacktrace || msgLower.includes("[error]"))
    return "error";
  if (data.Type === "Warning" || msgLower.includes("[warn]")) return "warning";
  return "server";
}

export function RconProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const socketRef = useRef<WebSocket | null>(null);
  const nextCommandId = useRef(1000);
  // Счётчик вместо crypto.randomUUID(): тот доступен только в secure context
  // и падает, если сайт открыт по http:// не с localhost
  const nextLogId = useRef(0);

  const addLog = useCallback((message: string, type: LogEntry["type"]) => {
    const newLog: LogEntry = {
      id: nextLogId.current++,
      timestamp: new Date().toLocaleTimeString("ru-RU", { hour12: false }),
      message,
      type,
    };
    setLogs((prev) => {
      const newLogs = [...prev, newLog];
      return newLogs.length > MAX_LOGS
        ? newLogs.slice(newLogs.length - MAX_LOGS)
        : newLogs;
    });
  }, []);

  // Закрывает текущий сокет, не трогая лог. Возвращает true, если сокет был.
  const closeSocket = useCallback(() => {
    const ws = socketRef.current;
    socketRef.current = null;
    setIsConnected(false);
    setIsConnecting(false);

    if (!ws) return false;
    ws.onopen = null;
    ws.onmessage = null;
    ws.onclose = null;
    ws.onerror = null;
    ws.close(1000);
    return true;
  }, []);

  const connect = useCallback(
    (config: RconConfig) => {
      closeSocket();

      const address = `${formatHost(config.ip)}:${config.port.trim()}`;
      setTarget(address);
      setIsConnecting(true);
      setConnectionError(null);

      let ws: WebSocket;
      try {
        // Пароль кодируем, иначе символы вроде # / ? ломают URL
        ws = new WebSocket(
          `ws://${address}/${encodeURIComponent(config.password)}`
        );
      } catch (err) {
        setIsConnecting(false);
        const message = err instanceof Error ? err.message : String(err);
        setConnectionError(
          `Браузер заблокировал подключение: ${message}. Скорее всего, нужно разрешить небезопасный контент.`
        );
        return;
      }

      let wasOpen = false;

      ws.onopen = () => {
        if (socketRef.current !== ws) return;
        wasOpen = true;
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        addLog(`СИСТЕМА: Соединение с ${address} установлено.`, "success");
      };

      ws.onmessage = (event) => {
        if (socketRef.current !== ws) return;

        let data: RustRconMessage;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        if (typeof data?.Message !== "string") return;
        if (data.Message.trim().length === 0) return;

        addLog(data.Message, classifyMessage(data));
      };

      // onerror у WebSocket не несёт подробностей и всегда сопровождается
      // onclose, поэтому вся обработка ошибок живёт в onclose
      ws.onclose = (event) => {
        if (socketRef.current !== ws) return;
        socketRef.current = null;
        setIsConnected(false);
        setIsConnecting(false);

        if (!wasOpen) {
          // Неверный пароль, недоступный сервер и блокировка mixed content
          // для браузера выглядят одинаково (код 1006)
          setConnectionError(
            "Не удалось подключиться. Проверьте IP, порт и пароль, а если сайт открыт по HTTPS — разрешение небезопасного контента."
          );
          return;
        }

        if (event.code !== 1000) {
          setConnectionError(
            `Соединение разорвано (код ${event.code}).`
          );
          addLog(
            `СИСТЕМА: Соединение разорвано (код ${event.code}).`,
            "error"
          );
        } else {
          addLog("СИСТЕМА: Сервер закрыл соединение.", "server");
        }
      };

      socketRef.current = ws;
    },
    [addLog, closeSocket]
  );

  const disconnect = useCallback(() => {
    if (closeSocket()) addLog("СИСТЕМА: Отключено пользователем.", "server");
    setConnectionError(null);
  }, [addLog, closeSocket]);

  const sendCommand = useCallback(
    (cmd: string) => {
      const ws = socketRef.current;
      if (ws?.readyState === WebSocket.OPEN) {
        nextCommandId.current += 1;
        const packet = {
          Identifier: nextCommandId.current,
          Message: cmd,
          Name: "WebRcon",
        };
        ws.send(JSON.stringify(packet));
        addLog(cmd, "cmd");
      } else {
        addLog("СИСТЕМА: Нет соединения.", "error");
        closeSocket();
      }
    },
    [addLog, closeSocket]
  );

  const clearLogs = useCallback(() => setLogs([]), []);

  useEffect(() => {
    return () => {
      closeSocket();
    };
  }, [closeSocket]);

  const value = useMemo(
    () => ({
      isConnected,
      isConnecting,
      connectionError,
      target,
      logs,
      connect,
      disconnect,
      sendCommand,
      clearLogs,
    }),
    [
      isConnected,
      isConnecting,
      connectionError,
      target,
      logs,
      connect,
      disconnect,
      sendCommand,
      clearLogs,
    ]
  );

  return (
    <RconContext.Provider value={value}>{children}</RconContext.Provider>
  );
}
