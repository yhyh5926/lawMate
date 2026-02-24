import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPaymentOrder, verifyPayment, requestRefund } from '../../api/paymentApi';
import axiosInstance from '../../api/axiosInstance';

const PAYMENT_METHODS = [
  { value: 'CARD',       label: '💳 신용/체크카드',  pgCode: 'card' },
  { value: 'TRANSFER',   label: '🏦 계좌이체',       pgCode: 'trans' },
  { value: 'KAKAOPAY',  label: '💛 카카오페이',      pgCode: 'kakaopay' },
];

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const consultNo = searchParams.get('consultNo');
  const navigate = useNavigate();

  const [consult, setConsult] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('CARD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!consultNo) return;
    axiosInstance.get(`/api/consult/${consultNo}`).then((res) => {
      setConsult(res.data.data);
    });
  }, [consultNo]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      // 1. 서버에서 주문 생성
      const orderRes = await createPaymentOrder(consultNo);
      const { merchantUid, amount, orderName } = orderRes.data.data;

      // 2. 포트원 PG 결제창 호출
      if (!window.IMP) {
        alert('PG 모듈 로드 실패. 잠시 후 다시 시도해주세요.');
        return;
      }
      window.IMP.init(import.meta.env.VITE_IMP_CODE);

      const pgMethod = PAYMENT_METHODS.find((m) => m.value === selectedMethod);

      window.IMP.request_pay(
        {
          pg: pgMethod.pgCode,
          pay_method: pgMethod.pgCode,
          merchant_uid: merchantUid,
          name: orderName,
          amount,
          buyer_name: consult?.memberName,
          buyer_tel: consult?.memberPhone,
        },
        async (rsp) => {
          if (rsp.success) {
            // 3. 서버 검증
            await verifyPayment(rsp.imp_uid, rsp.merchant_uid);
            alert('결제가 완료되었습니다!');
            navigate('/mypage/consult/list.do');
          } else {
            alert(`결제 실패: ${rsp.error_msg}`);
          }
          setLoading(false);
        }
      );
    } catch (e) {
      alert(e.response?.data?.message || '결제 오류');
      setLoading(false);
    }
  };

  if (!consult) {
    return <div style={{ textAlign: 'center', padding: '60px' }}>불러오는 중...</div>;
  }

  const totalAmount = (consult.consultFee || 0) * (consult.duration / 60);

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 16px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E', marginBottom: '28px' }}>
        결제
      </h2>

      {/* 주문 정보 */}
      <div
        style={{
          background: '#F7F9FB',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#888', margin: '0 0 14px' }}>
          예약 정보
        </h3>
        <Row label="변호사" value={`${consult.lawyerName} 변호사`} />
        <Row label="상담 일시" value={`${consult.consultDate} ${consult.consultTime}`} />
        <Row label="상담 시간" value={`${consult.duration}분`} />
        <div
          style={{
            borderTop: '1px dashed #D0D8E4',
            marginTop: '12px',
            paddingTop: '12px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontWeight: '700', fontSize: '15px' }}>결제 금액</span>
          <span style={{ fontWeight: '800', fontSize: '20px', color: '#1A6DFF' }}>
            {totalAmount.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 결제 수단 */}
      <div style={{ marginBottom: '28px' }}>
        <h3
          style={{ fontSize: '14px', fontWeight: '700', color: '#444', margin: '0 0 12px' }}
        >
          결제 수단
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                border: '1.5px solid',
                borderColor: selectedMethod === m.value ? '#1A6DFF' : '#E0E6EF',
                borderRadius: '12px',
                cursor: 'pointer',
                background: selectedMethod === m.value ? '#F0F4FF' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio"
                name="payMethod"
                value={m.value}
                checked={selectedMethod === m.value}
                onChange={() => setSelectedMethod(m.value)}
                style={{ accentColor: '#1A6DFF' }}
              />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 안내 문구 */}
      <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '20px', lineHeight: '1.6' }}>
        결제 버튼 클릭 시 PG사 결제창이 열립니다. 결제 완료 후 상담이 확정됩니다.
        <br />
        환불은 상담 24시간 전까지 전액 환불이 가능합니다.
      </p>

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          background: loading ? '#aaa' : '#1A6DFF',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: loading ? 'default' : 'pointer',
        }}
      >
        {loading ? '처리 중...' : `${totalAmount.toLocaleString()}원 결제하기`}
      </button>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '14px',
      marginBottom: '8px',
    }}
  >
    <span style={{ color: '#888' }}>{label}</span>
    <span style={{ fontWeight: '600', color: '#1A1A2E' }}>{value}</span>
  </div>
);

export default PaymentPage;
