// src/pages/mypage/MyPageEdit.jsx
// ================================
// 내 정보 수정 페이지
// ================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../zustand/auth_store';
import { authApi } from '../../api/auth_api';
import '../../styles/auth/Auth.css'; 

const MyPageEdit = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: '', confirmPassword: '', nickname: '', 
    education: '', phone: '', office: '' 
  });

  useEffect(() => {
    if (user) {
      setForm({
        password: user.password,
        confirmPassword: user.password,
        nickname: user.nickname,
        education: user.role === 'LAWYER' ? user.education : '',
        phone: user.role === 'LAWYER' ? (user.phone || '') : '',
        office: user.role === 'LAWYER' ? (user.office || '') : '',
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return alert("비밀번호가 일치하지 않습니다.");
    }

    try {
      const updateData = {
        id: user.id,
        password: form.password,
        nickname: form.nickname,
        ...(user.role === 'LAWYER' && { 
            education: form.education,
            phone: form.phone,
            office: form.office
        })
      };

      const updatedUser = await authApi.updateUser(updateData);
      updateUser(updatedUser); 
      
      alert("정보가 수정되었습니다.");
      navigate('/mypage');

    } catch (error) {
      alert("수정 실패: " + error);
    }
  };

  if (!user) return null;

  return (
    <div className="login-container">
      <h2 className="login-title">내 정보 수정</h2>
      
      <form className="login-form" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label className="input-label">아이디 (수정불가)</label>
          <input className="login-input readonly-input" value={user.id} disabled />
        </div>

        <div className="form-group">
          <label className="input-label">닉네임</label>
          <input name="nickname" className="login-input" value={form.nickname} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="input-label">비밀번호</label>
          <input type="password" name="password" className="login-input" value={form.password} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="input-label">비밀번호 확인</label>
          <input type="password" name="confirmPassword" className="login-input" value={form.confirmPassword} onChange={handleChange} />
        </div>


        {/* ================================ */}
        {/* 변호사 정보 수정 */}
        {/* ================================ */}
        {user.role === 'LAWYER' && (
          <div className="lawyer-edit-section">
            <h4 className="lawyer-edit-title">⚖️ 변호사 정보 수정</h4>
            
            <div className="form-group">
                <label className="input-label">최종 학력</label>
                <input name="education" className="login-input" value={form.education} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="input-label">전화번호</label>
                <input name="phone" className="login-input" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="input-label">사무실 위치</label>
                <input name="office" className="login-input" value={form.office} onChange={handleChange} />
            </div>
            
            <p className="lawyer-edit-notice">
              * 자격증명은 관리자 승인 사항이므로 수정할 수 없습니다.
            </p>
          </div>
        )}

        <div className="edit-btn-group">
            <button type="submit" className="login-btn primary">수정 완료</button>
            <button type="button" onClick={() => navigate('/mypage')} className="login-btn secondary">취소</button>
        </div>

      </form>
    </div>
  );
};

export default MyPageEdit;