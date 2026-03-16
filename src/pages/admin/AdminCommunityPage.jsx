// src/pages/admin/AdminCommunityPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import { ExternalLink, Trash2 } from "lucide-react";
import "../../styles/admins/AdminCommunityPage.css"; // 💡 분리된 CSS 파일 임포트

const AdminCommunityPage = () => {
    const navigate = useNavigate();
    const [boardData, setBoardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL"); // ALL, POST, QUESTION, POLL

    useEffect(() => {
        fetchBoardData();
    }, []);

    const fetchBoardData = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getBoardList();
            // 💡 응답 데이터에서 polls 추가 수신
            const { posts, questions, polls } = response.data.data;

            // 1. 커뮤니티(일반 게시글) 데이터 정규화
            const normalizedPosts = (posts || []).map(p => ({
                id: p.postId,
                type: 'POST',
                typeLabel: '커뮤니티',
                badgeColor: '#e0e7ff',
                textColor: '#3730a3',
                title: p.title,
                author: p.name || `회원 ${p.memberId}`,
                status: p.status,
                createdAt: p.createdAt,
                detailUrl: `/community/detail/${p.postId}`
            }));

            // 2. 법률 Q&A 데이터 정규화
            const normalizedQs = (questions || []).map(q => ({
                id: q.questionId,
                type: 'QUESTION',
                typeLabel: '법률 Q&A',
                badgeColor: '#fce7f3',
                textColor: '#831843',
                title: q.title,
                author: q.memberName || `회원 ${q.memberId}`,
                status: q.status,
                createdAt: q.createdAt,
                detailUrl: `/question/detail/${q.questionId}`
            }));

            // 💡 3. 의견 조사(모의판결) 데이터 정규화 - pollId를 사용하도록 수정
            const normalizedPolls = (polls || []).map(poll => ({
                id: poll.pollId, // MyBatis 별칭으로 넘긴 pollId(66번 등) 매핑
                type: 'POLL',
                typeLabel: '의견 조사',
                badgeColor: '#fef3c7',
                textColor: '#b45309', // 노란빛 배지
                title: poll.title,
                author: poll.name || `회원 ${poll.memberId}`,
                status: poll.status,
                createdAt: poll.createdAt,
                // 💡 [해결] 마이페이지와 동일한 상세페이지 경로로 수정
                detailUrl: `/community/poll/detail/${poll.pollId}`
            }));

            // 모든 데이터를 합치고 최신 날짜순으로 정렬
            const combined = [...normalizedPosts, ...normalizedQs, ...normalizedPolls].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setBoardData(combined);
        } catch (error) {
            console.error("게시글 데이터 로드 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    // 관리자용 삭제 로직
    const handleDelete = async (item) => {
        if (!window.confirm(`[${item.typeLabel}] 해당 글을 정말 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.`)) return;

        try {
            const res = await adminApi.deleteBoardItem({ type: item.type, id: item.id });
            if (res.data.success) {
                alert("게시글이 성공적으로 삭제(비활성) 처리되었습니다.");
                fetchBoardData(); // 목록 새로고침
            }
        } catch (e) {
            alert("삭제 처리에 실패했습니다.");
        }
    };

    // 탭 필터 적용
    const filteredData = boardData.filter(item => {
        if (activeTab === "ALL") return true;
        return item.type === activeTab;
    });

    return (
        <div className="cm-wrap">
            {/* 탭 네비게이션 */}
            <div className="cm-tabs">
                <button
                    className={`cm-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ALL')}
                >
                    전체 글 보기
                </button>
                <button
                    className={`cm-tab-btn ${activeTab === 'POST' ? 'active' : ''}`}
                    onClick={() => setActiveTab('POST')}
                >
                    일반 커뮤니티
                </button>
                <button
                    className={`cm-tab-btn ${activeTab === 'QUESTION' ? 'active' : ''}`}
                    onClick={() => setActiveTab('QUESTION')}
                >
                    법률 상담 Q&A
                </button>
                <button
                    className={`cm-tab-btn ${activeTab === 'POLL' ? 'active' : ''}`}
                    onClick={() => setActiveTab('POLL')}
                >
                    의견 조사 판결 게시판
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8", fontWeight: "bold" }}>
                    데이터를 융합하는 중입니다...
                </div>
            ) : (
                <div className="cm-card">
                    <table className="cm-table">
                        <thead>
                            <tr>
                                <th style={{ width: "80px" }}>번호</th>
                                <th style={{ width: "120px" }}>구분(게시판)</th>
                                <th style={{ textAlign: "left" }}>게시글 제목</th>
                                <th style={{ width: "120px" }}>작성자</th>
                                <th style={{ width: "100px" }}>상태</th>
                                <th style={{ width: "120px" }}>작성일</th>
                                <th style={{ width: "160px" }}>관리 옵션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item, idx) => (
                                    <tr key={`${item.type}-${item.id}-${idx}`}>
                                        <td style={{ color: "#94a3b8", fontWeight: 700 }}>#{item.id}</td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{ background: item.badgeColor, color: item.textColor }}
                                            >
                                                {item.typeLabel}
                                            </span>
                                        </td>
                                        <td className="cm-title-cell">{item.title}</td>
                                        <td style={{ fontSize: "13px", color: "#64748b" }}>{item.author}</td>
                                        <td>
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                    color: item.status === "DELETED" || item.status === "CLOSED" ? "#dc2626" : "#059669"
                                                }}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "12px", color: "#94a3b8" }}>
                                            {item.createdAt?.split('T')[0] || item.createdAt?.split(' ')[0]}
                                        </td>
                                        <td>
                                            <div className="cm-actions">
                                                <button className="btn-link" onClick={() => navigate(item.detailUrl)}>
                                                    <ExternalLink size={12} /> 바로가기
                                                </button>
                                                <button className="btn-del" onClick={() => handleDelete(item)}>
                                                    <Trash2 size={12} /> 삭제
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ padding: "50px", color: "#94a3b8" }}>
                                        해당 탭에 등록된 게시물이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminCommunityPage;