import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getChatMessages, markMessagesRead, updateChatMsg, deleteChatMsg } from '../api/chatApi';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws-stomp';

export const useChat = (roomNo) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const clientRef = useRef(null);

  const loadMessages = useCallback(async () => {
    if (!roomNo) return;
    try {
      setLoading(true);
      const res = await getChatMessages(roomNo);
      const normalized = (res.data.data || []).map((m) => ({
        ...m,
        sentAt: m.sentAt || m.createdAt,
        fileUrl: m.fileUrl || m.savePath || null,
        type: m.type || m.msgType,
      }));
      setMessages(normalized);
    } catch (e) {
      console.error('메시지 로드 실패', e);
    } finally {
      setLoading(false);
    }
  }, [roomNo]);

  useEffect(() => {
    if (!roomNo) return;

    loadMessages();
    markMessagesRead(roomNo).catch(() => {});

    const token = localStorage.getItem('token');

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/sub/chat/room/${roomNo}`, (frame) => {
          const msg = JSON.parse(frame.body);

          // ── 수정 이벤트 ──
          if (msg.type === 'UPDATE') {
            setMessages((prev) =>
              prev.map((m) =>
                Number(m.msgNo) === Number(msg.msgNo)
                  ? { ...m, content: msg.content, editedYn: 'Y' }
                  : m
              )
            );
            return;
          }

          // ── 삭제 이벤트 ──
          if (msg.type === 'DELETE') {
            setMessages((prev) =>
              prev.map((m) =>
                Number(m.msgNo) === Number(msg.msgNo)
                  ? { ...m, deletedYn: 'Y' }
                  : m
              )
            );
            return;
          }

          // ── 일반 메시지 ──
          const normalized = {
            ...msg,
            sentAt: msg.sentAt || msg.createdAt || new Date().toISOString(),
            fileUrl: msg.fileUrl || msg.savePath || null,
            type: msg.type || msg.msgType,
          };
          setMessages((prev) => {
            if (!normalized.senderName) {
              const found = prev.find((m) => Number(m.senderNo) === Number(normalized.senderNo));
              if (found?.senderName) normalized.senderName = found.senderName;
            }
            return [...prev, normalized];
          });
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

  const sendMessage = useCallback(
    (content, type = 'TEXT', fileUrl = null) => {
      if (!clientRef.current?.connected) return;
      const token = localStorage.getItem('token');
      clientRef.current.publish({
        destination: `/pub/chat/message`,
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ roomNo, type, content, fileUrl }),
      });
    },
    [roomNo]
  );

  // WebSocket으로 수정 브로드캐스트
  const updateMessage = useCallback(
    async (msgNo, content) => {
      if (!clientRef.current?.connected) return;
      const token = localStorage.getItem('token');
      try {
        await updateChatMsg(msgNo, content); // DB 저장
        clientRef.current.publish({
          destination: `/pub/chat/message/update`,
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ roomNo, msgNo, content }),
        });
      } catch (e) {
        alert('수정에 실패했습니다.');
      }
    },
    [roomNo]
  );

  // WebSocket으로 삭제 브로드캐스트
  const deleteMessage = useCallback(
    async (msgNo) => {
      if (!clientRef.current?.connected) return;
      const token = localStorage.getItem('token');
      try {
        await deleteChatMsg(msgNo); // DB soft delete
        clientRef.current.publish({
          destination: `/pub/chat/message/delete`,
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ roomNo, msgNo }),
        });
      } catch (e) {
        alert('삭제에 실패했습니다.');
      }
    },
    [roomNo]
  );

  return { messages, setMessages, connected, loading, sendMessage, updateMessage, deleteMessage };
};