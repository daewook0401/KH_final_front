import { useState } from "react";
import axios from "axios";

function BillVerification({ isOpen, onClose, onVerified }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

  const handleSubmit = async () => {
    if (!image) {
      alert("이미지를 업로드해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("receiptImage", image);

    setLoading(true);
    try {
      await axios.post("/api/receipts/verify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("영수증 인증이 완료되었습니다!");
      onVerified();
      onClose();
    } catch (error) {
      console.error("영수증 인증 실패:", error);
      alert("영수증 인증에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <h2 className="text-xl font-semibold">영수증 인증</h2>

        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer transition ${
            dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300"
          }`}
        >
          <p className="text-gray-500 text-sm mb-2">
            이미지를 드래그하거나 클릭해서 업로드하세요
          </p>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {preview && (
          <img
            src={preview}
            alt="미리보기"
            className="w-full rounded-md border border-gray-300 mt-2"
          />
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-lg"
            onClick={onClose}
            disabled={loading}
          >
            취소
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "확인 중..." : "인증 제출"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillVerification;
