// src/pages/admin/AdminPaymentPage.jsx
// 설명: 관리자 - 플랫폼 전체 결제 및 정산 대기 목록 확인 화면
// 해결: 컴파일러의 경로 해석 오류를 방지하기 위해 adminApi 임포트 경로의 확장자를 제거했습니다.

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminPaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getPaymentList();
      // 백엔드 응답 구조(data.data 또는 data)에 맞게 안전하게 처리
      setPayments(response.data.data || response.data || []);
    } catch (error) {
      console.error("결제 목록 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b-2 border-gray-800 pb-4">결제/정산 관리</h2>
      
      {loading ? (
        <div className="py-20 text-center text-gray-500">결제 데이터를 불러오는 중입니다...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold">결제번호</th>
                <th className="p-4 font-bold">결제수단</th>
                <th className="p-4 font-bold text-right px-10">결제금액</th>
                <th className="p-4 font-bold">상태</th>
                <th className="p-4 font-bold">결제일시</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.paymentId} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono text-gray-500 text-xs">{p.paymentId}</td>
                  <td className="p-4 font-medium">{p.method}</td>
                  <td className="p-4 text-right px-10 font-bold text-gray-900">{p.amount?.toLocaleString()}원</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      p.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{p.createdAt?.split('T')[0]}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-20 text-gray-400">결제 내역이 존재하지 않습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentPage;