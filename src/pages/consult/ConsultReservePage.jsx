import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createConsult, getAvailableTimes } from "../../api/consultApi";
import lawyerApi from "../../api/lawyerApi";
import { DEFAULT_IMAGE } from "../lawyer/LawyerListPage";

const ConsultReservePage = () => {
  const [searchParams] = useSearchParams();
  const lawyerId = searchParams.get("lawyerId");
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(30); // 💡 TB_CONSULT 기본값 30 반영
  const [note, setNote] = useState(""); // 💡 컬럼명 'NOTE'에 맞춰 변경
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLawyer = async () => {
      if (!lawyerId) return;
      try {
        const data = await lawyerApi.getLawyerDetail(lawyerId);
        setLawyer(data);
      } catch (err) {
        console.error("변호사 정보 로드 실패:", err);
      }
    };
    fetchLawyer();
  }, [lawyerId]);

  useEffect(() => {
    if (!selectedDate || !lawyerId) return;
    getAvailableTimes(lawyerId, selectedDate).then((res) => {
      setAvailableTimes(res.data?.data || res.data || []);
      setSelectedTime("");
    });
  }, [selectedDate, lawyerId]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert("날짜와 시간을 선택해주세요.");
      return;
    }

    try {
      setLoading(true);

      // 1. 파일 업로드 (기존 로직 유지)
      let attachmentNos = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f));
        const uploadRes = await lawyerApi.uploadFiles(formData);
        attachmentNos = uploadRes.data.map((a) => a.attachmentNo);
      }

      // 2. TB_CONSULT 구조에 맞춘 데이터 매핑
      // 💡 CONSULT_DATE는 보통 날짜+시간이 합쳐진 형태이므로 결합하여 전송
      const consultDateTime = `${selectedDate}T${selectedTime}:00`;

      const consultData = {
        // memberId는 추후 로그인 상태에서 추가
        lawyerId: Number(lawyerId), // 💡 LAWYER_ID
        consultDate: consultDateTime, // 💡 CONSULT_DATE (ISO String 등 서버 포맷 확인)
        durationMin: duration, // 💡 DURATION_MIN
        note: note, // 💡 NOTE (상담 요청 메모)
        attachmentNos: attachmentNos, // (첨부파일 매핑 테이블용)
      };

      const res = await createConsult(consultData);

      alert("상담 예약이 접수되었습니다.");

      // 💡 CONSULT_ID를 받아 결제 페이지로 이동
      const consultId = res.data?.consultId || res.data?.data?.consultId;
      navigate(`/payment/pay.do?consultId=${consultId}`);
    } catch (e) {
      alert(e.response?.data?.message || "예약 신청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 16px" }}>
      {/* 변호사 정보 카드 */}
      {lawyer && (
        <div style={lawyerCardStyle}>
          <img
            src={
              lawyer.savePath
                ? `http://localhost:8080${lawyer.savePath}`
                : DEFAULT_IMAGE
            }
            alt={lawyer.name}
            style={avatarStyle}
            onError={(e) => (e.target.src = DEFAULT_IMAGE)}
          />
          <div>
            <div
              style={{ fontWeight: "700", fontSize: "15px", color: "#1A1A2E" }}
            >
              {lawyer.name} 변호사
            </div>
            <div style={{ fontSize: "13px", color: "#666" }}>
              {lawyer.specialty} 전문 · 30분당{" "}
              {lawyer.consultFee?.toLocaleString()}원
            </div>
          </div>
        </div>
      )}

      <h2
        style={{
          fontSize: "20px",
          fontWeight: "800",
          color: "#1A1A2E",
          margin: "24px 0",
        }}
      >
        상담 예약 신청
      </h2>

      {/* 날짜 선택 */}
      <div style={fieldStyle}>
        <label style={labelStyle}>상담 날짜 *</label>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* 시간 선택 */}
      <div style={fieldStyle}>
        <label style={labelStyle}>상담 시간 *</label>
        {availableTimes.length === 0 ? (
          <p style={{ color: "#aaa", fontSize: "13px" }}>
            {selectedDate
              ? "예약 가능한 시간이 없습니다."
              : "날짜를 먼저 선택해주세요."}
          </p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {availableTimes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                style={{
                  ...timeBtnBaseStyle,
                  borderColor: selectedTime === t ? "#1A6DFF" : "#D0D8E4",
                  background: selectedTime === t ? "#1A6DFF" : "#fff",
                  color: selectedTime === t ? "#fff" : "#444",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DURATION_MIN 선택 */}
      <div style={fieldStyle}>
        <label style={labelStyle}>상담 시간 (DURATION_MIN)</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          style={inputStyle}
        >
          <option value={30}>30분 (기본)</option>
          <option value={60}>60분</option>
          <option value={90}>90분</option>
        </select>
      </div>

      {/* NOTE 작성 */}
      <div style={fieldStyle}>
        <label style={labelStyle}>의뢰인 요청 사항 (NOTE)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="상담 내용을 간략히 적어주세요."
          rows={4}
          style={{ ...inputStyle, resize: "none" }}
        />
      </div>

      {/* 파일 첨부 (선택) */}
      <div style={fieldStyle}>
        <label style={labelStyle}>참고 서류 첨부</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ fontSize: "13px" }}
        />
      </div>

      {/* 금액 안내 */}
      {lawyer && (
        <div style={priceInfoStyle}>
          최종 상담 금액:{" "}
          <strong style={{ color: "#E74C3C", fontSize: "18px" }}>
            {((lawyer.consultFee || 0) * (duration / 30)).toLocaleString()}원
          </strong>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          ...submitBtnStyle,
          background: loading ? "#aaa" : "#1A6DFF",
        }}
      >
        {loading ? "예약 처리 중..." : "예약 신청 및 결제하기"}
      </button>
    </div>
  );
};

// --- 스타일 (생략/기존 유지) ---
const lawyerCardStyle = {
  background: "#F0F4FF",
  borderRadius: "12px",
  padding: "16px 20px",
  display: "flex",
  gap: "14px",
  alignItems: "center",
};
const avatarStyle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  objectFit: "cover",
  background: "#1A6DFF",
};
const fieldStyle = { marginBottom: "20px" };
const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "700",
  color: "#444",
  marginBottom: "8px",
};
const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid #D0D8E4",
  borderRadius: "10px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};
const timeBtnBaseStyle = {
  padding: "8px 16px",
  borderRadius: "20px",
  border: "1.5px solid",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
};
const priceInfoStyle = {
  background: "#FFFBE6",
  border: "1px solid #FFD700",
  borderRadius: "10px",
  padding: "14px 18px",
  marginBottom: "24px",
  fontSize: "14px",
  textAlign: "right",
};
const submitBtnStyle = {
  width: "100%",
  padding: "16px",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};

export default ConsultReservePage;
