import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) {
      alert("검색어를 입력하세요!");
      return;
    }
    if (typeof onSearch === "function") {
      console.log(`🔍 검색 실행: ${keyword}`); // ✅ 디버깅 로그 추가
      onSearch(keyword); // ✅ `onSearch`가 존재하는 경우만 실행
    } else {
      console.error("❌ onSearch 함수가 정의되지 않았습니다.");
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default SearchBar;
