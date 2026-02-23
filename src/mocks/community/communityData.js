// src/mockData.js

export const MOCK_QNA_LIST = [
  {
    id: 1,
    title: "층간소음 문제로 고소 가능한가요?",
    writerName: "이수빈",
    tags: "#민사 #층간소음",
    content: "윗집에서 매일 밤마다 운동기구를 사용하는 소리가 들립니다. 법적으로 해결할 방법이 있을까요?",
    isAdopted: true,
    createdAt: "2023-10-25"
  },
  {
    id: 2,
    title: "중고거래 사기를 당했습니다.",
    writerName: "김원석",
    tags: "#형사 #중고거래 #사기",
    content: "입금 후 판매자가 연락을 끊고 잠적했습니다. 더치트 등록은 했는데 경찰서에 가야 하나요?",
    isAdopted: false,
    createdAt: "2023-10-26"
  }
];

export const MOCK_ANSWERS = [
  {
    id: 101,
    postId: 1,
    lawyerName: "강은혁 변호사",
    content: "환경분쟁조정위원회를 통한 중재가 우선이며, 수인한도를 넘는 경우 손해배상 청구가 가능합니다.",
    isAdopted: true
  }
];

export const MOCK_VOTE_LIST = [
  {
    id: 1,
    title: "주차장 문콕, 수리비 100% 청구 가능한가?",
    optA: "전액 보상해야 한다",
    optB: "과실 비율을 따져야 한다",
    countA: 150,
    countB: 45,
    totalCount: 195,
    content: "좁은 주차장에서 옆 차가 문을 세게 열어 흠집이 생겼습니다. 어떻게 생각하시나요?"
  },
  {
    id: 2,
    title: "반려견 산책 중 입마개 의무화 찬반",
    optA: "모든 견종 의무화",
    optB: "맹견만 의무화",
    countA: 80,
    countB: 120,
    totalCount: 200,
    content: "공공장소 산책 시 모든 강아지에게 입마개를 씌워야 한다는 주장에 대해 투표해주세요."
  }
];