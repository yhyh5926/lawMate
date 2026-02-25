import axios from 'axios';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
});

// 채팅방 목록 조회
export const getChatRooms = () =>
  axios.get('http://localhost:8080/api/chat/rooms', authHeader());

// 채팅방 생성 또는 조회 (상대방 memberNo로)
export const getOrCreateChatRoom = (targetMemberNo) =>
  axios.post('http://localhost:8080/api/chat/rooms', { targetMemberNo }, authHeader());

// 채팅방 메시지 목록 조회 (페이징)
export const getChatMessages = (roomNo, page = 0, size = 30) =>
  axios.get(`http://localhost:8080/api/chat/rooms/${roomNo}/messages`, {
    params: { page, size },
    ...authHeader()
  });

// 메시지 읽음 처리
export const markMessagesRead = (roomNo) =>
  axios.put(`http://localhost:8080/api/chat/rooms/${roomNo}/read`, {}, authHeader());

// 채팅방 나가기
export const leaveChatRoom = (roomNo) =>
  axios.delete(`http://localhost:8080/api/chat/rooms/${roomNo}`, authHeader());