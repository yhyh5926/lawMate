// src/pages/auth/FindPage.jsx
// ================================
// 아이디 및 비밀번호 찾기 페이지
// ================================

import React, { useState } from 'react';
import { authApi } from '../../api/auth_api';
import '../../styles/auth/Auth.css';

const FindPage = () => {
  const [tab, setTab] = useState('ID');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [result, setResult] = useState('');


  {/* ================================ */}
  {/* 비밀번호, 아이디 출력 */}
  {/* ================================ */}
  const handleFind = async () => {
    setResult('');
    try {
      if (tab === 'ID') {
        const foundId = await authApi.findId(email);
        setResult(`회원님의 아이디는 [ ${foundId} ] 입니다.`);
      } else {
        const foundPw = await authApi.findPw(id, email);
        setResult(`임시 비밀번호는 [ ${foundPw} ] 입니다.`);
      }
    } catch (err) {
      alert(err);
    }
  };

  
  return (
    <div className="login-container">
      <h2 className="login-title">{tab === 'ID' ? '아이디 찾기' : '비밀번호 찾기'}</h2>
      
      <div className="join-tab-group">
        <button 
          onClick={() => { setTab('ID'); setResult(''); }} 
          className={`join-tab-btn ${tab === 'ID' ? 'active' : ''}`}
        >
          아이디 찾기
        </button>
        <button 
          onClick={() => { setTab('PW'); setResult(''); }} 
          className={`join-tab-btn ${tab === 'PW' ? 'active' : ''}`}
        >
          비밀번호 찾기
        </button>
      </div>

      <div className="login-form">
        {/* ================================ */}
        {/* 비밀번호 찾기 */}
        {/* ================================ */}
        {tab === 'PW' && (
          <input 
            placeholder="아이디를 입력하세요" 
            value={id} 
            onChange={(e)=>setId(e.target.value)} 
            className="login-input"
          />
        )}
        
        {/* ================================ */}
        {/* 아이디 찾기 */}
        {/* ================================ */}
        <input 
          placeholder="가입한 이메일을 입력하세요" 
          value={email} 
          onChange={(e)=>setEmail(e.target.value)} 
          className="login-input"
        />
        <button onClick={handleFind} className="login-btn">
          {tab === 'ID' ? '아이디 찾기' : '비밀번호 찾기'}
        </button>
      </div>
      
      {result && <div className="result-box">{result}</div>}
    </div>
  );
};

export default FindPage;