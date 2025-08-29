"use client";

import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";

export default function XTerminal({ socket }) {
  const terminalRef = useRef(null);
  const terminal = useRef(null);
  const fitAddon = useRef(null);

  useEffect(() => {
    let Terminal, FitAddon;

    (async () => {
      const xterm = await import("@xterm/xterm");
      const addonFit = await import("@xterm/addon-fit");
      Terminal = xterm.Terminal;
      FitAddon = addonFit.FitAddon;

      if (terminalRef.current) {
        terminal.current = new Terminal({
          cursorBlink: true,
          theme: {
            background: "#1e1e1e",
            foreground: "#d4d4d4",
          },
        });

        fitAddon.current = new FitAddon();
        terminal.current.loadAddon(fitAddon.current);

        terminal.current.open(terminalRef.current);
        fitAddon.current.fit();

        terminal.current.onData((data) => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "input", data }));
          }
        });

        const handleResize = () => {
          fitAddon.current.fit();
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                type: "resize",
                data: {
                  cols: terminal.current.cols,
                  rows: terminal.current.rows,
                },
              })
            );
          }
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          terminal.current?.dispose();
        };
      }
    })();
  }, [socket]);

  return <div ref={terminalRef} style={{ width: "100%", height: "100%" }} />;
}