// (Deprecated) 이전 샘플 파일 - 프로젝트 공용 Modal로 대체 권장
import React from "react";
import Modal from "../../components/common/Modal";

const NoticeModal = ({ isOpen, onClose, detail }) => {
  return (
    <Modal isOpen={isOpen} title={detail?.title || "공지사항"} onClose={onClose}>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
        {detail?.createdAt ? new Date(detail.createdAt).toLocaleString() : ""}
      </div>
      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
        {detail?.content || "내용이 없습니다."}
      </div>
    </Modal>
  );
};

export default NoticeModal;
