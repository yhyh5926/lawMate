import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminReportDetailPage() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  
  // 제재 폼 데이터
  const [sanction, setSanction] = useState({
    sanctionType: 'WARNING',
    reason: '',
    durationDays: 0 // SUSPEND 시 정지 기간
  });

  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`http://localhost:8080/api/admin/report/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReport(res.data.data);
        setSanction((prev) => ({ ...prev, reason: res.data.data.reason }));
      } catch (error) {
        alert('신고 내역을 불러오지 못했습니다.');
      }
    };
    if (reportId) fetchReportDetail();
  }, [reportId]);

  const handleAction = async (status) => {
    // status: 'DISMISSED' (기각), 'RESOLVED' (제재 처리)
    if (!window.confirm(`해당 신고를 [${status === 'RESOLVED' ? '제재 처리' : '기각'}] 하시겠습니까?`)) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:8080/api/admin/report/handle', {
        reportId: report.reportId,
        status: status,
        targetMemberId: report.targetMemberId, // DB 조인을 통해 가져온 대상 회원 ID 가정
        sanctionData: status === 'RESOLVED' ? sanction : null // RESOLVED 일때만 제재 정보 전송
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('처리가 완료되었습니다.');
      navigate('/admin/report/list.do');
    } catch (error) {
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  if (!report) return <div className="p-6">로딩중...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">신고 상세 및 제재 처리</h2>

      {/* 신고 내용 섹션 */}
      <div className="bg-white p-6 border rounded-md shadow-sm mb-6">
        <h3 className="font-bold text-lg mb-4 border-b pb-2">신고 정보</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-semibold text-gray-500 w-24 inline-block">신고번호</span> {report.reportId}</div>
          <div><span className="font-semibold text-gray-500 w-24 inline-block">접수일시</span> {report.createdAt}</div>
          <div><span className="font-semibold text-gray-500 w-24 inline-block">신고자</span> {report.reporterId}</div>
          <div><span className="font-semibold text-gray-500 w-24 inline-block">현재상태</span> <span className="text-red-600 font-bold">{report.status}</span></div>
          <div className="col-span-2"><span className="font-semibold text-gray-500 w-24 inline-block">대상 유형</span> {report.targetType} (ID: {report.targetId})</div>
          <div className="col-span-2"><span className="font-semibold text-gray-500 w-24 inline-block">신고 사유</span> {report.reason}</div>
          <div className="col-span-2">
            <span className="font-semibold text-gray-500 block mb-2">상세 내용</span>
            <div className="bg-gray-50 p-3 rounded border whitespace-pre-wrap">{report.detail}</div>
          </div>
        </div>
      </div>

      {/* 제재 처리 섹션 (PENDING 상태일 때만 노출) */}
      {report.status === 'PENDING' && (
        <div className="bg-red-50 p-6 border border-red-200 rounded-md shadow-sm">
          <h3 className="font-bold text-lg text-red-700 mb-4 border-b border-red-200 pb-2">제재 조치 (TB_SANCTION)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">제재 유형</label>
              <select 
                className="w-full border p-2 rounded"
                value={sanction.sanctionType} 
                onChange={(e) => setSanction({...sanction, sanctionType: e.target.value})}
              >
                <option value="WARNING">경고 (WARNING)</option>
                <option value="SUSPEND">이용정지 (SUSPEND)</option>
                <option value="FORCE_WITHDRAW">강제탈퇴 (FORCE_WITHDRAW)</option>
              </select>
            </div>

            {sanction.sanctionType === 'SUSPEND' && (
              <div>
                <label className="block text-sm font-semibold mb-1">정지 기간 (일)</label>
                <input 
                  type="number" className="w-full border p-2 rounded" placeholder="예: 7"
                  value={sanction.durationDays} onChange={(e) => setSanction({...sanction, durationDays: e.target.value})}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-1">관리자 처리 메모 / 제재 사유</label>
              <textarea 
                className="w-full border p-2 rounded resize-none" rows="3"
                value={sanction.reason} onChange={(e) => setSanction({...sanction, reason: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button onClick={() => handleAction('DISMISSED')} className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              신고 기각 (무혐의)
            </button>
            <button onClick={() => handleAction('RESOLVED')} className="px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">
              제재 확정 및 처리
            </button>
          </div>
        </div>
      )}
    </div>
  );
}