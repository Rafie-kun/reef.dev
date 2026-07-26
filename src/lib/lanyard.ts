'use client';

import { useEffect, useState, useRef } from 'react';
import { LanyardData } from './types';

const LANYARD_USER = '744808879036170272';
const WS_URL = 'wss://api.lanyard.rest/socket';

export function useLanyard() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.op === 1) {
            heartbeatRef.current = setInterval(() => {
              ws.send(JSON.stringify({ op: 3 }));
            }, msg.d.heartbeat_interval);
            ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: LANYARD_USER } }));
          }
          if (msg.op === 0) {
            setData(msg.d);
          }
        } catch {}
      };

      ws.onclose = () => {
        setConnected(false);
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, []);

  return { data, connected };
}
