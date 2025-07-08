import React, { useState, useRef, useEffect } from "react";

const TagSelector = ({
  allTags,
  selectedTags,
  onSelectionChange,
  maxSelection,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const filteredTags = allTags.filter(
    (tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  const handleAddTag = (tag) => {
    if (selectedTags.length < maxSelection) {
      const newTags = [...selectedTags, tag];
      onSelectionChange(newTags);
      setSearchTerm("");
      setIsDropdownOpen(false);
    } else {
      alert(`태그는 최대 ${maxSelection}개까지 선택할 수 있습니다.`);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    onSelectionChange(newTags);
  };

  // 1. Enter 키 입력을 처리할 핸들러 함수 추가
  const handleKeyDown = (event) => {
    // 엔터 키가 눌렸는지 확인
    if (event.key === "Enter") {
      // 폼 제출과 같은 기본 동작을 막음
      event.preventDefault();

      // 검색 결과가 있을 경우, 가장 위의 항목을 추가
      if (filteredTags.length > 0) {
        handleAddTag(filteredTags[0]);
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-300 rounded min-h-[46px]">
        {selectedTags.map((tag) => (
          <div
            key={tag}
            className="flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
            >
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          // 2. input에 onKeyDown 핸들러 연결
          onKeyDown={handleKeyDown}
          placeholder={
            selectedTags.length < maxSelection
              ? "태그 검색 후 Enter!"
              : "최대 5개 선택 완료"
          }
          disabled={selectedTags.length >= maxSelection}
          className="flex-grow p-1 outline-none bg-transparent"
        />
      </div>

      {isDropdownOpen && searchTerm && filteredTags.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <ul>
            {filteredTags.slice(0, 10).map((tag) => (
              <li
                key={tag}
                onClick={() => handleAddTag(tag)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
