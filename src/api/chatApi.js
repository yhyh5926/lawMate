import axiosInstance from './axiosInstance';

// 채팅방 목록 조회
export const getChatRooms = () =>
  axiosInstance.get('/chat/rooms');

// 채팅방 생성 또는 조회 (상대방 memberNo로)
export const getOrCreateChatRoom = (targetMemberNo) =>
  axiosInstance.post('/chat/rooms', { targetMemberNo });

// 채팅방 메시지 목록 조회 (페이징)
export const getChatMessages = (roomNo, page = 0, size = 30) =>
  axiosInstance.get(`/chat/rooms/${roomNo}/messages`, { params: { page, size } });

// 메시지 읽음 처리
export const markMessagesRead = (roomNo) =>
  axiosInstance.put(`/chat/rooms/${roomNo}/read`);

// 채팅방 나가기
export const leaveChatRoom = (roomNo) =>
  axiosInstance.delete(`/chat/rooms/${roomNo}`);