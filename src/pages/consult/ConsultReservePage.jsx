import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createConsult } from "../../api/consultApi";
import lawyerApi from "../../api/lawyerApi";
import { DEFAULT_IMAGE } from "../lawyer/LawyerListPage";
import { baseURL } from "../../constants/baseURL";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/consult/ConsultReservePage.css";
import { scrollToTop } from "../../utils/windowUtils";

const ConsultReservePage = () => {
  const [searchParams] = useSearchParams();
  const lawyerId = searchParams.get("lawyerId");
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [note, setNote] = useState("");
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
    scrollToTop();
  }, [lawyerId]);

  useEffect(() => {
    if (!selectedDate) return;
    const times = ["09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00"];
    setAvailableTimes(times);
    setSelectedTime("");
  }, [selectedDate]);

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
      const consultDateTime = `${selectedDate}T${selectedTime}:00`;

      const consultData = {
        lawyerId: Number(lawyerId),
        consultDate: consultDateTime,
        durationMin: duration,
        note: note,
        attachmentNos: [],
      };

      const res = await createConsult(consultData);
      const consultId = res.data?.data?.consultId;

      // 파일 업로드
      if (files.length > 0 && consultId) {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("consultId", consultId);
          await axiosInstance.post("/attachment/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
        }
      }

      alert("상담 예약이 접수되었습니다. 변호사 승인 후 결제가 가능합니다.");
      navigate("/mypage/main");
    } catch (e) {
      alert(e.response?.data?.message || "예약 신청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reserve-wrapper">
      {lawyer && (
        <div className="reserve-lawyer-card">
          <img
            src={
              lawyer.savePath || lawyer.profileUrl
                ? (lawyer.savePath || lawyer.profileUrl).startsWith("http")
                  ? lawyer.savePath || lawyer.profileUrl
                  : `${baseURL + (lawyer.savePath || lawyer.profileUrl)}`
                : DEFAULT_IMAGE
            }
            alt={lawyer.name}
            className="reserve-lawyer-avatar"
            onError={(e) => (e.target.src = DEFAULT_IMAGE)}
          />
          <div className="reserve-lawyer-info">
            <div className="name">{lawyer.name} 변호사</div>
            <div className="meta">
              {lawyer.specialty} 전문 · 30분당{" "}
              {lawyer.consultFee?.toLocaleString()}원
            </div>
          </div>
        </div>
      )}

      <h2 className="reserve-main-title">상담 예약 신청</h2>

      <div className="reserve-field">
        <label className="reserve-label">상담 날짜 *</label>
        <input
          type="date"
          className="reserve-input"
          value={selectedDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="reserve-field">
        <label className="reserve-label">상담 시간 *</label>
        {availableTimes.length === 0 ? (
          <p className="reserve-empty-msg">
            {selectedDate ? "예약 가능한 시간이 없습니다." : "날짜를 먼저 선택해주세요."}
          </p>
        ) : (
          <div className="reserve-time-grid">
            {availableTimes.map((t) => (
              <button
                key={t}
                className={`reserve-time-btn ${selectedTime === t ? "active" : ""}`}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="reserve-field">
        <label className="reserve-label">상담 희망 시간</label>
        <select
          className="reserve-select"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          <option value={30}>30분 (기본)</option>
          <option value={60}>60분</option>
          <option value={90}>90분</option>
        </select>
      </div>

      <div className="reserve-field">
        <label className="reserve-label">의뢰인 요청 사항 (참고 내용)</label>
        <textarea
          className="reserve-textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="상담하실 내용을 간략히 적어주시면 더 정확한 상담이 가능합니다."
          rows={4}
        />
      </div>

      <div className="reserve-field">
        <label className="reserve-label">참고 서류 첨부 (선택)</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="reserve-file-input"
        />
        {files.length > 0 && (
          <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
            {files.length}개 파일 선택됨
          </p>
        )}
      </div>

      {lawyer && (
        <div className="reserve-price-box">
          <span className="label">최종 결제 예정 금액</span>
          <span className="value">
            {((lawyer.consultFee || 0) * (duration / 30)).toLocaleString()}원
          </span>
        </div>
      )}

      <button
        className="reserve-submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "예약 처리 중..." : "예약 신청하기"}
      </button>
    </div>
  );
};

export default ConsultReservePage;