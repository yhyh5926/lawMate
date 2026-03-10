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

  // 과거 메시지 로드 (REST API)
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

  // STOMP WebSocket 연결
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

          // ── 수정 이벤트: 상대방 화면에도 수정 내용 반영 ──
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

          // ── 삭제 이벤트: 상대방 화면에도 삭제됨 표시 ──
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

          // ── 일반 메시지 수신 ──
          const normalized = {
            ...msg,
            sentAt: msg.sentAt || msg.createdAt || new Date().toISOString(),
            fileUrl: msg.fileUrl || msg.savePath || null,
            type: msg.type || msg.msgType,
          };
          setMessages((prev) => {
            // senderName이 없으면 기존 메시지에서 찾아서 채움
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

  // 메시지 전송 (WebSocket)
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

  // 메시지 수정: DB 업데이트 + WebSocket으로 상대방에게 브로드캐스트
  const updateMessage = useCallback(
    async (msgNo, content) => {
      if (!clientRef.current?.connected) return;
      const token = localStorage.getItem('token');
      try {
        await updateChatMsg(msgNo, content); // REST API로 DB 저장
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

  // 메시지 삭제: DB soft delete + WebSocket으로 상대방에게 브로드캐스트
  const deleteMessage = useCallback(
    async (msgNo) => {
      if (!clientRef.current?.connected) return;
      const token = localStorage.getItem('token');
      try {
        await deleteChatMsg(msgNo); // REST API로 DB soft delete
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