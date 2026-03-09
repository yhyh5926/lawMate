import React, { useState, useRef, useEffect } from "react";
import { questionApi } from "../../api/questionApi.js";
import { categories } from "../../constants/categories.js";
import { baseURL } from "../../constants/baseURL.js";
import "../../styles/question/QuestionEditForm.css";

const QuestionEditForm = ({ detail, onSaveSuccess, onCancel }) => {
  const [editForm, setEditForm] = useState({
    title: detail?.title || "",
    content: detail?.content || "",
    caseType: detail?.caseType || categories[0],
  });

  // 파일 관련 상태
  const [existingFiles, setExistingFiles] = useState(detail?.files || []);
  const [newFiles, setNewFiles] = useState([]); // { file: File객체, preview: string }
  const [deletedFileIds, setDeletedFileIds] = useState([]);
  const fileInputRef = useRef(null);

  // 💡 이미지 확장자 체크 (에러 방지 로직 포함)
  const isImageFile = (fileName) => {
    if (!fileName) return false;
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const parts = fileName.split(".");
    if (parts.length <= 1) return false;
    return imageExtensions.includes(parts.pop().toLowerCase());
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // 기존 파일 삭제
  const handleRemoveExisting = (fileId) => {
    setExistingFiles(existingFiles.filter((f) => f.fileId !== fileId));
    setDeletedFileIds([...deletedFileIds, fileId]);
  };

  // 신규 파일 추가 및 미리보기 생성
  const handleNewFileChange = (e) => {
    const files = Array.from(e.target.files);

    const nextFiles = files.map((file) => ({
      file: file,
      preview: isImageFile(file.name) ? URL.createObjectURL(file) : null,
    }));

    setNewFiles([...newFiles, ...nextFiles]);
    e.target.value = ""; // 동일 파일 재업로드 가능하도록 초기화
  };

  // 신규 파일 취소 (메모리 해제)
  const handleRemoveNew = (index) => {
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview);
    }
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("questionId", detail.questionId);
      formData.append("title", editForm.title);
      formData.append("content", editForm.content);
      formData.append("caseType", editForm.caseType);

      // 삭제된 파일 ID 리스트 (서버에서 처리 필요)
      formData.append("deletedFileIds", JSON.stringify(deletedFileIds));

      // 신규 파일 객체들만 추가
      newFiles.forEach((obj) => formData.append("files", obj.file));

      const res = await questionApi.updateQuestion(formData);
      if (res.data.success) {
        alert("질문이 성공적으로 수정되었습니다.");
        onSaveSuccess();
      }
    } catch (error) {
      alert("수정 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  // 메모리 누수 방지: 컴포넌트 언마운트 시 생성된 URL 해제
  useEffect(() => {
    return () => {
      newFiles.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [newFiles]);

  return (
    <div className="inline-edit-form">
      <div className="edit-field">
        <select
          name="caseType"
          className="edit-select"
          value={editForm.caseType}
          onChange={handleInputChange}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          name="title"
          className="edit-title-input"
          value={editForm.title}
          onChange={handleInputChange}
          placeholder="제목을 입력하세요"
        />
      </div>

      <textarea
        name="content"
        className="edit-content-textarea"
        value={editForm.content}
        onChange={handleInputChange}
        placeholder="내용을 입력하세요"
      />

      <div className="edit-file-section">
        <p className="file-label">첨부 파일 관리</p>

        {/* 1. 기존 파일 목록 (이미지 미리보기 포함) */}
        <div className="file-list">
          {existingFiles.map((file) => (
            <div
              key={file.fileId || file.attachId}
              className="file-item existing"
            >
              <div className="file-info">
                {isImageFile(file.origName) ? (
                  <img
                    src={baseURL + file.savePath}
                    alt="preview"
                    className="edit-preview-img"
                    onError={(e) => {
                      e.target.src = "/images/no-image.png";
                    }}
                  />
                ) : (
                  <span className="file-icon">📄</span>
                )}
                <span className="file-name">{file.origName}</span>
              </div>
              <button
                type="button"
                className="file-del-btn"
                onClick={() =>
                  handleRemoveExisting(file.fileId || file.attachId)
                }
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        {/* 2. 새 파일 업로드 존 */}
        <div
          className="file-upload-zone"
          onClick={() => fileInputRef.current.click()}
        >
          <span>📎 클릭하여 새 파일을 추가하세요 (이미지 미리보기 지원)</span>
          <input
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleNewFileChange}
          />
        </div>

        {/* 3. 신규 추가 대기 목록 */}
        <div className="file-list">
          {newFiles.map((obj, idx) => (
            <div key={idx} className="file-item new">
              <div className="file-info">
                {obj.preview ? (
                  <img
                    src={obj.preview}
                    alt="new-preview"
                    className="edit-preview-img"
                  />
                ) : (
                  <span className="file-icon">🆕</span>
                )}
                <span className="file-name">{obj.file.name}</span>
              </div>
              <button
                type="button"
                className="file-del-btn"
                onClick={() => handleRemoveNew(idx)}
              >
                취소
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="edit-control-group">
        <button className="action-btn save" onClick={handleSubmit}>
          수정 완료
        </button>
        <button className="action-btn cancel" onClick={onCancel}>
          취소
        </button>
      </div>
    </div>
  );
};

export default QuestionEditForm;
