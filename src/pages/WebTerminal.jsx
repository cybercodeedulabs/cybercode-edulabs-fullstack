import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { useIAM } from "../contexts/IAMContext";

export default function WebTerminal() {
  const terminalRef = useRef(null);
  const socketRef = useRef(null);
  const termRef = useRef(null);

  const { getToken } = useIAM();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const container = searchParams.get("container");
    const token = getToken();

    if (!container || !token) {
      return;
    }

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: "#0f172a",
      },
    });

    term.open(terminalRef.current);
    termRef.current = term;

    const ws = new WebSocket(
      `wss://api.cybercodeedulabs.com/api/cloud/terminal?token=${token}&container=${container}`
    );

    socketRef.current = ws;

    ws.onopen = () => {
      term.write("🔐 Connected to C3 Secure Terminal\r\n\r\n");
    };

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    ws.onerror = () => {
      term.write("\r\n❌ Connection error\r\n");
    };

    ws.onclose = () => {
      term.write("\r\n🔒 Terminal closed\r\n");
    };

    term.onData((data) => {
      ws.send(data);
    });

    return () => {
      ws.close();
      term.dispose();
    };
  }, []);

  return (
    <div style={{ height: "100vh", background: "#0f172a" }}>
      <div ref={terminalRef} style={{ height: "100%" }} />
    </div>
  );
}
