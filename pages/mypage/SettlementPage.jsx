import React, { useState, useEffect } from 'react';
import { getSettlementList, getSettlementChart } from '../../api/paymentApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const STATUS_META = {
  PENDING:   { label: '정산대기', color: '#FF9500', bg: '#FFF3E0' },
  COMPLETED: { label: '정산완료', color: '#34C759', bg: '#E8F8ED' },
};

const SettlementPage = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [settlements, setSettlements] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [year, month]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listRes, chartRes] = await Promise.all([
        getSettlementList(year, month),
        getSettlementChart(),
      ]);
      setSettlements(listRes.data.data || []);
      setChartData(chartRes.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = settlements.reduce((sum, s) => sum + (s.settlementAmount || 0), 0);
  const totalFee = settlements.reduce((sum, s) => sum + (s.fee || 0), 0);
  const totalPayment = settlements.reduce((sum, s) => sum + (s.paymentAmount || 0), 0);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '28px 16px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '24px' }}>
        정산 내역
      </h2>

      {/* 월별 차트 */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #E8ECF0',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '28px',
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#444', margin: '0 0 16px' }}>
          월별 정산 현황
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#888' }}
                tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
              />
              <Tooltip
                formatter={(v) => [`${v.toLocaleString()}원`, '정산액']}
                labelStyle={{ fontWeight: 700 }}
              />
              <Bar dataKey="settlementAmount" fill="#1A6DFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>
            데이터가 없습니다
          </div>
        )}
      </div>

      {/* 연월 필터 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={selectStyle}
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          style={selectStyle}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m}월</option>
          ))}
        </select>
      </div>

      {/* 요약 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <SummaryCard label="총 결제액" value={totalPayment} color="#444" />
        <SummaryCard label="수수료" value={totalFee} color="#FF3B30" />
        <SummaryCard label="정산 예정액" value={totalAmount} color="#1A6DFF" />
      </div>

      {/* 목록 테이블 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>불러오는 중...</div>
      ) : settlements.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '50px',
            background: '#F7F9FB',
            borderRadius: '14px',
            color: '#aaa',
          }}
        >
          해당 월 정산 내역이 없습니다
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#F7F9FB' }}>
                {['상담 일자', '의뢰인', '결제 금액', '수수료', '정산 금액', '상태'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 14px',
                      textAlign: 'left',
                      fontWeight: '700',
                      color: '#666',
                      borderBottom: '1px solid #E8ECF0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {settlements.map((s) => {
                const meta = STATUS_META[s.status] || STATUS_META.PENDING;
                return (
                  <tr
                    key={s.settlementNo}
                    style={{ borderBottom: '1px solid #F0F2F5', transition: 'background 0.1s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F7F9FB')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                  >
                    <td style={tdStyle}>{s.consultDate}</td>
                    <td style={tdStyle}>{s.memberName}</td>
                    <td style={tdStyle}>{s.paymentAmount?.toLocaleString()}원</td>
                    <td style={{ ...tdStyle, color: '#FF3B30' }}>-{s.fee?.toLocaleString()}원</td>
                    <td style={{ ...tdStyle, fontWeight: '700', color: '#1A6DFF' }}>
                      {s.settlementAmount?.toLocaleString()}원
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background: meta.bg,
                          color: meta.color,
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div
    style={{
      background: '#fff',
      border: '1px solid #E8ECF0',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>{label}</div>
    <div style={{ fontSize: '18px', fontWeight: '800', color }}>{value.toLocaleString()}원</div>
  </div>
);

const selectStyle = {
  padding: '8px 14px',
  border: '1.5px solid #D0D8E4',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  cursor: 'pointer',
};

const tdStyle = {
  padding: '12px 14px',
  color: '#444',
};

export default SettlementPage;
