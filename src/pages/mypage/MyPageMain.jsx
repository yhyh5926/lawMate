// src/pages/mypage/MyPageMain.jsx
// ================================
// 마이페이지 메인
// ================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../zustand/auth_store';
import { authApi } from '../../api/auth_api';
import '../../styles/auth/MyPage.css';
import '../../styles/auth/LawyerProfile.css';

// ================================
// 시간 계산 헬퍼 함수
// ================================
const timeToMins = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const minsToTime = (m) => {
  if (m < 0) m = 0;
  const hrs = Math.floor(m / 60);
  const mins = m % 60;
  const hStr = Math.min(hrs, 23).toString().padStart(2, '0');
  const mStr = (hrs >= 24) ? '59' : mins.toString().padStart(2, '0');
  return `${hStr}:${mStr}`;
};

const applyBuffer = (timeStr, bufferStr, isSubtract) => {
  const tm = timeToMins(timeStr);
  const bm = timeToMins(bufferStr);
  const newMins = isSubtract ? tm - bm : tm + bm;
  return minsToTime(newMins);
};


const TimeInput = ({ value, onChange, onNext, inputId }) => {
  const minRef = useRef(null);
  const [hour, min] = value ? value.split(':') : ['', ''];

  const handleHourChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); 
    if (val.length > 2) val = val.slice(0, 2);
    if (val !== '' && parseInt(val) > 23) val = '23'; 
    onChange(`${val}:${min || ''}`);
  };

  const handleMinChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); 
    if (val.length > 2) val = val.slice(0, 2);
    if (val !== '' && parseInt(val) > 59) val = '59'; 
    onChange(`${hour || ''}:${val}`);
  };

  const handleHourBlur = () => {
    if (hour && hour.length === 1) onChange(`${hour.padStart(2, '0')}:${min || '00'}`);
  };

  const handleMinBlur = () => {
    if (min && min.length === 1) onChange(`${hour || '00'}:${min.padStart(2, '0')}`);
  };

  const handleHourKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      let newHour = hour ? hour.padStart(2, '0') : '00';
      onChange(`${newHour}:${min || '00'}`);
      minRef.current?.focus(); 
    }
  };

  const handleMinKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      let newMin = min ? min.padStart(2, '0') : '00';
      onChange(`${hour || '00'}:${newMin}`);
      if (onNext) onNext(); 
    } else if (e.key === 'Backspace' && !min) {
      e.preventDefault();
      document.getElementById(inputId)?.focus();
    }
  };

  return (
    <div className="custom-time-wrapper">
      <input
        id={inputId}
        type="text"
        value={hour}
        onChange={handleHourChange}
        onBlur={handleHourBlur}
        onKeyDown={handleHourKeyDown}
        className="custom-time-input"
        placeholder="00"
        maxLength="2"
      />
      <span className="custom-time-separator">:</span>
      <input
        ref={minRef}
        type="text"
        value={min}
        onChange={handleMinChange}
        onBlur={handleMinBlur}
        onKeyDown={handleMinKeyDown}
        className="custom-time-input"
        placeholder="00"
        maxLength="2"
      />
    </div>
  );
};

// ================================
// 무한 스크롤 달력 초기화 함수 (5년치)
// ================================
const initialGridDays = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const start = new Date(currentYear - 2, 0, 1);
  start.setDate(start.getDate() - start.getDay()); 
  
  const days = [];
  for(let i = 0; i < 2000; i++) { 
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return days;
};


