import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";
import precedentApi from "../../api/precedentApi";
import { categories } from "../../constants/categories.js";
import "../../styles/question/QuestionWritePage.css";
import { useAuthStore } from "../../store/authStore.js";
import { scrollToTop } from "./../../utils/windowUtils";

const QuestionWritePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileInputRef = useRef(null);

  const caseGuides = {
    민사: "금액, 계약 관계, 채무 불이행 시점을 명시해 주세요.",
    형사: "사건 발생 일시, 장소, 증거 확보 여부를 적어주세요.",
    부동산: "임대차 기간, 보증금 액수, 확정일자 유무를 포함해 주세요.",
    노동: "입사/퇴사일, 체불 임금 총액, 근로계약서 유무를 알려주세요.",
    기타: "피해 상황과 원하는 해결 방향을 구체적으로 적어주세요.",
  };

  const [formData, setFormData] = useState({
    title: "",
    caseType: "민사",
    content: "",
  });

  // 💡 파일 상태를 { file, preview } 객체 배열로 변경
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [relatedPrecedents, setRelatedPrecedents] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 💡 이미지 여부 확인 함수
  const isImageFile = (file) => {
    return file.type.startsWith("image/");
  };

  useEffect(() => {
    scrollToTop();
  }, []);
  // 💡 파일 처리 공통 로직 (미리보기 생성)
  const handleFiles = (files) => {
    const nextFiles = files.map((file) => ({
      file,
      preview: isImageFile(file) ? URL.createObjectURL(file) : null,
    }));
    setSelectedFiles((prev) => [...prev, ...nextFiles]);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.title.trim().length > 2) {
        setIsSearching(true);
        try {
          const result = await precedentApi.getRelatedPrecedents(
            formData.caseType,
            formData.title.trim(),
            null,
          );
          setRelatedPrecedents(result || []);
        } catch (err) {
          console.error("유사 판례 검색 실패:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setRelatedPrecedents([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.title, formData.caseType]);

  // 💡 메모리 누수 방지 (미리보기 URL 해제)
  useEffect(() => {
    return () => {
      selectedFiles.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [selectedFiles]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    e.target.value = ""; // 동일 파일 재선택 가능하도록
  };

  const removeFile = (index) => {
    if (selectedFiles[index].preview) {
      URL.revokeObjectURL(selectedFiles[index].preview);
    }
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("caseType", formData.caseType);
    uploadData.append("content", formData.content);
    uploadData.append("memberId", user?.memberId);

    // 💡 실제 File 객체만 추출하여 전달
    selectedFiles.forEach((obj) => {
      uploadData.append("uploadFiles", obj.file);
    });

    try {
      await questionApi.writeQuestion(uploadData);
      alert("질문이 성공적으로 등록되었습니다.");
      navigate("/question/list");
    } catch (error) {
      console.error("질문 등록 실패:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="qw-container">
      <h2 className="qw-title">⚖️ 법률 질문 작성</h2>
      <p className="qw-subtitle">
        전문 변호사가 상세하고 정확한 답변을 도와드립니다.
      </p>

      <form
        onSubmit={handleSubmit}
        className="qw-form"
        encType="multipart/form-data"
      >
        <div className="qw-field">
          <label className="qw-label">사건 유형</label>
          <select
            name="caseType"
            className="qw-select"
            value={formData.caseType}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="qw-field">
          <label className="qw-label">질문 제목</label>
          <input
            type="text"
            name="title"
            className="qw-input"
            placeholder="어떤 점이 궁금하신가요?"
            value={formData.title}
            onChange={handleChange}
          />
          {isSearching && (
            <div className="qw-searching-status">
              <span className="mini-spinner"></span> 유사한 판례를 분석하고
              있습니다...
            </div>
          )}
          {!isSearching && relatedPrecedents.length > 0 && (
            <div className="qw-related-hints">
              <p className="hint-title">🔍 혹시 이런 판례를 찾으시나요?</p>
              {relatedPrecedents.map((prec) => (
                <div
                  key={prec.precId}
                  className="hint-item"
                  onClick={() =>
                    window.open(`/precedent/detail/${prec.precId}`, "_blank")
                  }
                >
                  <span className="hint-tag">참고</span> {prec.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. 파일 첨부 (미리보기 추가) */}
        <div className="qw-field">
          <label className="qw-label">증거 자료 첨부 (선택)</label>
          <div
            className="qw-file-dropzone"
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(Array.from(e.dataTransfer.files));
            }}
          >
            <span className="upload-icon">📁</span>
            <p>클릭하거나 파일을 여기로 끌어다 놓으세요.</p>
            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="qw-file-list">
              {selectedFiles.map((obj, idx) => (
                <div key={idx} className="file-item">
                  <div className="file-info">
                    {/* 💡 이미지 미리보기 또는 아이콘 노출 */}
                    {obj.preview ? (
                      <img
                        src={obj.preview}
                        alt="preview"
                        className="qw-preview-img"
                      />
                    ) : (
                      <span className="file-icon">📄</span>
                    )}
                    <span className="file-name">{obj.file.name}</span>
                  </div>
                  <button
                    type="button"
                    className="file-remove"
                    onClick={() => removeFile(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="qw-field">
          <label className="qw-label">상세 내용</label>
          <div className="qw-smart-guide">
            <span className="guide-icon">💡</span>
            <span className="guide-text">
              <strong>{formData.caseType} 작성 팁:</strong>{" "}
              {caseGuides[formData.caseType] || caseGuides["기타"]}
            </span>
          </div>
          <textarea
            name="content"
            className="qw-textarea"
            placeholder="사건 경위를 상세히 적어주세요."
            value={formData.content}
            onChange={handleChange}
          />
        </div>

        <div className="qw-actions">
          <button
            type="button"
            className="qw-cancel-btn"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button type="submit" className="qw-submit-btn">
            질문 등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionWritePage;
