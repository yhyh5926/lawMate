import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JoinTermsPage() {
  const navigate = useNavigate();
  const [terms, setTerms] = useState({
    all: false,
    service: false,
    privacy: false,
    marketing: false,
  });

  const handleAllCheck = (e) => {
    const isChecked = e.target.checked;
    setTerms({ all: isChecked, service: isChecked, privacy: isChecked, marketing: isChecked });
  };

  const handleSingleCheck = (e) => {
    const { name, checked } = e.target;
    const newTerms = { ...terms, [name]: checked };
    newTerms.all = newTerms.service && newTerms.privacy && newTerms.marketing;
    setTerms(newTerms);
  };

  const handleNext = () => {
    if (!terms.service || !terms.privacy) {
      alert('필수 약관에 모두 동의해주세요.');
      return;
    }
    // 마케팅 동의 여부를 state나 localStorage로 넘겨줄 수 있습니다.
    navigate('/member/join/form.do', { state: { marketing: terms.marketing } });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입 약관 동의</h2>
      
      <div className="border p-4 rounded-md mb-6 bg-gray-50">
        <label className="flex items-center font-bold text-lg cursor-pointer">
          <input type="checkbox" className="w-5 h-5 mr-3" checked={terms.all} onChange={handleAllCheck} />
          전체 약관에 동의합니다.
        </label>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="flex items-center cursor-pointer mb-2">
            <input type="checkbox" name="service" className="w-5 h-5 mr-3" checked={terms.service} onChange={handleSingleCheck} />
            <span className="font-semibold">[필수] 서비스 이용약관 동의</span>
          </label>
          <div className="h-24 overflow-y-scroll text-sm text-gray-600 border p-3 rounded bg-gray-50">
            제1조 (목적) 본 약관은 LawMate가 제공하는 법률 분쟁해결 플랫폼 서비스의 이용과 관련하여...
          </div>
        </div>

        <div>
          <label className="flex items-center cursor-pointer mb-2">
            <input type="checkbox" name="privacy" className="w-5 h-5 mr-3" checked={terms.privacy} onChange={handleSingleCheck} />
            <span className="font-semibold">[필수] 개인정보 수집 및 이용 동의</span>
          </label>
          <div className="h-24 overflow-y-scroll text-sm text-gray-600 border p-3 rounded bg-gray-50">
            LawMate는 서비스 제공을 위해 아래와 같이 개인정보를 수집 및 이용합니다...
          </div>
        </div>
      </div>

      <button 
        onClick={handleNext} 
        className={`w-full py-3 rounded-md font-bold text-white transition-colors ${terms.service && terms.privacy ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        다음 단계
      </button>
    </div>
  );
}