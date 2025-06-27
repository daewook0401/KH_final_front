import React, { useState, useEffect } from "react";

const MAIN_CATEGORIES = ["한식", "중식", "일식"];
const TAG_CATEGORIES = [
  "양식",
  "피자",
  "바베큐",
  "카페",
  "분위기 좋은",
  "가성비",
];

const RestaurantInsert = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    storePhone: "",
    storeDescription: "",
    mainCategory: "",
    postcode: "",
    address: "",
    latitude: "",
    longitude: "",
    siCode: "",
    sigunguCode: "",
    emdCode: "",
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTags((prev) => [...prev, value]);
    } else {
      setSelectedTags((prev) => prev.filter((tag) => tag !== value));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mainCategory) {
      alert("대분류를 선택해주세요.");
      return;
    }

    if (selectedTags.length === 0) {
      alert("태그를 1개 이상 선택해주세요.");
      return;
    }

    const submissionData = new FormData();
    const cuisineTypes = [formData.mainCategory, ...selectedTags].filter(
      Boolean
    );

    submissionData.append("restaurantName", formData.storeName);
    submissionData.append("restaurantAddress", formData.address);
    submissionData.append("restaurantSiCode", formData.siCode);
    submissionData.append("restaurantGuCode", formData.sigunguCode);
    submissionData.append("restaurantDongCode", formData.emdCode);
    submissionData.append("restaurantPostalCode", formData.postcode);
    submissionData.append("restaurantPhoneNumber", formData.storePhone);
    submissionData.append("restaurantDescription", formData.storeDescription);
    submissionData.append("restaurantMapX", formData.longitude);
    submissionData.append("restaurantMapZ", formData.latitude);

    cuisineTypes.forEach((type) => {
      submissionData.append("restaurantCuisineType", type);
    });

    if (imageFile) {
      submissionData.append("restaurantMainPhoto", imageFile);
    }

    console.log(" 서버로 전송될 최종 데이터 (FormData):");
    for (let [key, value] of submissionData.entries()) {
      console.log(`  ${key}:`, value);
    }

    try {
      const response = await fetch("/api/stores/register", {
        method: "POST",
        body: submissionData,
      });
      if (response.ok) {
        const result = await response.json();
        alert("맛집이 성공적으로 등록되었습니다!");
        console.log("✅ 등록 완료:", result);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "등록에 실패했습니다.");
      }
    } catch (error) {
      console.error(" 등록 에러:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!isPostcodeOpen) return;
    const elementWrap = document.getElementById("postcode-wrap");
    new window.daum.Postcode({
      oncomplete: (data) => {
        const { zonecode, roadAddress, jibunAddress, bcode, sigunguCode } =
          data;
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(roadAddress, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            setFormData((prev) => ({
              ...prev,
              postcode: zonecode,
              address: jibunAddress,
              siCode: sigunguCode.substring(0, 2),
              sigunguCode: sigunguCode,
              emdCode: bcode,
              latitude: result[0].y,
              longitude: result[0].x,
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              postcode: zonecode,
              address: jibunAddress,
              siCode: sigunguCode.substring(0, 2),
              sigunguCode: sigunguCode,
              emdCode: bcode,
            }));
          }
        });
        setIsPostcodeOpen(false);
      },
      width: "100%",
      height: "100%",
    }).embed(elementWrap);
  }, [isPostcodeOpen]);

  useEffect(() => {
    console.log(" formData가 변경되었습니다:", formData);
  }, [formData]);
  useEffect(() => {
    console.log(" 선택된 태그:", selectedTags);
  }, [selectedTags]);
  useEffect(() => {
    if (imageFile) {
      console.log(" 선택된 이미지 파일:", imageFile);
    }
  }, [imageFile]);

  return (
    <div className="max-w-[600px] my-5 mx-auto p-8 border border-gray-200 rounded-lg font-sans">
      <h2 className="text-center mb-6 text-2xl font-bold">맛집 등록</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="storeName"
            className="block mb-2 font-semibold text-sm"
          >
            가게 이름
          </label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded text-base"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-sm">주소</label>
          <div className="flex gap-2 items-center mb-2">
            <input
              type="text"
              name="postcode"
              placeholder="우편번호"
              value={formData.postcode}
              readOnly
              className="w-full p-3 border border-gray-300 rounded text-base bg-gray-100 cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setIsPostcodeOpen(true)}
              className="py-3 px-4 text-white rounded cursor-pointer text-base font-semibold transition-colors duration-200 whitespace-nowrap bg-gray-700 hover:bg-gray-900"
            >
              주소 검색
            </button>
          </div>
          <input
            type="text"
            name="address"
            placeholder="지번 주소"
            value={formData.address}
            readOnly
            className="w-full p-3 border border-gray-300 rounded text-base bg-gray-100 cursor-not-allowed"
          />
          {isPostcodeOpen && (
            <div
              id="postcode-wrap"
              className="border border-gray-700 w-full h-[400px] mt-3 relative"
            />
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="storePhone"
            className="block mb-2 font-semibold text-sm"
          >
            가게 전화번호
          </label>
          <input
            type="tel"
            id="storePhone"
            name="storePhone"
            value={formData.storePhone}
            onChange={handleChange}
            placeholder="예: 02-1234-5678"
            className="w-full p-3 border border-gray-300 rounded text-base"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="storeDescription"
            className="block mb-2 font-semibold text-sm"
          >
            가게 설명
          </label>
          <textarea
            id="storeDescription"
            name="storeDescription"
            value={formData.storeDescription}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded text-base resize-y"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-sm">
            대분류 (택 1)
          </label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {MAIN_CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex items-center font-normal cursor-pointer text-base"
              >
                <input
                  type="radio"
                  name="mainCategory"
                  value={category}
                  checked={formData.mainCategory === category}
                  onChange={handleChange}
                  className="mr-1.5"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-sm">
            태그 (중복 선택 가능)
          </label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {TAG_CATEGORIES.map((tag) => (
              <label
                key={tag}
                className="flex items-center font-normal cursor-pointer text-base"
              >
                <input
                  type="checkbox"
                  value={tag}
                  onChange={handleTagChange}
                  className="mr-1.5"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="storeImage"
            className="block mb-2 font-semibold text-sm"
          >
            가게 대표사진
          </label>
          <input
            type="file"
            id="storeImage"
            name="storeImage"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-3 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="사진 미리보기"
              className="max-w-full h-auto mt-3 rounded block border border-gray-200"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-5 text-white rounded cursor-pointer text-base font-semibold transition-colors duration-200 bg-blue-600 hover:bg-blue-700"
        >
          등록하기
        </button>
      </form>
    </div>
  );
};

export default RestaurantInsert;
