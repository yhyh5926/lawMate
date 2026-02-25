import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { memberApi } from '../../api/memberApi';
// import { AuthContext } from '../../context/AuthContext'; 
// import SocialLoginButtons from '../../components/member/SocialLoginButtons';

export default function LoginPage() {
  const navigate = useNavigate();
  // const { login } = useContext(AuthContext); // 로그인 상태 관리 context
  
  const [formData, setFormData] = useState({ loginId: '', password: '', saveIdYn: false });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await memberApi.login(formData.loginId, formData.password);
      if (response.data.code === 'SUCCESS') {
        const { token, memberType } = response.data.data;
        localStorage.setItem('accessToken', token);
        // login(token, memberType); // 전역 상태 업데이트
        navigate('/main.do');
      } else {
        setErrorMsg('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      setErrorMsg('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            type="text" name="loginId" placeholder="아이디" required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.loginId} onChange={handleChange} 
          />
        </div>
        <div>
          <input 
            type="password" name="password" placeholder="비밀번호" required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password} onChange={handleChange} 
          />
        </div>
        
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" name="saveIdYn" checked={formData.saveIdYn} onChange={handleChange} />
            <span>아이디 저장</span>
          </label>
          <div className="text-sm text-gray-500">
            <Link to="/member/find.do" className="hover:underline">아이디/비밀번호 찾기</Link>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          로그인
        </button>
      </form>
      
      <div className="mt-6 border-t pt-4">
        <p className="text-center text-sm text-gray-500 mb-4">소셜 로그인</p>
        {/* <SocialLoginButtons /> */}
      </div>

      <div className="mt-4 text-center text-sm">
        아직 회원이 아니신가요? <Link to="/member/join/terms.do" className="text-blue-600 hover:underline">회원가입</Link>
      </div>
    </div>
  );
}