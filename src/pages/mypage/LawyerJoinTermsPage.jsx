import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LawyerJoinTermsPage() {
  const navigate = useNavigate();
  const [terms, setTerms] = useState({ all: false, service: false, privacy: false, lawyerPolicy: false });

  const handleAllCheck = (e) => {
    const isChecked = e.target.checked;
    setTerms({ all: isChecked, service: isChecked, privacy: isChecked, lawyerPolicy: isChecked });
  };

  const handleSingleCheck = (e) => {
    const newTerms = { ...terms, [e.target.name]: e.target.checked };
    newTerms.all = newTerms.service && newTerms.privacy && newTerms.lawyerPolicy;
    setTerms(newTerms);
  };

  const handleNext = () => {
    if (!terms.service || !terms.privacy || !terms.lawyerPolicy) {
      alert('필수 약관에 모두 동의해주세요.');
      return;
    }
    navigate('/member/lawyer/form.do');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-2 text-center text-indigo-800">전문회원 가입 약관 동의</h2>
      <p className="text-center text-gray-500 mb-6 text-sm">변호사 자격을 증명할 수 있는 회원만 가입 가능합니다.</p>
      
      <div className="border p-4 rounded-md mb-6 bg-indigo-50 border-indigo-100">
        <label className="flex items-center font-bold text-lg cursor-pointer">
          <input type="checkbox" className="w-5 h-5 mr-3 accent-indigo-600" checked={terms.all} onChange={handleAllCheck} />
          전체 약관 및 정책에 동의합니다.
        </label>
      </div>

      <div className="space-y-4 mb-8">
        {/* 서비스 / 개인정보 약관은 생략 (일반회원과 동일 구조) */}
        <label className="flex items-center cursor-pointer"><input type="checkbox" name="service" className="mr-2" checked={terms.service} onChange={handleSingleCheck} /> [필수] 서비스 이용약관 동의</label>
        <label className="flex items-center cursor-pointer"><input type="checkbox" name="privacy" className="mr-2" checked={terms.privacy} onChange={handleSingleCheck} /> [필수] 개인정보 수집 및 이용 동의</label>
        
        <div>
          <label className="flex items-center cursor-pointer mb-2">
            <input type="checkbox" name="lawyerPolicy" className="w-5 h-5 mr-3 accent-indigo-600" checked={terms.lawyerPolicy} onChange={handleSingleCheck} />
            <span className="font-semibold text-indigo-700">[필수] 전문회원 운영 정책 동의</span>
          </label>
          <div className="h-24 overflow-y-scroll text-sm text-gray-600 border p-3 rounded bg-gray-50">
            제1조 (자격 증명) 전문회원은 가입 시 입력한 변호사 자격번호가 허위일 경우 즉시 계정이 정지되며...<br/>
            제2조 (수수료 및 정산) 상담 결제 시 발생하는 수수료율은 플랫폼 정책에 따르며...
          </div>
        </div>
      </div>

      <button onClick={handleNext} className={`w-full py-3 rounded-md font-bold text-white transition-colors ${terms.service && terms.privacy && terms.lawyerPolicy ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-gray-400'}`}>
        전문회원 정보 입력 단계로
      </button>
    </div>
  );
}