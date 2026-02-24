import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getChatMessages, markMessagesRead } from '../api/chatApi';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws-stomp';

export const useChat = (roomNo) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const clientRef = useRef(null);

  // 과거 메시지 로드
  const loadMessages = useCallback(async () => {
    if (!roomNo) return;
    try {
      setLoading(true);
      const res = await getChatMessages(roomNo);
      setMessages(res.data.data.content || []);
    } catch (e) {
      console.error('메시지 로드 실패', e);
    } finally {
      setLoading(false);
    }
  }, [roomNo]);

  // STOMP 연결
  useEffect(() => {
    if (!roomNo) return;

    loadMessages();
    markMessagesRead(roomNo).catch(() => {});

    const token = localStorage.getItem('accessToken');

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/sub/chat/room/${roomNo}`, (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages((prev) => [...prev, msg]);
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => {
        console.error('STOMP error', frame);
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomNo]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content, type = 'TEXT', fileUrl = null) => {
      if (!clientRef.current?.connected) return;
      const token = localStorage.getItem('accessToken');

      clientRef.current.publish({
        destination: `/pub/chat/message`,
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          roomNo,
          type,       // TEXT | FILE | IMAGE
          content,
          fileUrl,
        }),
      });
    },
    [roomNo]
  );

  return { messages, connected, loading, sendMessage };
};
