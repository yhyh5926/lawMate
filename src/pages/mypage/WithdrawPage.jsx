import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberApi } from '../../api/memberApi';

export default function WithdrawPage() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const handleWithdraw = async () => {
    if (!isChecked) {
      alert('탈퇴 안내 사항에 동의해주세요.');
      return;
    }

    if (window.confirm('정말 탈퇴하시겠습니까? (이 작업은 되돌릴 수 없으며, 계정 상태가 즉시 비활성화됩니다)')) {
      try {
        await memberApi.withdraw(); // 서버에서 TB_MEMBER STATUS = WITHDRAWN 처리
        localStorage.removeItem('accessToken');
        alert('회원 탈퇴가 완료되었습니다.');
        navigate('/main.do');
      } catch (error) {
        alert('탈퇴 처리 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-red-600 mb-4">회원 탈퇴</h2>
      <div className="bg-red-50 p-4 border border-red-200 rounded-md mb-6">
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
          <li>탈퇴 시 작성하신 1:1 채팅 내역 및 상담 정보에 대한 접근이 제한됩니다.</li>
          <li>플랫폼 내 게시글 및 댓글은 자동 삭제되지 않으므로, 탈퇴 전 직접 삭제 바랍니다.</li>
          <li>관련 법령에 의거하여 결제 내역 등 일부 정보는 일정 기간 보관됩니다.</li>
        </ul>
      </div>
      <label className="flex items-center space-x-2 mb-6">
        <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
        <span className="font-semibold text-gray-800">위 안내 사항을 모두 확인하였으며, 탈퇴에 동의합니다.</span>
      </label>
      <button onClick={handleWithdraw} className="w-full bg-red-600 text-white py-3 rounded-md font-bold hover:bg-red-700">
        회원 탈퇴 진행
      </button>
    </div>
  );
}