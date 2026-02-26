import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPaymentPage() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING_SETTLE (정산대기)

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      // 백엔드에서 TB_PAYMENT와 TB_SETTLEMENT를 조인하여 가져온다고 가정
      const res = await axios.get('http://localhost:8080/api/admin/payment/list', {
        params: { filter },
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data.data.list || []);
    } catch (error) {
      console.error('결제/정산 목록 로딩 실패', error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  // 정산 일괄 처리 (TB_SETTLEMENT 의 SETTLE_STATUS를 SETTLED로 변경)
  const handleBatchSettle = async () => {
    const confirm = window.confirm('정산 대기 건에 대해 일괄 정산 처리를 진행하시겠습니까?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:8080/api/admin/settlement/batch', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('일괄 정산 처리가 완료되었습니다.');
      fetchPayments(); // 목록 갱신
    } catch (error) {
      alert('정산 처리 중 오류가 발생했습니다.');
    }
  };

  // 개별 환불 처리
  const handleRefund = async (paymentId) => {
    if (!window.confirm('해당 결제 건을 환불 처리하시겠습니까?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`http://localhost:8080/api/admin/payment/refund/${paymentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('환불이 완료되었습니다.');
      fetchPayments();
    } catch (error) {
      alert('환불 처리에 실패했습니다.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">결제 및 정산 관리</h2>
        <button onClick={handleBatchSettle} className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700">
          정산 대기 건 일괄 처리
        </button>
      </div>
      
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded border ${filter === 'ALL' ? 'bg-gray-800 text-white' : 'bg-white'}`}>전체 내역</button>
        <button onClick={() => setFilter('PENDING_SETTLE')} className={`px-4 py-2 rounded border ${filter === 'PENDING_SETTLE' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}>정산 대기 건만 보기</button>
      </div>

      <table className="w-full border-collapse border text-center text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">결제번호</th>
            <th className="border p-2">결제일시</th>
            <th className="border p-2">결제수단</th>
            <th className="border p-2">결제금액</th>
            <th className="border p-2">결제상태</th>
            <th className="border p-2">전문가(대상)</th>
            <th className="border p-2">정산상태</th>
            <th className="border p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? payments.map(p => (
            <tr key={p.paymentId} className="hover:bg-gray-50">
              <td className="border p-2">{p.paymentId}</td>
              <td className="border p-2">{p.paidAt?.substring(0, 16)}</td>
              <td className="border p-2">{p.payMethod}</td>
              <td className="border p-2 font-bold">{p.amount?.toLocaleString()}원</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-xs ${p.payStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {p.payStatus}
                </span>
              </td>
              <td className="border p-2">{p.lawyerName}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-xs ${p.settleStatus === 'SETTLED' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                  {p.settleStatus === 'SETTLED' ? '정산완료' : '정산대기'}
                </span>
              </td>
              <td className="border p-2">
                {p.payStatus === 'PAID' && p.settleStatus !== 'SETTLED' && (
                  <button onClick={() => handleRefund(p.paymentId)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                    환불
                  </button>
                )}
              </td>
            </tr>
          )) : (
            <tr><td colSpan="8" className="border p-4 text-gray-500">조회된 결제 내역이 없습니다.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}