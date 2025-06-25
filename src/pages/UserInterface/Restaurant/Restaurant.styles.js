// src/components/Restaurant/Restaurant.styles.js

import styled from "styled-components";

// --- 기본 레이아웃 ---

export const PageContainer = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  gap: 20px;
  font-family: "Helvetica Neue", sans-serif;
  /* [수정] 메인 페이지와 통일감을 주기 위해 중성적인 연한 회색 배경으로 변경 */
  background-color: #f8f9fa;
`;

export const MainContent = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const Sidebar = styled.aside`
  flex: 1;
`;

// --- 컨텐츠 카드 공통 스타일 ---

const Card = styled.div`
  background-color: #ffffff;
  padding: 24px;
  /* [수정] 메인 페이지처럼 테두리를 사용하여 카드 영역을 구분 */
  border: 1px solid #e9ecef;
  border-radius: 8px; /* 메인 페이지와 유사하게 반지름 소폭 감소 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04); /* 그림자는 더 은은하게 */
`;

// --- 가게 헤더 ---

export const RestaurantHeader = styled(Card)``;

export const MainImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #eee;
  margin-bottom: 20px;
`;

export const HeaderInfo = styled.div``;

export const Category = styled.p`
  color: #888;
  font-size: 0.9em;
  margin: 0;
`;

export const RestaurantName = styled.h1`
  margin: 5px 0 10px;
  color: #212529; /* 더 선명한 검정 계열 텍스트 */
`;

export const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  .star {
    font-size: 1.5em;
    color: #dee2e6; /* 비활성 별 색상 조정 */
  }
  .star.filled {
    color: #ffc107;
  }
  .rating-text {
    margin-left: 10px;
    color: #495057;
    font-weight: bold;
  }
`;

export const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  /* [수정] 카드 안에서 살짝 들어간 느낌을 주기 위해 연한 회색으로 변경 */
  background-color: #f1f3f5;
  padding: 10px;
  border-radius: 4px;
`;

export const CopyButton = styled.button`
  background-color: #ff7750;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e66a45;
  }
`;

// --- 가게 설명 ---

export const RestaurantDescription = styled(Card)`
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    /* [수정] 메인 페이지의 "추천맛집"처럼 포인트 컬러 적용 */
    color: #ff7750;
    font-size: 1.25rem; /* 제목 크기 조정 */
  }
  p {
    color: #495057; /* 본문 텍스트 색상 조정 */
    line-height: 1.6;
  }
`;

// --- 메뉴 정보 ---

export const MenuSection = styled(Card)`
  h2 {
    margin-top: 0;
    margin-bottom: 16px;
    /* [수정] 메인 페이지의 "추천맛집"처럼 포인트 컬러 적용 */
    color: #ff7750;
    font-size: 1.25rem; /* 제목 크기 조정 */
  }
`;

export const MenuTable = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 2px solid #f1f3f5;
`;

const MenuRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  align-items: center;
  padding: 15px 10px;
  border-bottom: 1px solid #f1f3f5;
`;

export const MenuTableHeader = styled(MenuRow)`
  font-weight: bold;
  color: #495057;
  background-color: #f8f9fa;
`;

export const MenuItem = styled(MenuRow)`
  .menu-name {
    font-weight: bold;
    color: #343a40;
  }
  .menu-price {
    text-align: right;
    padding-right: 20px;
    color: #495057;
  }
`;

export const MenuImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
`;

export const MenuImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

export const NoImage = styled.div`
  color: #adb5bd;
  font-size: 0.9em;
  text-align: center;
  width: 100%;
`;

// --- 기타 ---

export const MapPlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background-color: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #868e96;
  border-radius: 8px;
  font-size: 1.2em;
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: red;
`;
