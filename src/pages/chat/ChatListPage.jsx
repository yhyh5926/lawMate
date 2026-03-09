import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatRooms, deleteChatRoom } from '../../api/chatApi';

const ChatListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await getChatRooms();
      setRooms(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, roomNo) => {
    e.stopPropagation(); // 채팅방 클릭 이벤트 방지
    if (!window.confirm('정말 이 채팅방을 삭제하시겠습니까?\n대화 내용이 모두 삭제됩니다.')) return;
    try {
      await deleteChatRoom(roomNo);
      setRooms(prev => prev.filter(r => r.roomNo !== roomNo));
    } catch (e) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    else if (diffDays === 1) return '어제';
    else if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1A1A2E', margin: 0, letterSpacing: '-0.5px' }}>
          메시지
        </h1>
        <p style={{ color: '#888', fontSize: '14px', margin: '4px 0 0' }}>
          총 {rooms.length}개의 대화
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>불러오는 중...</div>
      ) : rooms.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa', background: '#F7F9FB', borderRadius: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>아직 대화가 없습니다</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>변호사 프로필에서 1:1 채팅을 시작해보세요</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {rooms.map((room) => (
            <div
              key={room.roomNo}
              onClick={() => navigate(`/chat/room?roomNo=${room.roomNo}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                transition: 'background 0.15s', background: '#fff', position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F0F4FF';
                e.currentTarget.querySelector('.delete-btn').style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.querySelector('.delete-btn').style.opacity = '0';
              }}
            >
              {/* 아바타 */}
              <div style={{
                position: 'relative', width: '50px', height: '50px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1A6DFF, #4A90D9)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: '700', flexShrink: 0,
              }}>
                {room.targetName?.[0] ?? '?'}
                {room.unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-2px', right: '-2px', background: '#FF3B30',
                    color: '#fff', borderRadius: '10px', fontSize: '11px', fontWeight: '700',
                    minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', padding: '0 4px', border: '2px solid #fff',
                  }}>
                    {room.unreadCount > 99 ? '99+' : room.unreadCount}
                  </span>
                )}
              </div>

              {/* 텍스트 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: room.unreadCount > 0 ? '700' : '600', fontSize: '15px', color: '#1A1A2E' }}>
                    {room.targetName}
                    {room.targetRole === 'LAWYER' && (
                      <span style={{ marginLeft: '6px', fontSize: '11px', background: '#E8F0FF', color: '#1A6DFF', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                        변호사
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: '12px', color: '#aaa', flexShrink: 0 }}>
                    {formatTime(room.lastMessageAt)}
                  </span>
                </div>
                <p style={{
                  margin: 0, fontSize: '13px', color: room.unreadCount > 0 ? '#444' : '#888',
                  fontWeight: room.unreadCount > 0 ? '500' : '400',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {room.lastMessage || '대화를 시작해보세요'}
                </p>
              </div>

              {/* 삭제 버튼 - 호버 시 나타남 */}
              <button
                className="delete-btn"
                onClick={(e) => handleDelete(e, room.roomNo)}
                style={{
                  opacity: '0', transition: 'opacity 0.2s',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#FF3B30', fontSize: '18px', padding: '4px 8px',
                  borderRadius: '6px', flexShrink: 0,
                }}
                title="채팅방 삭제"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatListPage;