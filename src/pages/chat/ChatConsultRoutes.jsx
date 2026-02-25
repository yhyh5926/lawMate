import React from "react";
import { Route } from "react-router-dom";

const ChatConsultRoutes = [
  <Route key="chat-l" path="/chat/list.do" element={<div>채팅방 목록</div>} />,
  <Route key="chat-r" path="/chat/room.do" element={<div>1:1 채팅방</div>} />,
  <Route
    key="con-res"
    path="/consult/reserve.do"
    element={<div>상담 예약</div>}
  />,
  <Route
    key="my-con-l"
    path="/mypage/consult/list.do"
    element={<div>예약 목록</div>}
  />,
  <Route key="pay-p" path="/payment/pay.do" element={<div>결제</div>} />,
  <Route
    key="pay-r"
    path="/payment/refund.do"
    element={<div>환불 신청</div>}
  />,
  <Route
    key="my-set-l"
    path="/mypage/settlement/list.do"
    element={<div>정산 내역</div>}
  />,
];

export default ChatConsultRoutes;
