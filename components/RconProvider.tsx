"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  LogEntry,
  RconConfig,
  RconContextType,
  RustRconMessage,
} from "@/lib/types";

const RconContext = createContext<RconContextType | undefined>(undefined);

export function useRcon() {
  const context = useContext(RconContext);
  if (!context) throw new Error("useRcon must be used within an RconProvider");
  return context;
}

export function RconProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const socketRef = useRef<WebSocket | null>(null);
  const nextId = useRef(1000);

  const addLog = (message: string, type: LogEntry["type"]) => {
    setLogs((prev) => {
      const newLog: LogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString("ru-RU", { hour12: false }),
        message,
        type,
      };
      const newLogs = [...prev, newLog];
      if (newLogs.length > 500) return newLogs.slice(newLogs.length - 500);
      return newLogs;
    });
  };

  const connect = (config: RconConfig) => {
    disconnect();

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const ws = new WebSocket(
        `ws://${config.ip}:${config.port}/${config.password}`
      );

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        addLog("СИСТЕМА: Соединение установлено.", "success");
      };

      ws.onmessage = (event) => {
        try {
          const data: RustRconMessage = JSON.parse(event.data);

          if (!data || (!data.Message && data.Type !== "Error")) return;
          if (
            typeof data.Message === "string" &&
            data.Message.trim().length === 0
          )
            return;

          let type: LogEntry["type"] = "server";
          const msgLower = data.Message ? data.Message.toLowerCase() : "";

          if (
            data.Type === "Chat" ||
            msgLower.includes("[chat]") ||
            msgLower.startsWith("chat:")
          )
            type = "chat";
          else if (
            data.Type === "Error" ||
            data.Stacktrace ||
            msgLower.includes("[error]")
          )
            type = "error";
          else if (data.Type === "Warning" || msgLower.includes("[warn]"))
            type = "warning";

          if (data.Message) {
            addLog(data.Message, type);
          }
        } catch (e) {
          // console.error(e);
        }
      };

      ws.onclose = (event) => {
        if (event.code !== 1000) {
          setConnectionError(
            `Соединение разорвано сервером (Код: ${event.code}). Возможно неверный пароль.`
          );
          addLog(
            `СИСТЕМА: Соединение разорвано (Code: ${event.code}).`,
            "error"
          );
        }

        setIsConnected(false);
        setIsConnecting(false);
        socketRef.current = null;
      };

      ws.onerror = () => {
        setConnectionError(
          "Не удалось подключиться. Проверьте IP адрес и порт."
        );
        setIsConnected(false);
        setIsConnecting(false);
      };

      socketRef.current = ws;
    } catch (err: any) {
      setIsConnecting(false);
      setConnectionError(`Ошибка инициализации: ${err.message}`);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setIsConnecting(false);

    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.onerror = null;
      socketRef.current.close(1000);
      socketRef.current = null;
    }

    addLog("СИСТЕМА: Отключено пользователем.", "server");
  };

  const sendCommand = (cmd: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      nextId.current += 1;
      const packet = {
        Identifier: nextId.current,
        Message: cmd,
        Name: "WebRcon",
      };
      socketRef.current.send(JSON.stringify(packet));
      addLog(cmd, "cmd");
    } else {
      addLog("Error: Нет соединения", "error");
      setIsConnected(false);
    }
  };

  const clearLogs = () => setLogs([]);

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.close(1000);
    };
  }, []);

  return (
    <RconContext.Provider
      value={{
        isConnected,
        isConnecting,
        connectionError,
        logs,
        connect,
        disconnect,
        sendCommand,
        clearLogs,
      }}
    >
      {children}
    </RconContext.Provider>
  );
}
