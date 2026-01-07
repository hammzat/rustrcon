// lib/types.ts

export type LogType =
  | "cmd"
  | "server"
  | "chat"
  | "error"
  | "warning"
  | "success";

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: LogType;
}

export interface RustRconMessage {
  Message: string;
  Identifier: number;
  Type: string;
  Stacktrace?: string;
}

export interface RconConfig {
  ip: string;
  port: string;
  password: string;
}

export interface RconContextType {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  logs: LogEntry[];
  connect: (config: RconConfig) => void;
  disconnect: () => void;
  sendCommand: (cmd: string) => void;
  clearLogs: () => void;
}
