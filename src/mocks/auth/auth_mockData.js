// src/mocks/auth/auth_mockData.js
// ================================
// 인증 및 유저 목업 데이터
// ================================

// ================================
// 일반 회원 계정
// ================================
export const AUTH_USERS = [
  {
    id: 'user1',
    password: '123',
    name: '김의뢰',
    email: 'user1@test.com',
    nickname: '억울한시민',
    phone: '01011112222',
    birthDate: '1990-05-20',
    role: 'USER', 
    status: 'APPROVED',
    is_deleted: 'N',
    myCases: [
      { id: 1, title: '전세 사기 피해 소송', status: '대기중', date: '2026-02-01' },
      { id: 2, title: '중고차 환불 건', status: '진행중', date: '2026-02-10' }
    ],
    scraps: ['변호사 박보검', '변호사 송중기'], 
    interests: ['사기', '보증금', '이혼'], 
    myPosts: [
      { id: 101, title: '전세금을 못 받고 있어요 ㅠㅠ', type: 'QNA', date: '2026-02-11' },
      { id: 102, title: '층간소음 법적 기준 투표', type: 'VOTE', date: '2026-02-12' }
    ]
  },
  {
    id: 'subin',
    password: '123',
    name: '이수빈',
    email: 'subin@naver.com',
    nickname: '일반회원',
    phone: '01012345678',
    birthDate: '1995-10-15',
    role: 'USER',
    status: 'APPROVED',
    is_deleted: 'N',
    myCases: [],
    scraps: [],
    interests: ['민사', '층간소음'],
    myPosts: [
      { id: 1, title: '층간소음 문제로 고소 가능한가요?', type: 'QNA', date: '2023-10-25' }
    ]
  },

// ================================
// 변호사 회원 계정
// ================================
  {
    id: 'lawyer_kang',
    password: '123',
    name: '강은혁',
    email: 'eunhyuk@lawmate.com',
    nickname: '방구쟁이변호사',
    role: 'LAWYER',
    status: 'APPROVED',
    is_deleted: 'N',
    licenseName: '제 12회 변호사시험 합격',
    education: '성균관대학교 로스쿨 졸업',
    licenseImage: 'license_kang.jpg',
    phone: '010-5678-1234',
    office: '서울 금천구 가산디지털2로 101 한라원앤원타워',
    myAnswers: [
      { 
        id: 101, 
        questionId: 1, 
        questionTitle: '층간소음 문제로 고소 가능한가요?', 
        content: '환경분쟁조정위원회를 통한 중재가 우선이며, 수인한도를 넘는 경우 손해배상 청구가 가능합니다.', 
        date: '2024-01-16', 
        selected: true 
      }
    ],
    myPosts: []
  },
  {
    id: 'lawyer1',
    password: '123',
    name: '박변호',
    email: 'lawyer1@test.com',
    nickname: '박변',
    role: 'LAWYER',
    status: 'APPROVED', 
    is_deleted: 'N',
    licenseName: '제 54회 사법시험 합격',
    education: '서울대학교 법학과 졸업',
    licenseImage: 'license_sample.jpg',
    phone: '010-1234-5678',
    office: '서울시 서초구 서초대로 123',
    myAnswers: [
      { id: 201, questionTitle: '폭행 합의금 문의', content: '합의는 신중해야 합니다...', date: '2026-02-12', selected: true },
      { id: 202, questionTitle: '전세금 반환', content: '내용증명부터 보내세요.', date: '2026-02-13', selected: false }
    ]
  },
  {
    id: 'lawyer_new',
    password: '123',
    name: '신입변',
    email: 'new@test.com',
    nickname: '열정변호사',
    role: 'LAWYER',
    status: 'PENDING', 
    is_deleted: 'N',
    licenseName: '제 13회 변호사시험 합격',
    education: '연세대 로스쿨',
    licenseImage: 'license_new.jpg',
    phone: '010-9876-5432',
    office: '서울시 강남구 테헤란로 456',
    myAnswers: []
  },

// ================================
// 관리자 계정
// ================================
  {
    id: 'admin',
    password: '123',
    name: '관리자',
    email: 'admin@lawmate.com',
    nickname: 'ADMIN',
    role: 'ADMIN',
    status: 'APPROVED',
    is_deleted: 'N',
  }
];

export const AUTH_REPORTS = [
  { id: 1, targetUser: 'bad_user', reason: '욕설 및 비방', date: '2026-02-13', proofImage: 'proof1.jpg', status: '대기' },
  { id: 2, targetUser: 'spammer', reason: '도배', date: '2026-02-12', proofImage: 'proof2.jpg', status: '처리완료' }
];