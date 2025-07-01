import React, { useState, useEffect } from "react";
// 1. useApi 훅을 import 합니다.
import useApi from "../../../hooks/useApi"; // useApi 훅의 실제 경로로 수정해주세요.
import TagSelector from "../../../components/Restaurants/TagSelector";
import {
  MAIN_CATEGORIES,
  TAG_CATEGORIES,
} from "../../../components/Restaurants/TagList";

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

  // 2. useApi 훅을 설정합니다.
  const {
    loading,
    error,
    refetch: registerRestaurant,
  } = useApi("/api/stores/register", { method: "POST" }, false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "storePhone") {
      const cleaned = value.replace(/[^0-9]/g, "");
      let formatted = "";
      if (cleaned.startsWith("02")) {
        if (cleaned.length <= 2) {
          formatted = cleaned;
        } else if (cleaned.length <= 6) {
          formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
        } else {
          formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(
            2,
            6
          )}-${cleaned.slice(6, 10)}`;
        }
      } else {
        if (cleaned.length <= 3) {
          formatted = cleaned;
        } else if (cleaned.length <= 7) {
          formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
        } else {
          formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
            3,
            7
          )}-${cleaned.slice(7, 11)}`;
        }
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTagSelectionChange = (newTags) => {
    setSelectedTags(newTags);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // 3. handleSubmit 함수를 useApi 훅을 사용하도록 수정합니다.
  const handleSubmit = async (e) => {
    e.preventDefault();
    switch (true) {
      case !formData.mainCategory:
        alert("대분류를 선택해주세요.");
        return;
      case selectedTags.length === 0:
        alert("태그를 1개 이상 선택해주세요.");
        return;
      case !formData.storePhone:
        alert("전화번호를 입력해주세요.");
        return;
      case !formData.storeName:
        alert("가게 이름을 입력해주세요.");
        return;
      case !formData.address:
        alert("주소를 입력해주세요.");
        return;
      case !formData.storeDescription:
        alert("가게 설명을 입력해주세요.");
        return;
      default:
        break;
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

    registerRestaurant({
      data: submissionData,
    }).then((response) => {
      if (response) {
        alert("맛집이 성공적으로 등록되었습니다!");
        console.log("✅ 등록 완료:", response.body);
        // 성공 후 폼 초기화 또는 페이지 이동 로직 추가 가능
      }
    });
  };

  // 4. 에러 처리를 위한 useEffect 추가
  useEffect(() => {
    if (error) {
      const message =
        error.response?.data?.header?.message ||
        error.message ||
        "등록 중 오류가 발생했습니다.";
      alert(message);
    }
  }, [error]);

  useEffect(() => {
    if (!isPostcodeOpen) return;
    const elementWrap = document.getElementById("postcode-wrap");
    const processAddressData = (data) => {
      const { zonecode, jibunAddress, bcode, sigunguCode } = data;
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(jibunAddress, (result, status) => {
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
    };

    new window.daum.Postcode({
      oncomplete: (data) => {
        if (data.userSelectedType === "J" || data.autoJibunAddress) {
          const finalJibunAddress = data.jibunAddress || data.autoJibunAddress;
          processAddressData({ ...data, jibunAddress: finalJibunAddress });
        }
      },
      width: "100%",
      height: "100%",
    }).embed(elementWrap);
  }, [isPostcodeOpen]);

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
            태그 (검색하여 최대 5개 선택)
          </label>
          <TagSelector
            allTags={TAG_CATEGORIES}
            selectedTags={selectedTags}
            onSelectionChange={handleTagSelectionChange}
            maxSelection={5}
          />
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

        {/* 5. 로딩 상태와 연동된 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-5 text-white rounded cursor-pointer text-base font-semibold transition-colors duration-200 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "등록 중..." : "등록하기"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantInsert;
