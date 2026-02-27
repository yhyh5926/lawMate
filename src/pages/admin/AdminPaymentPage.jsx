// vs코드
// 파일 위치: src/pages/admin/AdminPaymentPage.jsx
// 설명: 관리자 - 플랫폼 전체 결제 및 정산 대기 목록 확인 화면 (모의 데이터 기반)

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminPaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await adminApi.getPaymentList();
      setPayments(response.data.data || []);
    } catch (error) {
      console.error("결제 목록 조회 실패", error);
      // 모의 데이터
      setPayments([
        { paymentId: "PAY_001", amount: 50000, method: "CARD", status: "COMPLETED", createdAt: "2026-02-26" },
        { paymentId: "PAY_002", amount: 30000, method: "KAKAOPAY", status: "REFUNDED", createdAt: "2026-02-25" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ borderBottom: "2px solid #333", paddingBottom: "10px" }}>결제/정산 관리</h2>
      
      {loading ? (
        <div style={{ padding: "50px", textAlign: "center" }}>데이터를 불러오는 중입니다...</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={thStyle}>결제번호</th>
              <th style={thStyle}>결제수단</th>
              <th style={thStyle}>결제금액</th>
              <th style={thStyle}>상태</th>
              <th style={thStyle}>결제일시</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.paymentId} style={{ borderBottom: "1px solid #eee", textAlign: "center" }}>
                <td style={tdStyle}>{p.paymentId}</td>
                <td style={tdStyle}>{p.method}</td>
                <td style={tdStyle}>{p.amount.toLocaleString()}원</td>
                <td style={{ ...tdStyle, color: p.status === 'COMPLETED' ? 'blue' : 'red', fontWeight: 'bold' }}>
                  {p.status}
                </td>
                <td style={tdStyle}>{p.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px" };
const thStyle = { padding: "12px", borderBottom: "2px solid #ddd" };
const tdStyle = { padding: "12px" };

export default AdminPaymentPage;