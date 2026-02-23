// src/utils/chatUtils.js
import { ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../firebase';

/**
 * 1:1 채팅방 생성 (또는 기존 채팅방 반환)
 *
 * @param {Object} params
 * @param {string} params.userId      - 현재 로그인 유저 ID
 * @param {string} params.userName    - 현재 로그인 유저 이름
 * @param {string} params.targetId    - 상대방 ID (변호사 등)
 * @param {string} params.targetName  - 상대방 이름
 * @returns {Promise<string>} roomId
 *
 * 사용 예시 (변호사 상세페이지에서):
 *   import { createOrGetChatRoom } from '../../utils/chatUtils';
 *
 *   const handleConsult = async () => {
 *     const roomId = await createOrGetChatRoom({
 *       userId: user.id,
 *       userName: user.name,
 *       targetId: lawyer.id,
 *       targetName: lawyer.name,
 *     });
 *     navigate(`/chat/${roomId}`);
 *   };
 */
export const createOrGetChatRoom = async ({ userId, userName, targetId, targetName }) => {
  // 두 사용자 ID를 정렬하여 고유 키 생성 (중복 방지)
  const sortedIds = [String(userId), String(targetId)].sort();
  const pairKey = sortedIds.join('_');

  // 기존 채팅방 확인
  const roomsRef = ref(db, 'chatRooms');
  const snapshot = await get(roomsRef);

  if (snapshot.exists()) {
    const rooms = snapshot.val();
    for (const [roomId, room] of Object.entries(rooms)) {
      if (room.info?.pairKey === pairKey) {
        return roomId; // 기존 채팅방 반환
      }
    }
  }

  // 새 채팅방 생성
  const newRoomRef = push(roomsRef);
  await set(newRoomRef, {
    info: {
      pairKey,
      participants: {
        [String(userId)]: userName,
        [String(targetId)]: targetName,
      },
      createdAt: Date.now(),
    },
    messages: {},
  });

  return newRoomRef.key;
};
