import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createConsult, getAvailableTimes } from '../../api/consultApi';
// import axiosInstance from '../../api/axiosInstance';

const ConsultReservePage = () => {
  const [searchParams] = useSearchParams();
  const lawyerNo = searchParams.get('lawyerNo');
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(60); // 분
  const [memo, setMemo] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // 변호사 정보 조회
  useEffect(() => {
    if (!lawyerNo) return;
    axiosInstance.get(`/api/lawyer/${lawyerNo}`).then((res) => {
      setLawyer(res.data.data);
    });
  }, [lawyerNo]);

  // 날짜 선택 시 가용 시간 조회
  useEffect(() => {
    if (!selectedDate || !lawyerNo) return;
    getAvailableTimes(lawyerNo, selectedDate).then((res) => {
      setAvailableTimes(res.data.data || []);
      setSelectedTime('');
    });
  }, [selectedDate, lawyerNo]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      // 파일 첨부 처리
      let attachmentNos = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append('files', f));
        const uploadRes = await axiosInstance.post('/api/attachment/upload-multi', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        attachmentNos = uploadRes.data.data.map((a) => a.attachmentNo);
      }

      const res = await createConsult({
        lawyerNo: Number(lawyerNo),
        consultDate: selectedDate,
        consultTime: selectedTime,
        duration,
        memo,
        attachmentNos,
      });

      alert('상담 예약이 완료되었습니다.');
      navigate(`/payment/pay.do?consultNo=${res.data.data.consultNo}`);
    } catch (e) {
      alert(e.response?.data?.message || '예약 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 16px' }}>
      {/* 변호사 정보 카드 */}
      {lawyer && (
        <div
          style={{
            background: '#F0F4FF',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#1A6DFF',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '18px',
            }}
          >
            {lawyer.name?.[0]}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#1A1A2E' }}>
              {lawyer.name} 변호사
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              {lawyer.specialization} · 상담료 {lawyer.consultFee?.toLocaleString()}원/시간
            </div>
          </div>
        </div>
      )}

      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A2E', marginBottom: '24px' }}>
        상담 예약
      </h2>

      {/* 날짜 선택 */}
      <div style={fieldStyle}>
        <label style={labelStyle}>상담 날짜 *</label>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* 시간 선택 */}
      <div style={fieldStyle}>
        <label style={labelStyle}>상담 시간 *</label>
        {availableTimes.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '13px' }}>
            {selectedDate ? '가용 시간이 없습니다' : '날짜를 먼저 선택해주세요'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableTimes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1.5px solid',
                  borderColor: selectedTime === t ? '#1A6DFF' : '#D0D8E4',
                  background: selectedTime === t ? '#1A6DFF' : '#fff',
                  color: selectedTime === t ? '#fff' : '#444',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 상담 시간 */}
      <div style={fieldStyle}>
        <label style={labelStyle}>상담 시간 (분)</label>
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={inputStyle}>
          <option value={30}>30분</option>
          <option value={60}>60분</option>
          <option value={90}>90분</option>
          <option value={120}>120분</option>
        </select>
      </div>

      {/* 요청 메모 */}
      <div style={fieldStyle}>
        <label style={labelStyle}>요청 사항</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="상담 내용이나 요청 사항을 간략히 적어주세요"
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* 파일 첨부 */}
      <div style={fieldStyle}>
        <label style={labelStyle}>관련 서류 첨부</label>
        <input type="file" multiple onChange={handleFileChange} style={{ fontSize: '13px' }} />
        {files.length > 0 && (
          <p style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>
            {files.map((f) => f.name).join(', ')}
          </p>
        )}
      </div>

      {/* 예약 금액 안내 */}
      {lawyer && (
        <div
          style={{
            background: '#FFFBE6',
            border: '1px solid #FFD700',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#5A4A00',
          }}
        >
          예상 결제 금액:{' '}
          <strong>
            {((lawyer.consultFee || 0) * (duration / 60)).toLocaleString()}원
          </strong>
          <br />
          <span style={{ fontSize: '12px', color: '#888' }}>
            * 예약 확정 후 결제 페이지로 이동합니다
          </span>
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
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
          transition: 'background 0.2s',
        }}
      >
        {loading ? '처리 중...' : '예약 신청'}
      </button>
    </div>
  );
};

const fieldStyle = { marginBottom: '20px' };
const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '700',
  color: '#444',
  marginBottom: '8px',
};
const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #D0D8E4',
  borderRadius: '10px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  color: '#1A1A2E',
};

export default ConsultReservePage;
