import { AUTH_USERS, AUTH_REPORTS } from '../mocks/auth/auth_mockData';

// 메모리상에서 데이터 조작을 위해 로컬 변수에 복사
let users = [...AUTH_USERS];
let reports = [...AUTH_REPORTS];

export const authApi = {
  // [로그인]
  login: async (id, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.id === id && u.password === password && u.is_deleted === 'N');
        if (user) {
          if (user.role === 'LAWYER' && user.status === 'PENDING') {
            reject('관리자 승인 대기 중인 변호사 계정입니다.');
          } else if (user.status === 'BANNED') {
            reject('관리자에 의해 정지된 계정입니다.');
          } else {
            // 토큰 발급 시늉
            resolve({ ...user, token: 'mock-jwt-token-12345' });
          }
        } else {
          reject('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
      }, 500);
    });
  },

  // [회원가입]
  join: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          ...userData,
          status: userData.role === 'LAWYER' ? 'PENDING' : 'APPROVED', // 변호사는 승인 대기
          is_deleted: 'N',
          myCases: [],
          myPosts: [],
          scraps: [],
          myAnswers: []
        };
        users.push(newUser);
        console.log("Current DB Users:", users); 
        resolve({ success: true, message: '가입 완료' });
      }, 500);
    });
  },

  // [아이디 찾기]
  findId: async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.is_deleted === 'N');
        user ? resolve(user.id) : reject('해당 이메일로 가입된 사용자가 없습니다.');
      }, 500);
    });
  },

  // [비밀번호 찾기 (임시)]
  findPw: async (id, email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.id === id && u.email === email && u.is_deleted === 'N');
        user ? resolve(user.password) : reject('정보가 일치하지 않습니다.');
      }, 500);
    });
  },

  // [회원 정보 수정] (추가된 기능)
  updateUser: async (updatedData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = users.findIndex(u => u.id === updatedData.id);
        if (index !== -1) {
          // 기존 데이터에 새로운 데이터 덮어쓰기
          users[index] = { ...users[index], ...updatedData };
          resolve(users[index]); 
        } else {
          reject("사용자를 찾을 수 없습니다.");
        }
      }, 500);
    });
  },

  // --- 관리자 기능 ---

  // 승인 대기 변호사 조회
  getPendingLawyers: async () => {
    return users.filter(u => u.role === 'LAWYER' && u.status === 'PENDING');
  },

  // 변호사 승인
  approveLawyer: async (userId) => {
    users = users.map(u => u.id === userId ? { ...u, status: 'APPROVED' } : u);
    return true;
  },

  // 신고 목록 조회
  getReports: async () => {
    return reports;
  },

  // 유저 정지
  banUser: async (targetId) => {
    users = users.map(u => u.id === targetId ? { ...u, status: 'BANNED' } : u);
    return true;
  },

  // 회원 탈퇴 (Soft Delete)
  leaveUser: async (userId) => {
     users = users.map(u => u.id === userId ? { ...u, is_deleted: 'Y' } : u);
     return true;
  }
};