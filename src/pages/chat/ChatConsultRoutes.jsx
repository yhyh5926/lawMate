import React from "react";
import { Route } from "react-router-dom";

// 내가 만든 페이지 컴포넌트 import
import ChatListPage from "./ChatListPage";
import ChatRoomPage from "./ChatRoomPage";
import ConsultReservePage from "../consult/ConsultReservePage";
import ConsultListPage from "../mypage/ConsultListPage";
import PaymentPage from "../consult/PaymentPage";
import SettlementPage from "../mypage/SettlementPage";

const ChatConsultRoutes = [
  <Route key="chat-l" path="/chat/list" element={<ChatListPage />} />,
  <Route key="chat-r" path="/chat/room" element={<ChatRoomPage />} />,
  <Route
    key="con-res"
    path="/consult/reserve"
    element={<ConsultReservePage />}
  />,
  <Route
    key="my-con-l"
    path="/mypage/consult/list"
    element={<ConsultListPage />}
  />,
  <Route key="pay-p" path="/payment/pay" element={<PaymentPage />} />,
  <Route key="pay-r" path="/payment/refund" element={<div>환불 신청</div>} />,
  <Route
    key="my-set-l"
    path="/mypage/settlement/list"
    element={<SettlementPage />}
  />,
];

export default ChatConsultRoutes;
