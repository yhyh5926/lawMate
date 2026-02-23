import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchIcon() {
  return (
    <svg
      className="searchIcon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm0-2a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm8.85 4.27-4.2-4.2 1.41-1.41 4.2 4.2-1.41 1.41Z"
      />
    </svg>
  );
}

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const go = () => {
    const q = keyword.trim();
    navigate(`/precedent?query=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") go();
  };

  return (
    <div className="searchWrap">
      <div className="searchBox">
        <SearchIcon />
        <input
          className="searchInput"
          placeholder="판례를 검색하세요 (Enter)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="판례 검색"
        />
      </div>
    </div>
  );
}