const MyPageMain = () => {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [lawyerTab, setLawyerTab] = useState('PUBLIC');
  
  const [scheduleMap, setScheduleMap] = useState({
    phone: user?.availableSchedule?.phone || {},
    video: user?.availableSchedule?.video || {},
    visit: user?.availableSchedule?.visit || {}
  });

  const [activeType, setActiveType] = useState('phone');

  const [dragStart, setDragStart] = useState(null);
  const [tempSelection, setTempSelection] = useState([]); 
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [bufferTime, setBufferTime] = useState('00:00'); 

  const [clientSelectedDate, setClientSelectedDate] = useState('');
  const [clientStartTime, setClientStartTime] = useState('');
  const [clientEndTime, setClientEndTime] = useState('');

  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [gridDays] = useState(initialGridDays);
  
  // 스크롤 및 안정화 상태를 위한 Ref
  const scrollRef = useRef(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);
  
  const [showReservations, setShowReservations] = useState(false);
  const [manageSelectedDate, setManageSelectedDate] = useState('');

  const [editForm, setEditForm] = useState({
    nickname: user?.nickname || '',
    education: user?.education || '',
    phone: user?.phone || '',
    office: user?.office || '',
    products: [
      { id: 'p1', typeKey: 'phone', type: '전화상담', time: '20분', price: '15,000' },
      { id: 'p2', typeKey: 'video', type: '영상상담', time: '30분', price: '25,000' },
      { id: 'p3', typeKey: 'visit', type: '방문상담', time: '60분', price: '45,000' }
    ]
  });

  useEffect(() => {
    if (user?.availableSchedule) {
      setScheduleMap({
        phone: user.availableSchedule.phone || {},
        video: user.availableSchedule.video || {},
        visit: user.availableSchedule.visit || {}
      });
    }
  }, [user]);

  // 페이지 진입 시 오늘 날짜로 자동 스크롤
  useEffect(() => {
    setTimeout(() => {
      scrollToDate(new Date());
    }, 100);
  }, []);

  if (!user) return <div style={{textAlign:'center', marginTop:'100px', fontSize: '18px'}}>로그인이 필요합니다.</div>;

  const handleLogout = () => { logout(); navigate('/'); };
  const handleLeave = async () => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      await authApi.leaveUser(user.id);
      logout(); navigate('/');
    }
  };

  const formatPhone = (phoneStr) => {
    if(!phoneStr || phoneStr.length !== 11) return phoneStr || '미등록';
    return `${phoneStr.slice(0,3)}-${phoneStr.slice(3,7)}-${phoneStr.slice(7)}`;
  };

  const formatBirthDate = (dateString) => {
    if(!dateString) return '미등록';
    const parts = dateString.split('-');
    if(parts.length === 3) return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`;
    return dateString;
  };

  // ================================
  // 스크롤 및 달력 탐색 로직 개선
  // ================================
  const scrollToDate = (targetDate) => {
    const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-01`;
    const el = document.getElementById(`day-${dateStr}`);
    
    if (el && scrollRef.current) {
      isProgrammaticScroll.current = true; // 버튼 클릭에 의한 자동 이동 중임을 표시
      
      scrollRef.current.scrollTo({
        top: el.offsetTop - 50, // 헤더 크기 고려, 중복 계산 버그 제거
        behavior: 'smooth'
      });

      // 스크롤 이동이 끝날 즈음(800ms) 다시 수동 스크롤을 인식하도록 타이머 설정
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 800);
    }
  };

  const handleScroll = () => {
    // 자동 스크롤 중에는 년월 헤더 업데이트 방지
    if (isProgrammaticScroll.current) return;
    
    if (!scrollRef.current) return;
    const grid = scrollRef.current.querySelector('.calendar-grid');
    if (!grid) return;
    
    const children = grid.children;
    const scrollTop = scrollRef.current.scrollTop;
    
    let left = 0;
    let right = Math.floor(children.length / 7) - 1;
    let foundRow = 0;
    
    // 이분 탐색으로 현재 화면 상단에 위치한 날짜 줄 찾기 (오류 수정됨)
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const el = children[mid * 7];
      if (!el) break;
      
      const elTop = el.offsetTop; // 중복 마이너스 처리 제거 (버그 해결 핵심)
      
      if (elTop <= scrollTop + 60) { 
        foundRow = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    const targetIndex = Math.min((foundRow + 1) * 7, children.length - 1);
    const targetDayEl = children[targetIndex];
    
    if (targetDayEl && targetDayEl.id) {
      const dateStr = targetDayEl.id.replace('day-', '');
      const [y, m] = dateStr.split('-');
      const newD = new Date(parseInt(y), parseInt(m) - 1, 1);
      
      if (currentDate.getFullYear() !== newD.getFullYear() || currentDate.getMonth() !== newD.getMonth()) {
        setCurrentDate(newD);
      }
    }
  };

  const handlePrevYear = () => {
    const newD = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
    setCurrentDate(newD);
    scrollToDate(newD);
  };
  const handleNextYear = () => {
    const newD = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1);
    setCurrentDate(newD);
    scrollToDate(newD);
  };
  const handlePrevMonth = () => {
    const newD = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newD);
    scrollToDate(newD);
  };
  const handleNextMonth = () => {
    const newD = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newD);
    scrollToDate(newD);
  };

  const now = new Date();
  const todayDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const getAvailableSlots = (defaultStart, defaultEnd, bookings = [], currentMinTimeStr = null, buffer = '00:00') => {
    let slots = [];
    let currentStart = defaultStart;

    if (currentMinTimeStr && currentMinTimeStr > currentStart) {
      currentStart = currentMinTimeStr;
    }

    if (currentStart >= defaultEnd) return [];

    const sortedBookings = [...bookings].sort((a, b) => a.startTime.localeCompare(b.startTime));

    for (let b of sortedBookings) {
      const blockedStart = applyBuffer(b.startTime, buffer, true);
      const blockedEnd = applyBuffer(b.endTime, buffer, false);

      if (blockedEnd <= currentStart) continue; 
      if (blockedStart >= defaultEnd) break; 

      if (currentStart < blockedStart) {
        slots.push({ start: currentStart, end: blockedStart });
      }
      currentStart = blockedEnd > currentStart ? blockedEnd : currentStart;
    }

    if (currentStart < defaultEnd) {
      slots.push({ start: currentStart, end: defaultEnd });
    }

    return slots.filter(s => s.start < s.end);
  };

  const getDynamicAvailableTime = (dateStr) => {
    if (!scheduleMap[activeType][dateStr]) return null;
    const dayData = scheduleMap[activeType][dateStr];
    const buffer = dayData.buffer || '00:00';
    let minTimeStr = null;

    if (dateStr === todayStr && lawyerTab === 'PUBLIC') {
        const minTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
        minTimeStr = `${String(minTime.getHours()).padStart(2, '0')}:${String(minTime.getMinutes()).padStart(2, '0')}`;
    }

    const slots = getAvailableSlots(dayData.start, dayData.end, dayData.bookings || [], minTimeStr, buffer);
    return {
        start: dayData.start,
        end: dayData.end,
        buffer: buffer,
        slots: slots,
        isValid: slots.length > 0,
        hasBookings: (dayData.bookings || []).length > 0
    };
  };

  const onMouseDown = (date) => {
    if(lawyerTab !== 'MANAGE') return;
    setDragStart(date);
    setTempSelection([date]);
  };

  const onMouseEnter = (date) => {
    if (!dragStart) return;
    const startIdx = gridDays.indexOf(dragStart);
    const endIdx = gridDays.indexOf(date);
    if (startIdx === -1 || endIdx === -1) return; 
    const range = gridDays.slice(Math.min(startIdx, endIdx), Math.max(startIdx, endIdx) + 1);
    setTempSelection(range);
  };

  const onMouseUp = () => setDragStart(null);

  const applySchedule = () => {
    if (tempSelection.length === 0) return alert("날짜를 먼저 드래그하여 선택해주세요.");
    
    if (startTime.length !== 5 || endTime.length !== 5 || bufferTime.length !== 5) {
      return alert("시작, 종료, 간격 시간을 정확히 입력해주세요 (예: 09:00)");
    }

    if (startTime >= endTime) return alert("종료 시간은 시작 시간보다 늦어야 합니다.");

    const newTypeMap = { ...scheduleMap[activeType] };
    tempSelection.forEach(date => {
      const existingBookings = newTypeMap[date]?.bookings || [];
      newTypeMap[date] = { start: startTime, end: endTime, buffer: bufferTime, bookings: existingBookings };
    });
    setScheduleMap({ ...scheduleMap, [activeType]: newTypeMap });
    setTempSelection([]);
  };

  const removeDate = (date) => {
    const newTypeMap = { ...scheduleMap[activeType] };
    delete newTypeMap[date];
    setScheduleMap({ ...scheduleMap, [activeType]: newTypeMap });
  };

  const handleBookingSubmit = () => {
    if (!clientSelectedDate) return alert("예약 가능한 날짜를 선택해주세요.");

    if (clientStartTime.length !== 5 || clientEndTime.length !== 5) {
      return alert("희망 시작 및 종료 시간을 정확히 입력해주세요 (예: 09:00)");
    }

    if (clientStartTime >= clientEndTime) {
      return alert("종료 시간은 시작 시간보다 늦어야 합니다.");
    }

    const timeInfo = getDynamicAvailableTime(clientSelectedDate);
    if (!timeInfo || !timeInfo.isValid) {
        return alert("해당 날짜의 예약이 마감되었거나 불가능합니다.");
    }

    const isValidBooking = timeInfo.slots.some(slot => 
      clientStartTime >= slot.start && clientEndTime <= slot.end
    );

    if (!isValidBooking) {
      return alert("해당 시간은 이미 예약되었거나 상담 가능 시간이 아닙니다. 잔여 시간을 확인해주세요.");
    }

    const newMap = { ...scheduleMap };
    const dayData = { ...newMap[activeType][clientSelectedDate] };
    dayData.bookings = [...(dayData.bookings || []), {
        startTime: clientStartTime,
        endTime: clientEndTime,
        clientName: user.name || '방문자'
    }];
    newMap[activeType][clientSelectedDate] = dayData;
    setScheduleMap(newMap);

    const product = editForm.products.find(p => p.typeKey === activeType);
    alert(`${clientSelectedDate} [${clientStartTime} ~ ${clientEndTime}]에 ${product.type} 면담 신청이 완료되었습니다.`);
    
    setClientSelectedDate('');
    setClientStartTime('');
    setClientEndTime('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...editForm.products];
    newProducts[index][field] = value;
    setEditForm(prev => ({ ...prev, products: newProducts }));
  };

  const handleSaveManagement = async () => {
    try {
      const updateData = {
        id: user.id,
        nickname: editForm.nickname,
        education: editForm.education,
        phone: editForm.phone,
        office: editForm.office,
        availableSchedule: scheduleMap
      };
      const updatedUser = await authApi.updateUser(updateData);
      updateUser(updatedUser);
      alert("모든 변경 사항이 임시 승인되었습니다.");
      setLawyerTab('PUBLIC');
    } catch (error) { alert("저장 실패"); }
  };

  const totalAnswers = user.myAnswers?.length || 0;
  const adoptionRate = totalAnswers > 0 ? ((user.myAnswers?.filter(a => a.selected).length / totalAnswers) * 100).toFixed(0) : 0;

  const clientTimeInfo = clientSelectedDate ? getDynamicAvailableTime(clientSelectedDate) : null;
  const isClientValid = clientTimeInfo && clientTimeInfo.isValid;

  const filteredBookings = manageSelectedDate && scheduleMap[activeType][manageSelectedDate]
    ? (scheduleMap[activeType][manageSelectedDate].bookings || []).map(b => ({ date: manageSelectedDate, ...b }))
    : [];
  filteredBookings.sort((a, b) => a.startTime.localeCompare(b.startTime));


  // ================================================================
  // 변호사 회원 마이페이지
  // (변호사 소개 페이지 & 변호사 관리 페이지 동시 처리)
  // ================================================================
  if (user.role === 'LAWYER') {
    return (
      <div className="lawyer-profile-container" onMouseUp={onMouseUp}>
        
        {/* 모드 전환 탭 */}
        <div className="lawyer-mode-tabs">
          <button className={`mode-tab ${lawyerTab === 'PUBLIC' ? 'active' : ''}`} onClick={() => setLawyerTab('PUBLIC')}>👀 다른 사람이 보는 페이지</button>
          <button className={`mode-tab ${lawyerTab === 'MANAGE' ? 'active' : ''}`} onClick={() => setLawyerTab('MANAGE')}>⚙️ 변호사가 보는 관리 페이지</button>
        </div>

        {/* -------------------------------- */}
        {/* 변호사 소개 */}
        {/* -------------------------------- */}
        <div className="profile-header-card">
          <div className="header-main">
            <div className="lawmate-badges">
              <span className="badge-item">🛡️ 해결사</span>
              <span className="badge-item">⭐ 친절한</span>
              <span className="badge-item">✏️ 답변가</span>
            </div>
            <h2 className="lawyer-name-title">{user.name} 변호사</h2>
            <p className="lawyer-intro">성심을 다해 의뢰인의 권리를 보호하겠습니다.</p>
          </div>
          <div className="header-stats-group">
            <div className="stat-box yellow">
              <span className="stat-label">누적 답변</span>
              <span className="stat-value">{totalAnswers}개</span>
            </div>
            <div className="stat-box yellow">
              <span className="stat-label">답변 채택률</span>
              <span className="stat-value">{adoptionRate}%</span>
            </div>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* 상품 예약 */}
        {/* -------------------------------- */}
        <div className="consultation-service-section">
          <h3 className="panel-title">📱 1:1 상담 예약 상품 설정</h3>
          <div className="consult-card-group">
            {editForm.products.map((p, idx) => (
              <div key={p.id} className={`consult-card ${idx === 2 ? 'highlight' : ''} ${activeType === p.typeKey ? 'editing' : ''}`}>
                <div className="consult-icon">{idx === 0 ? '📞' : idx === 1 ? '🎥' : '🤝'}</div>
                <div className="consult-info">
                  {/* [관리자 모드 / 공개 모드 분기 처리] */}
                  {lawyerTab === 'MANAGE' ? (
                    <div className="manage-product-inputs">
                      <input className="mini-input" value={p.time} onChange={(e) => handleProductChange(idx, 'time', e.target.value)} />
                      <input className="mini-input" value={p.price} onChange={(e) => handleProductChange(idx, 'price', e.target.value)} />
                    </div>
                  ) : (
                    <>
                      <span className="consult-type">{p.type} {p.time}</span>
                      <div className="consult-price">{p.price}원</div>
                    </>
                  )}
                </div>
                <button 
                  className={`reserve-btn-preview active ${lawyerTab === 'MANAGE' ? 'manage-btn' : ''}`} 
                  onClick={() => { setActiveType(p.typeKey); setClientSelectedDate(''); setManageSelectedDate(''); }}
                >
                  {activeType === p.typeKey ? (lawyerTab === 'MANAGE' ? '일정 선택 중' : '선택됨') : (lawyerTab === 'MANAGE' ? '일정 관리' : '선택하기')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------------------- */}
        {/* 달력 (예약 및 일정 관리) */}
        {/* -------------------------------- */}
        <div className="consultation-service-section scheduler-setting-area">
          <h3 className="panel-title">
            📅 {activeType === 'phone' ? '전화' : activeType === 'video' ? '영상' : '방문'} 상담 가능 일정
            {lawyerTab === 'PUBLIC' ? ' (원하시는 예약 날짜를 선택하세요)' : ' (드래그하여 설정 / 클릭하여 내역 조회)'}
          </h3>
          <div className="scheduler-wrapper">
            <div className="scheduler-calendar">
              
              <div className="calendar-nav-wrapper">
                <div className="calendar-nav-box">
                  <button onClick={handlePrevYear} className="calendar-nav-btn">«</button>
                  <button onClick={handlePrevMonth} className="calendar-nav-btn">‹</button>
                  <span className="calendar-nav-text">{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</span>
                  <button onClick={handleNextMonth} className="calendar-nav-btn">›</button>
                  <button onClick={handleNextYear} className="calendar-nav-btn">»</button>
                </div>
              </div>

              {/* 윈도우 스타일 연속 달력 스크롤 영역 */}
              <div className="calendar-scroll-area" ref={scrollRef} onScroll={handleScroll}>
                
                <div className="calendar-weekday-header sticky-header">
                  {['일','월','화','수','목','금','토'].map((d, index) => {
                    let hClass = "calendar-weekday-label";
                    if(index === 0) hClass += " sun";
                    if(index === 6) hClass += " sat";
                    return <div key={d} className={hClass}>{d}</div>;
                  })}
                </div>

                <div className="calendar-grid">
                  {gridDays.map(date => {
                    const isTemp = tempSelection.includes(date);
                    const isSelectedByClient = clientSelectedDate === date;
                    
                    const [yStr, mStr, dStr] = date.split('-');
                    const cellDate = new Date(parseInt(yStr), parseInt(mStr) - 1, parseInt(dStr));
                    const isPast = cellDate < todayDateObj;
                    const isActiveMonth = parseInt(yStr) === currentDate.getFullYear() && parseInt(mStr) === currentDate.getMonth() + 1;
                    const isFirstDay = dStr === '01';
                    const displayStr = isFirstDay ? `${parseInt(mStr)}.${parseInt(dStr)}` : parseInt(dStr);
                    const dayOfWeek = cellDate.getDay();

                    let isAvailable = !!scheduleMap[activeType][date];
                    let isPartiallyBooked = false;
                    const isManageSelected = lawyerTab === 'MANAGE' && manageSelectedDate === date;

                    if (isAvailable && lawyerTab === 'PUBLIC') {
                      const tInfo = getDynamicAvailableTime(date);
                      if (!tInfo || !tInfo.isValid) {
                          isAvailable = false;
                      } else {
                          isPartiallyBooked = tInfo.hasBookings;
                      }
                    } else if (isAvailable && lawyerTab === 'MANAGE') {
                      const hasBookings = (scheduleMap[activeType][date].bookings || []).length > 0;
                      isPartiallyBooked = hasBookings;
                    }

                    // 달력 셀 전체에 들어갈 클래스명
                    let classNames = 'calendar-day ';
                    if (isActiveMonth) classNames += 'is-active-month ';
                    if (isPast) classNames += 'past-date ';
                    else if (!isAvailable) classNames += 'disabled ';
                    else {
                      if (isPartiallyBooked) classNames += 'partially-booked ';
                      else classNames += 'selected ';
                    }

                    if (isTemp) classNames += 'dragging ';
                    if (isSelectedByClient || isManageSelected) classNames += 'client-target '; 

                    // 날짜 숫자 텍스트에만 들어갈 요일/1일 전용 클래스
                    let numClass = `date-number ${isFirstDay ? 'first-day' : ''}`;
                    if (dayOfWeek === 0) numClass += ' sun';
                    else if (dayOfWeek === 6) numClass += ' sat';

                    return (
                      <div 
                        key={date}
                        id={`day-${date}`}
                        className={classNames}
                        onMouseDown={() => !isPast && onMouseDown(date)}
                        onMouseEnter={() => !isPast && onMouseEnter(date)}
                        onClick={() => {
                          if (!isPast && lawyerTab === 'PUBLIC' && isAvailable) {
                            const tInfo = getDynamicAvailableTime(date);
                            setClientSelectedDate(date);
                            if(tInfo.slots.length > 0) {
                                setClientStartTime(tInfo.slots[0].start);
                                setClientEndTime(tInfo.slots[0].end);
                            }
                          } else if (!isPast && lawyerTab === 'MANAGE' && isAvailable) {
                            setManageSelectedDate(date);
                            setShowReservations(true); 
                          }
                        }}
                      >
                        <span className={numClass}>{displayStr}</span>
                        {isAvailable && <span className="time-tag">{scheduleMap[activeType][date].start} ~ {scheduleMap[activeType][date].end}</span>}
                        {isAvailable && lawyerTab === 'MANAGE' && !isPast && (
                          <button
                            className="calendar-remove-btn"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              removeDate(date);
                              if(manageSelectedDate === date) setManageSelectedDate('');
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="scheduler-time-setter">
              {/* [관리자 모드 / 공개 모드 분기 처리] */}
              {lawyerTab === 'MANAGE' ? (
                <>
                  <h4 className="sub-title">시간 설정</h4>
                  <div className="time-input-group">
                    <div className="t-field">
                      <label>시작</label>
                      <TimeInput 
                        value={startTime} 
                        onChange={setStartTime} 
                        inputId="manage-start-hour"
                        onNext={() => document.getElementById('manage-end-hour')?.focus()} 
                      />
                    </div>
                    <div className="t-field">
                      <label>종료</label>
                      <TimeInput 
                        value={endTime} 
                        onChange={setEndTime} 
                        inputId="manage-end-hour"
                        onNext={() => document.getElementById('manage-buffer-hour')?.focus()} 
                      />
                    </div>
                    <div className="t-field">
                      <label>간격</label>
                      <TimeInput 
                        value={bufferTime} 
                        onChange={setBufferTime} 
                        inputId="manage-buffer-hour"
                        onNext={() => document.getElementById('manage-buffer-hour')?.blur()} 
                      />
                    </div>
                  </div>
                  <button className="apply-btn" onClick={applySchedule}>선택 날짜 적용</button>
                  
                  <div className="reservation-section">
                    <button 
                      className="btn-mypage gray" 
                      onClick={() => setShowReservations(!showReservations)}
                      style={{marginTop: '10px', width: '100%'}}
                    >
                      {showReservations ? '예약 내역 닫기' : '예약 내역 열기'}
                    </button>

                    {showReservations && (
                      <div className="reservation-list" style={{marginTop: '20px'}}>
                        <p className="sub-title" style={{marginBottom: '12px'}}>
                          예약된 상담 내역 {manageSelectedDate ? `(${manageSelectedDate})` : ''}
                        </p>
                        
                        {!manageSelectedDate ? (
                          <div className="booking-info-text">달력에서 날짜를 선택해주세요.</div>
                        ) : filteredBookings.length === 0 ? (
                          <div className="booking-info-text">이 날짜에 예약된 내역이 없습니다.</div>
                        ) : (
                          <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                            {filteredBookings.map((b, idx) => (
                              <li key={`${b.date}-${idx}`} className="reservation-item">
                                <div className="res-date">{b.date}</div>
                                <div className="res-info">
                                  <span className="res-time">{b.startTime} ~ {b.endTime}</span>
                                  <span className="res-client">예약자: {b.clientName}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h4 className="sub-title">상담 신청</h4>
                  <p className="booking-info-text">
                    {clientSelectedDate ? `선택한 날짜: ${clientSelectedDate}` : '상담 가능한 색칠된 날짜를 선택해 주세요.'}
                  </p>
                  
                  {clientSelectedDate && (
                    <div className="booking-details-box">
                      <div className="booking-detail-group">
                        <p className="booking-detail-label">변호사 상담 가능 시간</p>
                        {isClientValid ? (
                            <div className="booking-detail-time" style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                              {clientTimeInfo.slots.map((slot, i) => (
                                <strong key={i}>{slot.start} ~ {slot.end}</strong>
                              ))}
                            </div>
                        ) : (
                            <strong className="booking-detail-time" style={{color: '#ef4444'}}>금일 예약이 마감되었습니다.</strong>
                        )}
                      </div>
                      
                      <div className="dashed-divider"></div>
                      
                      <p className="booking-section-title">본인의 희망 시간 선택</p>
                      <div className="time-input-group">
                        <div className="t-field">
                          <label>시작</label>
                          <TimeInput 
                            value={clientStartTime} 
                            onChange={setClientStartTime} 
                            inputId="client-start-hour"
                            onNext={() => document.getElementById('client-end-hour')?.focus()} 
                          />
                        </div>
                        <div className="t-field">
                          <label>종료</label>
                          <TimeInput 
                            value={clientEndTime} 
                            onChange={setClientEndTime} 
                            inputId="client-end-hour"
                            onNext={() => document.getElementById('client-end-hour')?.blur()} 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button className="btn-mypage primary" style={{width:'100%'}} onClick={handleBookingSubmit} disabled={!clientSelectedDate || !isClientValid}>
                    면담 신청하기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* 기본 정보 및 나의 답변 내역 */}
        {/* -------------------------------- */}
        <div className="profile-content-layout">
          
          <div className="info-side-panel">
            <h3 className="panel-title">👤 기본 정보</h3>
            <div className="info-item">
              <label>닉네임</label>
              {lawyerTab === 'MANAGE' ? <input name="nickname" className="manage-input-inline" value={editForm.nickname} onChange={handleInputChange} /> : <div className="value highlight">{user.nickname}</div>}
            </div>
            <div className="info-item"><label>이메일</label><div className="value">{user.email}</div></div>
            <hr className="info-divider" />
            <div className="info-item">
              <label>최종학력</label>
              {lawyerTab === 'MANAGE' ? <input name="education" className="manage-input-inline" value={editForm.education} onChange={handleInputChange} /> : <div className="value">{user.education}</div>}
            </div>
            <div className="info-item">
              <label>전화번호</label>
              {lawyerTab === 'MANAGE' ? <input name="phone" className="manage-input-inline" value={editForm.phone} onChange={handleInputChange} /> : <div className="value">{user.phone || '미등록'}</div>}
            </div>
            <div className="info-item">
              <label>사무실</label>
              {lawyerTab === 'MANAGE' ? <input name="office" className="manage-input-inline" value={editForm.office} onChange={handleInputChange} /> : <div className="value">{user.office || '미등록'}</div>}
            </div>
          </div>

          <div className="activity-main-panel">
            <h3 className="panel-title">📝 나의 답변 내역</h3>
            <div className="answers-list">
              {user.myAnswers?.length > 0 ? user.myAnswers.map(ans => (
                <div 
                  key={ans.id} 
                  className="answer-card-item"
                  onClick={() => navigate(`/community/qna/${ans.questionId || ans.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="answer-top">
                    <span className={`adoption-badge ${ans.selected ? 'is-adopted' : ''}`}>{ans.selected ? '채택 완료' : '대기중'}</span>
                    <span className="answer-date">{ans.date}</span>
                  </div>
                  <h4 className="answer-title-text">{ans.questionTitle}</h4>
                </div>
              )) : <div className="empty-msg">작성한 답변이 없습니다.</div>}
            </div>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* 변호사 페이지 하단 액션 버튼 */}
        {/* -------------------------------- */}
        {lawyerTab === 'MANAGE' && (
          <div className="profile-footer-actions">
            <button className="btn-mypage primary" onClick={handleSaveManagement}>수정 내용 저장</button>
            <button onClick={handleLogout} className="btn-mypage gray">로그아웃</button>
            <button onClick={handleLeave} className="btn-mypage danger">회원탈퇴</button>
          </div>
        )}
      </div>
    );
  }

  // ================================================================
  // 일반 회원 마이페이지
  // ================================================================
  return (
    <div className="mypage-container">
      
      {/* -------------------------------- */}
      {/* 기본 정보 */}
      {/* -------------------------------- */}
      <div className="mypage-header">
        <div className="mypage-avatar">👤</div>
        <h2 className="mypage-title">마이페이지 (일반)</h2>
        <p className="mypage-subtitle">환영합니다, {user.name}님!</p>
      </div>

      <div className="mypage-info-card">
        <div className="info-row">
          <span className="info-row-label">이름</span>
          <span className="info-row-value">{user.name} (일반회원)</span>
        </div>
        <div className="info-row">
          <span className="info-row-label">닉네임</span>
          <span className="info-row-value">{user.nickname || user.name}</span>
        </div>
        <div className="info-row">
          <span className="info-row-label">전화번호</span>
          <span className="info-row-value">{formatPhone(user.phone)}</span>
        </div>
        <div className="info-row">
          <span className="info-row-label">이메일</span>
          <span className="info-row-value">{user.email}</span>
        </div>
        <div className="info-row">
          <span className="info-row-label">생년월일</span>
          <span className="info-row-value">{formatBirthDate(user.birthDate)}</span>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* 선호하는 태그 */}
      {/* -------------------------------- */}
      <div className="mypage-info-card">
        <h3 style={{fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#1e293b'}}>🏷️ 선호하는 태그</h3>
        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
          {user.interests && user.interests.length > 0 ? (
            user.interests.map((tag, idx) => (
              <span key={idx} style={{padding: '6px 14px', background: '#eff6ff', color: '#2563eb', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid #bfdbfe'}}>
                #{tag}
              </span>
            ))
          ) : (
            <span style={{color: '#94a3b8', fontSize: '14px'}}>선호하는 태그가 없습니다.</span>
          )}
        </div>
      </div>

      {/* -------------------------------- */}
      {/* 내가 선호하는 변호사 */}
      {/* -------------------------------- */}
      <div className="mypage-info-card">
        <h3 style={{fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#1e293b'}}>👨‍⚖️ 내가 선호하는 변호사</h3>
        {user.scraps && user.scraps.length > 0 ? (
          <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
            {user.scraps.slice(0, 5).map((lawyer, idx) => (
              <li key={idx} className="list-item">
                <span style={{color: '#3b82f6', fontWeight: 'bold', marginRight: '8px'}}>{idx + 1}.</span> {lawyer}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{color: '#94a3b8', fontSize: '14px'}}>선호하는 변호사가 없습니다.</div>
        )}
      </div>

      {/* -------------------------------- */}
      {/* 내가 쓴 글 */}
      {/* -------------------------------- */}
      <div className="mypage-info-card">
        <h3 style={{fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#1e293b'}}>📝 내가 쓴 글</h3>
        {user.myPosts && user.myPosts.length > 0 ? (
          <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
            {user.myPosts.slice(0, 5).map((post, idx) => (
              <li key={post.id} className="list-item clickable" onClick={() => navigate(post.type === 'QNA' ? `/community/qna/${post.id}` : `/community/vote/${post.id}`)}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span>
                    <span style={{color: '#3b82f6', fontWeight: 'bold', marginRight: '8px'}}>{idx + 1}.</span> 
                    {post.title}
                  </span>
                  <span style={{fontSize: '12px', color: '#94a3b8'}}>{post.date}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{color: '#94a3b8', fontSize: '14px'}}>작성한 글이 없습니다.</div>
        )}
      </div>

      {/* -------------------------------- */}
      {/* 일반 회원 하단 액션 버튼 */}
      {/* -------------------------------- */}
      <div className="mypage-actions">
        <button onClick={() => navigate('/mypage/edit')} className="action-btn btn-edit">정보 수정</button>
        <button onClick={handleLogout} className="action-btn btn-logout">로그아웃</button>
        <button onClick={handleLeave} className="btn-leave">회원탈퇴</button>
      </div>
      
    </div>
  );
};

export default MyPageMain;