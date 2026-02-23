// src/pages/auth/LoginPage.jsx
// ================================
// 로그인 페이지
// ================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth_api';
import useAuthStore from '../../zustand/auth_store';
import '../../styles/auth/Auth.css';

const LoginPage = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await authApi.login(id, pw);
      login(user);
      alert(`${user.name}님 환영합니다!`);
      if (user.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div>
          <label className="input-label">아이디</label>
          <input 
            className="login-input" 
            placeholder="아이디를 입력하세요" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
          />
        </div>
        <div>
          <label className="input-label">비밀번호</label>
          <input 
            type="password"
            className="login-input" 
            placeholder="비밀번호를 입력하세요" 
            value={pw} 
            onChange={(e) => setPw(e.target.value)} 
          />
        </div>
        <button type="submit" className="login-btn">로그인</button>
      </form>
      <div className="login-links">
        <span onClick={() => navigate('/find/user')}>아이디/비밀번호 찾기</span> | 
        <span onClick={() => navigate('/join')}>회원가입</span>
      </div>
    </div>
  );
};

export default LoginPage;