// src/pages/auth/JoinPage.jsx


// ================================
// 회원가입 페이지
// ================================

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth_api';
import { AUTH_USERS } from '../../mocks/auth/auth_mockData';
import '../../styles/auth/Auth.css';

const JoinPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('USER');

  const [userId, setUserId] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);
  
  const [userPw, setUserPw] = useState('');
  const [userPwConfirm, setUserPwConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  
  const [emailPrefix, setEmailPrefix] = useState('');
  const [emailDomain, setEmailDomain] = useState('naver.com');
  const [customDomain, setCustomDomain] = useState('');
  
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  const idRef = useRef(null);
  const pwRef = useRef(null);
  const pwConfirmRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailPrefixRef = useRef(null);
  const customDomainRef = useRef(null);
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const joinBtnRef = useRef(null);

  const [lId, setLId] = useState('');
  const [isLIdChecked, setIsLIdChecked] = useState(false);
  
  const [lPw, setLPw] = useState('');
  const [lPwConfirm, setLPwConfirm] = useState('');
  const [showLPw, setShowLPw] = useState(false);
  const [showLPwConfirm, setShowLPwConfirm] = useState(false);

  const [lName, setLName] = useState('');
  const [lPhone, setLPhone] = useState('');
  
  const [lEmailPrefix, setLEmailPrefix] = useState('');
  const [lEmailDomain, setLEmailDomain] = useState('naver.com');
  const [lCustomDomain, setLCustomDomain] = useState('');
  
  const [lBirthYear, setLBirthYear] = useState('');
  const [lBirthMonth, setLBirthMonth] = useState('');
  const [lBirthDay, setLBirthDay] = useState('');

  const [lNickname, setLNickname] = useState('');
  
  const [lLicenseList, setLLicenseList] = useState([]); 
  const [lLicenseInput, setLLicenseInput] = useState('');
  const [lLicenseYearInput, setLLicenseYearInput] = useState('');

  const [lEdu, setLEdu] = useState('');
  const [lOffice, setLOffice] = useState('');

  const lIdRef = useRef(null);
  const lPwRef = useRef(null);
  const lPwConfirmRef = useRef(null);
  const lNameRef = useRef(null);
  const lPhoneRef = useRef(null);
  const lEmailPrefixRef = useRef(null);
  const lCustomDomainRef = useRef(null);
  const lYearRef = useRef(null);
  const lMonthRef = useRef(null);
  const lDayRef = useRef(null);
  
  const lNicknameRef = useRef(null);
  const lLicenseInputRef = useRef(null);
  const lLicenseYearRef = useRef(null);
  const lEduRef = useRef(null);
  const lOfficeRef = useRef(null);
  const lJoinBtnRef = useRef(null);

  const padValue = (val) => (val && val.length === 1 && val !== '0' ? '0' + val : val);

  const getMaxDays = (y, m) => {
    const yearNum = parseInt(y) || new Date().getFullYear(); 
    const monthNum = parseInt(m) || 1;
    return new Date(yearNum, monthNum, 0).getDate(); 
  };

  const validateMonth = (val) => {
    let m = val.replace(/\D/g, '');
    if (m && parseInt(m) > 12) return '12'; 
    return m;
  };

  const validateDay = (val, y, m) => {
    let d = val.replace(/\D/g, '');
    if (d) {
      const max = getMaxDays(y, m);
      if (parseInt(d) > max) return max.toString(); 
    }
    return d;
  };

  const formatPhone = (val) => {
    const raw = val.replace(/[^0-9]/g, '');
    if (raw.length > 3 && raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    if (raw.length > 7) return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    return raw;
  };

  const handleIdCheck = () => {
    if (userId.length < 6 || userId.length > 20) return alert("아이디는 6~20자로 입력해주세요.");
    if (!/[a-zA-Z]/.test(userId)) return alert("아이디에는 반드시 영문이 1자 이상 포함되어야 합니다.");

    const isDuplicated = AUTH_USERS.some(u => u.id === userId);
    if (isDuplicated) {
      alert("이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.");
      setIsIdChecked(false);
    } else {
      alert("사용 가능한 아이디입니다.");
      setIsIdChecked(true);
      pwRef.current?.focus(); 
    }
  };

  const handleLawyerIdCheck = () => {
    if (lId.length < 6 || lId.length > 20) return alert("아이디는 6~20자로 입력해주세요.");
    if (!/[a-zA-Z]/.test(lId)) return alert("아이디에는 반드시 영문이 1자 이상 포함되어야 합니다.");

    const isDuplicated = AUTH_USERS.some(u => u.id === lId);
    if (isDuplicated) {
      alert("이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.");
      setIsLIdChecked(false);
    } else {
      alert("사용 가능한 아이디입니다.");
      setIsLIdChecked(true);
      lPwRef.current?.focus(); 
    }
  };

  const handleAddLicense = () => {
    if (!lLicenseInput.trim()) return alert("자격증 명을 입력해주세요.");
    if (!lLicenseYearInput.trim() || lLicenseYearInput.length !== 4) return alert("취득 년도(4자리)를 정확히 입력해주세요.");
    
    setLLicenseList([...lLicenseList, { name: lLicenseInput, year: lLicenseYearInput }]);
    setLLicenseInput('');
    setLLicenseYearInput('');
    lLicenseInputRef.current?.focus();
  };

  const handleRemoveLicense = (index) => {
    setLLicenseList(lLicenseList.filter((_, i) => i !== index));
  };

  const handleJoin = async () => {
    let userData = {};
    const pwRegex = /^(?:(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\|])|(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\|]))[A-Za-z\d!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\|]{8,20}$/;
    const currentYear = new Date().getFullYear();

    if (role === 'USER') {
      if (!isIdChecked) return alert("아이디 중복확인을 해주세요.");
      if (!pwRegex.test(userPw)) return alert("비밀번호는 문자, 숫자, 특수문자 중 2개 포함 8~20자로 입력해주세요.");
      if (userPw !== userPwConfirm) return alert("비밀번호가 일치하지 않습니다.");
      if (!userName) return alert("이름을 입력해주세요.");
      
      const rawPhone = userPhone.replace(/[^0-9]/g, '');
      if (rawPhone.length !== 11) return alert("전화번호를 정확히 입력해주세요.");

      const finalDomain = emailDomain === 'custom' ? customDomain : emailDomain;
      if (!emailPrefix || !finalDomain) return alert("이메일 주소를 모두 입력해주세요.");

      if (!birthYear || !birthMonth || !birthDay) return alert("생년월일을 모두 입력해주세요.");
      if(parseInt(birthYear) < 1900 || parseInt(birthYear) > currentYear) return alert("유효한 년도를 입력해주세요.");

      userData = {
        id: userId,
        pw: userPw,
        name: userName,
        nickname: userName,
        email: `${emailPrefix}@${finalDomain}`,
        phone: rawPhone,
        birthDate: `${birthYear}-${padValue(birthMonth)}-${padValue(birthDay)}`,
        role: 'USER'
      };

    } else {
      if (!isLIdChecked) return alert("아이디 중복확인을 해주세요.");
      if (!pwRegex.test(lPw)) return alert("비밀번호는 문자, 숫자, 특수문자 중 2개 포함 8~20자로 입력해주세요.");
      if (lPw !== lPwConfirm) return alert("비밀번호가 일치하지 않습니다.");
      if (!lName) return alert("이름을 입력해주세요.");
      
      const rawLPhone = lPhone.replace(/[^0-9]/g, '');
      if (rawLPhone.length !== 11) return alert("전화번호를 정확히 입력해주세요.");

      const finalLDomain = lEmailDomain === 'custom' ? lCustomDomain : lEmailDomain;
      if (!lEmailPrefix || !finalLDomain) return alert("이메일 주소를 모두 입력해주세요.");

      if (!lBirthYear || !lBirthMonth || !lBirthDay) return alert("생년월일을 모두 입력해주세요.");
      if(parseInt(lBirthYear) < 1900 || parseInt(lBirthYear) > currentYear) return alert("유효한 년도를 입력해주세요.");

      if (!lNickname) return alert("닉네임을 입력해주세요.");
      if (lLicenseList.length === 0) return alert("자격증을 최소 1개 이상 추가해주세요.");
      if (!lEdu || !lOffice) return alert("변호사 상세 정보를 모두 입력해주세요.");

      const formattedLicenses = lLicenseList.map(lic => `${lic.name}(${lic.year})`).join(', ');

      userData = {
        id: lId,
        pw: lPw,
        name: lName,
        nickname: lNickname,
        email: `${lEmailPrefix}@${finalLDomain}`,
        phone: rawLPhone,
        birthDate: `${lBirthYear}-${padValue(lBirthMonth)}-${padValue(lBirthDay)}`,
        licenseName: formattedLicenses,
        education: lEdu,
        office: lOffice,
        role: 'LAWYER',
        status: 'PENDING'
      };
    }

    const res = await authApi.join(userData);
    if (res.success) {
      alert("회원가입 완료! 로그인 해주세요.");
      navigate('/login');
    }
  };

  return (
    <div className="login-container" style={{maxWidth: '560px'}}>
      <h2 className="login-title">회원가입</h2>
      
      <div className="join-tab-group">
        <button onClick={() => setRole('USER')} className={`join-tab-btn ${role === 'USER' ? 'active' : ''}`}>일반 회원</button>
        <button onClick={() => setRole('LAWYER')} className={`join-tab-btn ${role === 'LAWYER' ? 'active' : ''}`}>변호사 회원</button>
      </div>

      <div className="login-form">
        
        {/* ================================ */}
        {/* 일반 회원 가입 */}
        {/* ================================ */}
        {role === 'USER' && (
          <div className="unified-box">
            
            <div className="unified-item">
              <label className="unified-label">아이디</label>
              <div className="unified-input-wrapper">
                <input ref={idRef} className="unified-input" placeholder="영문 포함 아이디 입력 (6~20자)" value={userId} onChange={(e) => { setUserId(e.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '')); setIsIdChecked(false); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleIdCheck(); } }} />
                <button type="button" className="btn-unified-check" onClick={handleIdCheck}>중복확인</button>
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">비밀번호</label>
              <div className="unified-input-wrapper">
                <input ref={pwRef} type={showPw ? "text" : "password"} className="unified-input" placeholder="문자, 숫자, 특수문자 중 2개 포함 8~20자" value={userPw} onChange={(e) => setUserPw(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); pwConfirmRef.current?.focus(); } }} />
                <button type="button" className="btn-show-pw" onMouseDown={(e) => { e.preventDefault(); setShowPw(true); }} onMouseUp={() => setShowPw(false)} onMouseLeave={() => setShowPw(false)} onTouchStart={(e) => { e.preventDefault(); setShowPw(true); }} onTouchEnd={() => setShowPw(false)}>
                  {showPw ? '숨김' : '보기'}
                </button>
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">비밀번호 확인</label>
              <div className="unified-input-wrapper">
                <input ref={pwConfirmRef} type={showPwConfirm ? "text" : "password"} className="unified-input" placeholder="비밀번호 재입력" value={userPwConfirm} onChange={(e) => setUserPwConfirm(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); nameRef.current?.focus(); } }} />
                <button type="button" className="btn-show-pw" onMouseDown={(e) => { e.preventDefault(); setShowPwConfirm(true); }} onMouseUp={() => setShowPwConfirm(false)} onMouseLeave={() => setShowPwConfirm(false)} onTouchStart={(e) => { e.preventDefault(); setShowPwConfirm(true); }} onTouchEnd={() => setShowPwConfirm(false)}>
                  {showPwConfirm ? '숨김' : '보기'}
                </button>
              </div>
              {userPwConfirm.length > 0 && userPw !== userPwConfirm && (<div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', fontWeight: '600' }}>비밀번호가 다릅니다.</div>)}
              {userPwConfirm.length > 0 && userPw === userPwConfirm && (<div style={{ color: '#10b981', fontSize: '12px', marginTop: '8px', fontWeight: '600' }}>비밀번호가 일치합니다.</div>)}
            </div>

            <div className="unified-item">
              <label className="unified-label">이름</label>
              <div className="unified-input-wrapper">
                <input ref={nameRef} className="unified-input" placeholder="이름을 입력해주세요" value={userName} onChange={(e) => setUserName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); phoneRef.current?.focus(); } }} />
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">전화번호</label>
              <div className="unified-input-wrapper">
                <input ref={phoneRef} className="unified-input" placeholder="휴대폰 번호 입력" value={userPhone} maxLength="13" onChange={(e) => setUserPhone(formatPhone(e.target.value))} onKeyDown={(e) => { if (e.key === 'Backspace' && userPhone.endsWith('-')) { e.preventDefault(); setUserPhone(userPhone.slice(0, -2)); } else if (e.key === 'Enter') { e.preventDefault(); emailPrefixRef.current?.focus(); } }} />
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">이메일주소</label>
              <div className="unified-input-wrapper">
                <input ref={emailPrefixRef} className="unified-input" placeholder="이메일주소" value={emailPrefix} onChange={(e) => setEmailPrefix(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (emailDomain === 'custom') customDomainRef.current?.focus(); else yearRef.current?.focus(); } }} />
                <span style={{color:'#94a3b8', fontWeight:'bold'}}>@</span>
                {emailDomain === 'custom' && (
                  <input ref={customDomainRef} className="unified-input" placeholder="직접입력" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); yearRef.current?.focus(); } else if (e.key === 'Backspace' && !customDomain) emailPrefixRef.current?.focus(); }} />
                )}
                <select className="unified-select" value={emailDomain} onChange={(e) => { setEmailDomain(e.target.value); if(e.target.value === 'custom') setTimeout(() => customDomainRef.current?.focus(), 0); else yearRef.current?.focus(); }}>
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="custom">직접 입력</option>
                </select>
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">생년월일</label>
              <div className="unified-input-wrapper">
                <input ref={yearRef} className="unified-input" style={{textAlign: 'center'}} placeholder="YYYY" value={birthYear} maxLength="4" onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setBirthYear(val); if (val.length === 4) monthRef.current?.focus(); }} onBlur={(e) => { let val = e.target.value.replace(/\D/g, ''); if (val.length === 4) { const cy = new Date().getFullYear(); if (parseInt(val) > cy) val = cy.toString(); if (parseInt(val) < 1900) val = '1900'; } setBirthYear(val); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); monthRef.current?.focus(); } }} />
                <div className="vertical-divider"></div>
                <input ref={monthRef} className="unified-input" style={{textAlign: 'center'}} placeholder="MM" value={birthMonth} maxLength="2" onChange={(e) => { const val = validateMonth(e.target.value); setBirthMonth(val); if (val.length === 2) dayRef.current?.focus(); }} onBlur={(e) => { let val = validateMonth(e.target.value); if (val === '0' || val === '00') val = '01'; setBirthMonth(padValue(val)); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); dayRef.current?.focus(); } else if (e.key === 'Backspace' && !birthMonth) yearRef.current?.focus(); }} />
                <div className="vertical-divider"></div>
                <input ref={dayRef} className="unified-input" style={{textAlign: 'center'}} placeholder="DD" value={birthDay} maxLength="2" onChange={(e) => { const val = validateDay(e.target.value, birthYear, birthMonth); setBirthDay(val); if (val.length === 2) joinBtnRef.current?.focus(); }} onBlur={(e) => { let val = validateDay(e.target.value, birthYear, birthMonth); if (val === '0' || val === '00') val = '01'; setBirthDay(padValue(val)); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); joinBtnRef.current?.focus(); } else if (e.key === 'Backspace' && !birthDay) monthRef.current?.focus(); }} />
              </div>
            </div>
          </div>
        )}

        {/* ================================ */}
        {/* 변호사 회원 가입 */}
        {/* ================================ */}
        {role === 'LAWYER' && (
          <div className="unified-box">
            
            <div className="unified-item">
              <label className="unified-label">아이디</label>
              <div className="unified-input-wrapper">
                <input ref={lIdRef} className="unified-input" placeholder="영문 포함 아이디 입력 (6~20자)" value={lId} onChange={(e) => { setLId(e.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '')); setIsLIdChecked(false); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLawyerIdCheck(); } }} />
                <button type="button" className="btn-unified-check" onClick={handleLawyerIdCheck}>중복확인</button>
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">비밀번호</label>
              <div className="unified-input-wrapper">
                <input ref={lPwRef} type={showLPw ? "text" : "password"} className="unified-input" placeholder="문자, 숫자, 특수문자 중 2개 포함 8~20자" value={lPw} onChange={(e) => setLPw(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lPwConfirmRef.current?.focus(); } }} />
                <button type="button" className="btn-show-pw" onMouseDown={(e) => { e.preventDefault(); setShowLPw(true); }} onMouseUp={() => setShowLPw(false)} onMouseLeave={() => setShowLPw(false)} onTouchStart={(e) => { e.preventDefault(); setShowLPw(true); }} onTouchEnd={() => setShowLPw(false)}>
                  {showLPw ? '숨김' : '보기'}
                </button>
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">비밀번호 확인</label>
              <div className="unified-input-wrapper">
                <input ref={lPwConfirmRef} type={showLPwConfirm ? "text" : "password"} className="unified-input" placeholder="비밀번호 재입력" value={lPwConfirm} onChange={(e) => setLPwConfirm(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lNameRef.current?.focus(); } }} />
                <button type="button" className="btn-show-pw" onMouseDown={(e) => { e.preventDefault(); setShowLPwConfirm(true); }} onMouseUp={() => setShowLPwConfirm(false)} onMouseLeave={() => setShowLPwConfirm(false)} onTouchStart={(e) => { e.preventDefault(); setShowLPwConfirm(true); }} onTouchEnd={() => setShowLPwConfirm(false)}>
                  {showLPwConfirm ? '숨김' : '보기'}
                </button>
              </div>
              {lPwConfirm.length > 0 && lPw !== lPwConfirm && (<div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', fontWeight: '600' }}>비밀번호가 다릅니다.</div>)}
              {lPwConfirm.length > 0 && lPw === lPwConfirm && (<div style={{ color: '#10b981', fontSize: '12px', marginTop: '8px', fontWeight: '600' }}>비밀번호가 일치합니다.</div>)}
            </div>

            <div className="unified-item">
              <label className="unified-label">이름</label>
              <div className="unified-input-wrapper">
                <input ref={lNameRef} className="unified-input" placeholder="이름을 입력해주세요" value={lName} onChange={(e) => setLName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lPhoneRef.current?.focus(); } }} />
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">전화번호</label>
              <div className="unified-input-wrapper">
                <input ref={lPhoneRef} className="unified-input" placeholder="휴대폰 번호 입력" value={lPhone} maxLength="13" onChange={(e) => setLPhone(formatPhone(e.target.value))} onKeyDown={(e) => { if (e.key === 'Backspace' && lPhone.endsWith('-')) { e.preventDefault(); setLPhone(lPhone.slice(0, -2)); } else if (e.key === 'Enter') { e.preventDefault(); lEmailPrefixRef.current?.focus(); } }} />
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">이메일주소</label>
              <div className="unified-input-wrapper">
                <input ref={lEmailPrefixRef} className="unified-input" placeholder="이메일주소" value={lEmailPrefix} onChange={(e) => setLEmailPrefix(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (lEmailDomain === 'custom') lCustomDomainRef.current?.focus(); else lYearRef.current?.focus(); } }} />
                <span style={{color:'#94a3b8', fontWeight:'bold'}}>@</span>
                {lEmailDomain === 'custom' && (
                  <input ref={lCustomDomainRef} className="unified-input" placeholder="직접입력" value={lCustomDomain} onChange={(e) => setLCustomDomain(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lYearRef.current?.focus(); } else if (e.key === 'Backspace' && !lCustomDomain) lEmailPrefixRef.current?.focus(); }} />
                )}
                <select className="unified-select" value={lEmailDomain} onChange={(e) => { setLEmailDomain(e.target.value); if(e.target.value === 'custom') setTimeout(() => lCustomDomainRef.current?.focus(), 0); else lYearRef.current?.focus(); }}>
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="custom">직접 입력</option>
                </select>
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">생년월일</label>
              <div className="unified-input-wrapper">
                <input ref={lYearRef} className="unified-input" style={{textAlign: 'center'}} placeholder="YYYY" value={lBirthYear} maxLength="4" onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setLBirthYear(val); if (val.length === 4) lMonthRef.current?.focus(); }} onBlur={(e) => { let val = e.target.value.replace(/\D/g, ''); if (val.length === 4) { const cy = new Date().getFullYear(); if (parseInt(val) > cy) val = cy.toString(); if (parseInt(val) < 1900) val = '1900'; } setLBirthYear(val); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lMonthRef.current?.focus(); } }} />
                <div className="vertical-divider"></div>
                <input ref={lMonthRef} className="unified-input" style={{textAlign: 'center'}} placeholder="MM" value={lBirthMonth} maxLength="2" onChange={(e) => { const val = validateMonth(e.target.value); setLBirthMonth(val); if (val.length === 2) lDayRef.current?.focus(); }} onBlur={(e) => { let val = validateMonth(e.target.value); if (val === '0' || val === '00') val = '01'; setLBirthMonth(padValue(val)); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lDayRef.current?.focus(); } else if (e.key === 'Backspace' && !lBirthMonth) lYearRef.current?.focus(); }} />
                <div className="vertical-divider"></div>
                <input ref={lDayRef} className="unified-input" style={{textAlign: 'center'}} placeholder="DD" value={lBirthDay} maxLength="2" onChange={(e) => { const val = validateDay(e.target.value, lBirthYear, lBirthMonth); setLBirthDay(val); if (val.length === 2) lNicknameRef.current?.focus(); }} onBlur={(e) => { let val = validateDay(e.target.value, lBirthYear, lBirthMonth); if (val === '0' || val === '00') val = '01'; setLBirthDay(padValue(val)); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lNicknameRef.current?.focus(); } else if (e.key === 'Backspace' && !lBirthDay) lMonthRef.current?.focus(); }} />
              </div>
            </div>

            {/* ================================ */}
            {/* 변호사 회원 상세 정보 창 */}
            {/* ================================ */}
            <div className="unified-item" style={{ backgroundColor: '#f8fafc', borderTop: '2px solid #e2e8f0', borderBottom: '2px solid #e2e8f0', padding: '12px 20px' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>⚖️ 변호사 상세 정보 입력</span>
            </div>

            <div className="unified-item">
              <label className="unified-label">닉네임</label>
              <div className="unified-input-wrapper">
                <input ref={lNicknameRef} className="unified-input" placeholder="사용할 변호사 닉네임을 입력해주세요" value={lNickname} onChange={(e) => setLNickname(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lLicenseInputRef.current?.focus(); } }} />
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">자격증 명 및 취득년도 (여러 개 추가 가능)</label>
              <div className="unified-input-wrapper">
                <input 
                  ref={lLicenseInputRef} 
                  className="unified-input" 
                  style={{flex: 2}} 
                  placeholder="예: 변호사 자격증" 
                  value={lLicenseInput} 
                  onChange={(e) => setLLicenseInput(e.target.value)} 
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lLicenseYearRef.current?.focus(); } }} 
                />
                <div className="vertical-divider"></div>
                <input 
                  ref={lLicenseYearRef} 
                  className="unified-input" 
                  style={{flex: 1, textAlign: 'center'}} 
                  placeholder="취득년도" 
                  maxLength="4" 
                  value={lLicenseYearInput} 
                  onChange={(e) => setLLicenseYearInput(e.target.value.replace(/\D/g, ''))} 
                  onKeyDown={(e) => { 
                    if (e.key === 'Enter') { 
                      e.preventDefault(); 
                      if (!lLicenseInput && !lLicenseYearInput && lLicenseList.length > 0) {
                         lEduRef.current?.focus();
                      } else {
                         handleAddLicense(); 
                      }
                    } else if (e.key === 'Backspace' && !lLicenseYearInput) {
                      lLicenseInputRef.current?.focus();
                    }
                  }} 
                />
                <button type="button" className="btn-unified-check" onClick={handleAddLicense}>입력</button>
              </div>

              {lLicenseList.length > 0 && (
                <div style={{marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px'}}>
                   {lLicenseList.map((lic, idx) => (
                      <div key={idx} style={{display:'flex', justifyContent:'space-between', background:'#f1f5f9', padding:'8px 14px', borderRadius:'8px', fontSize:'14px', alignItems:'center', border: '1px solid #e2e8f0'}}>
                         <span style={{fontWeight:'700', color:'#334155'}}>
                           {lic.name} 
                           <span style={{color:'#64748b', fontSize:'13px', fontWeight:'600', marginLeft:'6px'}}>({lic.year}년)</span>
                         </span>
                         <button type="button" onClick={() => handleRemoveLicense(idx)} style={{background:'transparent', border:'none', color:'#ef4444', fontWeight:'bold', cursor:'pointer', padding:'4px'}}>삭제</button>
                      </div>
                   ))}
                </div>
              )}
            </div>

            <div className="unified-item">
              <label className="unified-label">최종 학력</label>
              <div className="unified-input-wrapper">
                <input ref={lEduRef} className="unified-input" placeholder="예: 서울대학교 법학과 졸업" value={lEdu} onChange={(e) => setLEdu(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lOfficeRef.current?.focus(); } }} />
              </div>
            </div>

            <div className="unified-item">
              <label className="unified-label">사무실 위치</label>
              <div className="unified-input-wrapper">
                <input ref={lOfficeRef} className="unified-input" placeholder="예: 서울시 서초구 서초대로..." value={lOffice} onChange={(e) => setLOffice(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lJoinBtnRef.current?.focus(); } }} />
              </div>
            </div>

          </div>
        )}

        <div className="action-group" style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
          <button ref={role === 'USER' ? joinBtnRef : lJoinBtnRef} onClick={handleJoin} className="login-btn primary flex-1" style={{marginTop: 0}}>가입하기</button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/login')} style={{flex: 1, padding: '16px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer'}}>가입취소</button>
        </div>

      </div>
    </div>
  );
};

export default JoinPage;