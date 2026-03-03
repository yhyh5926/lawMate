// src/pages/admin/AdminPaymentPage.jsx

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminPaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getPaymentList();
      setPayments(response.data.data || response.data || []);
    } catch (error) {
      console.error("결제 목록 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = payments.filter(p => p.status === 'COMPLETED').reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <>
      <style>{`
        .pp-wrap { font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif; }

        .pp-summary {
          display: flex; gap: 14px; margin-bottom: 24px;
        }
        .pp-sum-card {
          flex: 1; background: #fff; border-radius: 12px; padding: 18px 22px;
          border: 1px solid #e2e8f0;
        }
        .pp-sum-label { font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
        .pp-sum-val { font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 4px; }
        .pp-sum-val.blue { color: #2563eb; }

        .pp-card { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; }
        .pp-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .pp-table thead tr { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .pp-table th { padding: 13px 16px; font-weight: 700; color: #475569; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.6px; text-align: left; }
        .pp-table th.right { text-align: right; }
        .pp-table th.center { text-align: center; }
        .pp-table tbody tr { border-bottom: 1px solid #f1f5f9; transition: background 0.1s; }
        .pp-table tbody tr:hover { background: #f8fafc; }
        .pp-table tbody tr:last-child { border-bottom: none; }
        .pp-table td { padding: 14px 16px; color: #334155; vertical-align: middle; }
        .pp-table td.right { text-align: right; }
        .pp-table td.center { text-align: center; }

        .pp-id { font-size: 11.5px; color: #94a3b8; font-family: monospace; }
        .pp-amount { font-size: 14px; font-weight: 800; color: #0f172a; }
        .pp-date { font-size: 12.5px; color: #94a3b8; }

        .pp-status-completed { display:inline-block; padding:3px 10px; background:#dcfce7; color:#15803d; border-radius:20px; font-size:11.5px; font-weight:700; }
        .pp-status-failed    { display:inline-block; padding:3px 10px; background:#fee2e2; color:#dc2626; border-radius:20px; font-size:11.5px; font-weight:700; }

        .pp-empty { padding:60px; text-align:center; color:#94a3b8; font-weight:600; }
        .pp-loading { padding:60px; text-align:center; color:#94a3b8; font-weight:600; }
      `}</style>

      <div className="pp-wrap">
        <div className="pp-summary">
          <div className="pp-sum-card">
            <div className="pp-sum-label">전체 결제 건수</div>
            <div className="pp-sum-val">{payments.length}<span style={{fontSize:14,fontWeight:500,color:'#94a3b8',marginLeft:4}}>건</span></div>
          </div>
          <div className="pp-sum-card">
            <div className="pp-sum-label">완료 결제 합계</div>
            <div className="pp-sum-val blue">{totalAmount.toLocaleString()}<span style={{fontSize:14,fontWeight:500,color:'#94a3b8',marginLeft:4}}>원</span></div>
          </div>
        </div>

        {loading ? (
          <div className="pp-loading">결제 데이터를 불러오는 중입니다...</div>
        ) : (
          <div className="pp-card">
            <table className="pp-table">
              <thead>
                <tr>
                  <th>결제번호</th>
                  <th>결제수단</th>
                  <th className="right">결제금액</th>
                  <th className="center">상태</th>
                  <th>결제일시</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? payments.map((p) => (
                  <tr key={p.paymentId}>
                    <td><span className="pp-id">{p.paymentId}</span></td>
                    <td style={{fontWeight:600}}>{p.method}</td>
                    <td className="right"><span className="pp-amount">{p.amount?.toLocaleString()}원</span></td>
                    <td className="center">
                      {p.status === 'COMPLETED'
                        ? <span className="pp-status-completed">완료</span>
                        : <span className="pp-status-failed">{p.status}</span>}
                    </td>
                    <td><span className="pp-date">{p.createdAt?.split('T')[0]}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="pp-empty">결제 내역이 존재하지 않습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPaymentPage;
