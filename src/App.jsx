import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrecedentDetail from "./pages/precedent/PrecedentDetail";
import PrecedentPage from "./pages/precedent/PrecedentList";
import LawyerPage from "./pages/lawyer/LawyerList";
import LawyerDetail from "./pages/lawyer/LawyerDetail";
import Header from "./components/common/Header";
import ConsultForm from "./components/lawyer/ConsultForm";
import LoginPage from "./pages/auth/LoginPage";
import JoinPage from "./pages/auth/JoinPage";
import FindPage from "./pages/auth/FindPage";
import MyPageMain from "./pages/mypage/MyPageMain";
import MyPageEdit from "./pages/mypage/MyPageEdit";
import AdminPage from "./pages/admin/AdminPage";
import Home from "./pages/community/Home";
import QnaWrite from "./components/community/QnaWrite";
import QnaDetail from "./components/community/QnaDetail";
import VoteList from "./pages/community/VoteList";
import VoteWrite from "./components/community/VoteWrite";
import VoteDetail from "./components/community/VoteDetail";
import QnaList from "./pages/community/QnaList";
import Main from "./pages/main/Main";
import ChatPage from "./pages/chat/ChatPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
    <Route path="/" element={<Main />} />
        
         {/* --- [내 담당: 로그인/회원가입/마이페이지/관리자] --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/find/user" element={<FindPage />} />
          
          {/* 마이페이지 관련 라우터 */}
          <Route path="/mypage" element={<MyPageMain />} />
          <Route path="/mypage/edit" element={<MyPageEdit />} /> {/* [추가됨] */}

          <Route path="/admin" element={<AdminPage />} />


        <Route path="/precedent" element={<PrecedentPage />} />
        <Route path="/precedent/:id" element={<PrecedentDetail />} />
        <Route path="/lawyer" element={<LawyerPage />} />
        <Route path="/lawyer/:id" element={<LawyerDetail />} />
        <Route path="/consult/:lawyerId" element={<ConsultForm />} />
        <Route path="/community" element={<Home/>}/>
        <Route path="/community/qna" element={<QnaList/>}/>
        <Route path="/community/qna/write" element={<QnaWrite/>}/>
        <Route path="/community/qna/:id" element={<QnaDetail/>}/>
        <Route path="/community/vote" element={<VoteList/>}/>
        <Route path="/community/vote/write" element={<VoteWrite/>}/>
        <Route path="/community/vote/:id" element={<VoteDetail/>}/>

             <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:roomId" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
