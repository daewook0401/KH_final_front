import { useState, useRef, useEffect } from "react";

function BillVerification({ isOpen, onClose, onVerified }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handlePreviewClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = () => {
    if (!image) {
      alert("이미지를 업로드해주세요.");
      return;
    }
    // 이미지 파일 자체를 부모에게 넘김
    onVerified(image);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4">
        <h2 className="text-xl font-semibold">영수증 인증</h2>

        {!preview ? (
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer transition ${
              dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300"
            }`}
          >
            <p className="text-gray-500 text-sm mb-2">
              이미지를 드래그하거나 클릭해서 업로드하세요
            </p>
          </label>
        ) : (
          <img
            src={preview}
            alt="미리보기"
            className="w-full rounded-md border border-gray-300 mt-2 cursor-pointer"
            onClick={handlePreviewClick}
          />
        )}

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-lg"
            onClick={() => {
              setImage(null);
              setPreview(null);
              onClose();
            }}
          >
            취소
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            onClick={handleSubmit}
          >
            인증 완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillVerification;
