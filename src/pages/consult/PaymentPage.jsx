import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/consult/PaymentPage.css"; // CSS 임포트

const PAYMENT_METHODS = [
  { value: "CARD", label: "💳 신용/체크카드" },
  { value: "TRANSFER", label: "🏦 계좌이체" },
  { value: "KAKAOPAY", label: "💛 카카오페이" },
];

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const consultNo = searchParams.get("consultId");
  const navigate = useNavigate();

  const [consult, setConsult] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("CARD");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!consultNo) return;
    axiosInstance
      .get(`/consult/${consultNo}`)
      .then((res) => setConsult(res.data.data))
      .catch((err) => console.error("consult 에러:", err));
  }, [consultNo]);

  const handlePayment = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaid(true);
    }, 1500);
  };

  if (!consult) {
    return <div className="payment-loading">데이터를 불러오는 중입니다...</div>;
  }

  const totalAmount = (consult.consultFee || 0) * (consult.durationMin / 30);

  // 결제 완료(성공) 화면
  if (paid) {
    return (
      <div className="payment-wrapper payment-success">
        <span className="success-icon">✅</span>
        <h2 className="success-title">결제가 완료되었습니다</h2>
        <p className="success-desc">
          {consult.lawyerName} 변호사와의 상담 예약이 확정되었습니다.
        </p>

        <div className="payment-info-card">
          <Row label="변호사" value={`${consult.lawyerName} 변호사`} />
          <Row label="상담 일시" value={consult.consultDate} />
          <Row label="상담 시간" value={`${consult.durationMin}분`} />
          <Row
            label="결제 수단"
            value={
              PAYMENT_METHODS.find((m) => m.value === selectedMethod)?.label
            }
          />
          <div className="payment-total-row">
            <span className="label">결제 금액</span>
            <span className="price">{totalAmount.toLocaleString()}원</span>
          </div>
        </div>

        <button
          className="payment-btn"
          onClick={() => navigate("/mypage/main")}
        >
          마이페이지에서 확인하기
        </button>
      </div>
    );
  }

  // 결제 진행 화면
  return (
    <div className="payment-wrapper">
      <h2 className="payment-title">결제하기</h2>

      <div className="payment-info-card">
        <h3>예약 확인</h3>
        <Row label="변호사" value={`${consult.lawyerName} 변호사`} />
        <Row label="상담 일시" value={consult.consultDate} />
        <Row label="상담 시간" value={`${consult.durationMin}분`} />
        <div className="payment-total-row">
          <span className="label">총 결제 금액</span>
          <span className="price">{totalAmount.toLocaleString()}원</span>
        </div>
      </div>

      <div className="method-section">
        <h3>결제 수단 선택</h3>
        <div className="method-list">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.value}
              className={`method-item ${selectedMethod === m.value ? "active" : ""}`}
            >
              <input
                type="radio"
                name="payMethod"
                value={m.value}
                checked={selectedMethod === m.value}
                onChange={() => setSelectedMethod(m.value)}
              />
              <span>{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      <p className="payment-notice">
        • 결제 완료 후 변호사가 확인하면 예약이 최종 확정됩니다.
        <br />• 상담 시작 24시간 전까지 마이페이지에서 취소 및 전액 환불이
        가능합니다.
      </p>

      <button
        className="payment-btn"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading
          ? "결제 처리 중..."
          : `${totalAmount.toLocaleString()}원 결제하기`}
      </button>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="payment-row">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

export default PaymentPage;
