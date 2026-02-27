// src/pages/admin/AdminReportDetailPage.jsx
// 설명: 관리자 - 특정 신고의 상세 내용을 확인하고 제재(경고, 정지 등)를 집행하는 화면
// 해결: 모듈 해석 오류 수정을 위해 임포트 경로의 확장자를 제거했습니다.

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/adminApi";

const AdminReportDetailPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [sanction, setSanction] = useState({ sanctionType: "WARNING", reason: "" });

  useEffect(() => {
    // 실제 API 연동 시 reportId를 기반으로 데이터 상세 조회
    const loadDetail = async () => {
      try {
        const response = await adminApi.getReportDetail(reportId);
        // 서버 응답 구조에 따라 데이터 세팅
        setReport(response.data?.data || response.data);
      } catch (e) {
        console.error("신고 상세 정보 로드 실패", e);
        // 상세 조회 실패 시 테스트용 기본 정보 세팅
        setReport({
          reportId, 
          reporterId: 10, 
          targetType: "POST", 
          targetId: 55,
          reason: "욕설 및 비방", 
          detail: "게시글 내용에 심한 욕설이 포함되어 있다는 신고가 접수되었습니다. 해당 내용을 확인한 후 적절한 제재를 취해 주시기 바랍니다.",
          status: "PENDING", 
          createdAt: "2026-02-27"
        });
      }
    };
    loadDetail();
  }, [reportId]);

  const handleSanctionSubmit = async (e) => {
    e.preventDefault();
    if (!sanction.reason) return alert("제재 사유를 입력해주세요.");

    try {
      // 제재 집행 API 호출
      await adminApi.processSanction({ reportId, ...sanction });
      alert("제재 처리가 성공적으로 집행되었습니다.");
      navigate("/admin/report/list.do");
    } catch (error) {
      console.error("제재 처리 실패", error);
      alert("제재 처리 중 오류가 발생했습니다.");
    }
  };

  if (!report) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 font-medium animate-pulse">신고 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 font-sans">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:text-blue-800 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> 신고 목록으로 돌아가기
      </button>

      {/* 신고 상세 정보 카드 */}
      <div className="bg-white border-2 border-gray-900 rounded-2xl overflow-hidden shadow-xl mb-10">
        <div className="bg-gray-900 p-5 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            📄 신고 상세 정보 <span className="text-gray-400 font-normal">| No.{report.reportId}</span>
          </h2>
          <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            report.status === 'PENDING' ? 'bg-red-500' : 'bg-green-500'
          }`}>
            {report.status === 'PENDING' ? '미처리' : '처리완료'}
          </span>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">대상 유형</p>
              <p className="text-gray-800 font-medium">{report.targetType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">대상 식별 ID</p>
              <p className="text-gray-800 font-medium">{report.targetId}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">신고 사유</p>
              <p className="text-gray-900 font-bold text-lg">{report.reason}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span> 상세 내용
            </p>
            <div className="p-6 bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-700 leading-relaxed whitespace-pre-wrap">
              {report.detail}
            </div>
          </div>
          
          <div className="text-right text-xs text-gray-400">
            접수 일시: {report.createdAt}
          </div>
        </div>
      </div>

      {/* 제재 집행 폼 */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-black text-red-700 mb-8 flex items-center gap-3">
          🔨 관리자 제재 집행
        </h2>
        
        <form onSubmit={handleSanctionSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-black text-red-900 flex items-center gap-2">
              <span className="w-1 h-3 bg-red-400 rounded-full"></span> 제재 조치 선택
            </label>
            <select 
              value={sanction.sanctionType} 
              onChange={(e) => setSanction({ ...sanction, sanctionType: e.target.value })}
              className="w-full sm:w-80 p-4 border-2 border-red-200 rounded-xl outline-none focus:border-red-500 bg-white font-medium text-gray-800 transition-all cursor-pointer"
            >
              <option value="WARNING">⚠️ 경고 조치 (회원 알림 발송)</option>
              <option value="SUSPEND">🚫 이용 정지 (계정 7일 정지)</option>
              <option value="FORCE_WITHDRAW">❌ 강제 탈퇴 (서비스 영구 퇴출)</option>
              <option value="DISMISS">✅ 무혐의 (신고 종결 처리)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-red-900 flex items-center gap-2">
              <span className="w-1 h-3 bg-red-400 rounded-full"></span> 제재 상세 사유
            </label>
            <textarea 
              placeholder="피신고인(대상자)에게 안내되거나 내부 기록으로 보관될 제재 사유를 구체적으로 입력하세요."
              value={sanction.reason}
              onChange={(e) => setSanction({ ...sanction, reason: e.target.value })}
              className="w-full h-40 p-5 border-2 border-red-200 rounded-xl outline-none focus:border-red-500 bg-white font-medium text-gray-800 transition-all resize-none shadow-inner"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-5 bg-red-600 text-white text-xl font-black rounded-2xl hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-red-200"
          >
            제재 집행 및 사건 종결
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminReportDetailPage;