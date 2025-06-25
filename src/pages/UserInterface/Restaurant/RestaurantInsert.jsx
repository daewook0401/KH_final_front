// 파일 경로: src/RestaurantInsert.jsx

import React, { useState, useEffect } from "react";
import * as S from "./RestaurantInsert.styles";

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
      return; // 함수 실행 중단
    }

    if (selectedTags.length === 0) {
      alert("태그를 1개 이상 선택해주세요.");
      return; // 함수 실행 중단
    }

    // 유효성 검사를 통과한 경우에만 아래 로직 실행
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

  // (이하 JSX 렌더링 부분은 변경사항 없음)
  return (
    <S.Container>
      <S.Title>맛집 등록</S.Title>
      <S.Form onSubmit={handleSubmit}>
        <S.FormGroup>
          <S.Label htmlFor="storeName">가게 이름</S.Label>
          <S.Input
            type="text"
            id="storeName"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            required
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>주소</S.Label>
          <S.AddressGroup>
            <S.Input
              type="text"
              name="postcode"
              placeholder="우편번호"
              value={formData.postcode}
              readOnly
            />
            <S.AddressButton
              type="button"
              onClick={() => setIsPostcodeOpen(true)}
            >
              주소 검색
            </S.AddressButton>
          </S.AddressGroup>
          <S.Input
            type="text"
            name="address"
            placeholder="지번 주소"
            value={formData.address}
            readOnly
          />
          {isPostcodeOpen && <S.PostcodeWrap id="postcode-wrap" />}
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="storePhone">가게 전화번호</S.Label>
          <S.Input
            type="tel"
            id="storePhone"
            name="storePhone"
            value={formData.storePhone}
            onChange={handleChange}
            placeholder="예: 02-1234-5678"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="storeDescription">가게 설명</S.Label>
          <S.Textarea
            id="storeDescription"
            name="storeDescription"
            value={formData.storeDescription}
            onChange={handleChange}
            rows="4"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>대분류 (택 1)</S.Label>
          <S.CategoryGroup>
            {MAIN_CATEGORIES.map((category) => (
              <S.CategoryLabel key={category}>
                <S.CategoryInput
                  type="radio"
                  name="mainCategory"
                  value={category}
                  checked={formData.mainCategory === category}
                  onChange={handleChange}
                />{" "}
                {category}
              </S.CategoryLabel>
            ))}
          </S.CategoryGroup>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>태그 (중복 선택 가능)</S.Label>
          <S.CategoryGroup>
            {TAG_CATEGORIES.map((tag) => (
              <S.CategoryLabel key={tag}>
                <S.CategoryInput
                  type="checkbox"
                  value={tag}
                  onChange={handleTagChange}
                />{" "}
                {tag}
              </S.CategoryLabel>
            ))}
          </S.CategoryGroup>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="storeImage">가게 대표사진</S.Label>
          <S.Input
            type="file"
            id="storeImage"
            name="storeImage"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <S.ImagePreview src={imagePreview} alt="사진 미리보기" />
          )}
        </S.FormGroup>

        <S.SubmitButton type="submit">등록하기</S.SubmitButton>
      </S.Form>
    </S.Container>
  );
};

export default RestaurantInsert;
