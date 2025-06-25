import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as S from "./Restaurant.styles";
import Header from "../../../common/Header/Header";
import KakaoMap from "./KakaoMap";

const StarRating = ({ averageRating, reviewCount }) => {
  const stars = [];
  const ratingValue = Number(averageRating) || 0;

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= ratingValue ? "star filled" : "star"}>
        ★
      </span>
    );
  }
  return (
    <S.StarRatingContainer>
      {stars}
      <span className="rating-text">
        {ratingValue.toFixed(1)}점 ({reviewCount}명의 평가)
      </span>
    </S.StarRatingContainer>
  );
};

const Restaurant = () => {
  const { restaurantId } = useParams();
  const [restaurantData, setRestaurantData] = useState({
    details: null,
    ratingInfo: null,
    menuItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchDetails = async () => {
          const mockDetailsResponse = {
            header: { code: "S101", message: "식당 상세 조회 성공" },
            body: {
              items: [
                {
                  restaurantName: "감성 타코",
                  restaurantAddress: "서울시 강남구 테헤란로 427",
                  restaurantDescription:
                    "신선한 재료로 만드는 정통 멕시칸 요리를 즐길 수 있는 곳입니다. 다양한 타코와 파히타가 준비되어 있습니다.",
                  restaurantMainPhoto:
                    "https://via.placeholder.com/600x400/cccccc/808080?text=대표+사진",
                  restaurantCuisineType: ["멕시칸", "타코", "퓨전"],
                  restaurantMapX: "37.504547",
                  restaurantMapZ: "127.048963",
                },
              ],
            },
          };
          if (mockDetailsResponse.header.code !== "S101") {
            throw new Error(mockDetailsResponse.header.message);
          }
          return mockDetailsResponse.body.items[0];
        };

        const fetchRating = async () => {
          const mockRatingResponse = {
            header: { code: "S102", message: "별점 정보 조회 성공" },
            body: {
              averageRating: 4.5,
              reviewCount: 125,
            },
          };
          if (mockRatingResponse.header.code !== "S102") {
            throw new Error(mockRatingResponse.header.message);
          }
          return mockRatingResponse.body;
        };

        const fetchMenu = async () => {
          const mockMenuResponse = {
            header: { code: "S103", message: "메뉴 정보 조회 성공" },
            body: {
              items: [
                {
                  menuId: 1,
                  menuName: "감성 그릴드 파히타",
                  menuPrice: 38000,
                  menuImageUrl:
                    "https://via.placeholder.com/150/cccccc/808080?text=음식+사진",
                },
                {
                  menuId: 2,
                  menuName: "까르니따스 치즈 타코",
                  menuPrice: 12000,
                  menuImageUrl: null,
                },
                {
                  menuId: 3,
                  menuName: "과카몰리 나초",
                  menuPrice: 9000,
                  menuImageUrl:
                    "https://via.placeholder.com/150/cccccc/808080?text=음식+사진",
                },
                {
                  menuId: 4,
                  menuName: "애플망고 에이드",
                  menuPrice: 6500,
                  menuImageUrl:
                    "https://via.placeholder.com/150/cccccc/808080?text=음식+사진",
                },
              ],
            },
          };
          if (mockMenuResponse.header.code !== "S103") {
            throw new Error(mockMenuResponse.header.message);
          }
          return mockMenuResponse.body.items;
        };

        const [details, ratingInfo, menuItems] = await Promise.all([
          fetchDetails(),
          fetchRating(),
          fetchMenu(),
        ]);

        setRestaurantData({ details, ratingInfo, menuItems });
      } catch (err) {
        setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [restaurantId]);

  const handleCopyAddress = () => {
    if (restaurantData.details?.restaurantAddress) {
      navigator.clipboard
        .writeText(restaurantData.details.restaurantAddress)
        .then(() => alert("주소가 복사되었습니다!"));
    }
  };

  if (loading) return <S.LoadingMessage>로딩 중...</S.LoadingMessage>;
  if (error) return <S.ErrorMessage>오류: {error}</S.ErrorMessage>;
  if (!restaurantData.details || !restaurantData.ratingInfo) {
    return <div>가게 정보를 표시할 수 없습니다.</div>;
  }

  const { details, ratingInfo, menuItems } = restaurantData;

  return (
    <>
      <Header />
      <S.PageContainer>
        <S.MainContent>
          <S.RestaurantHeader>
            <S.MainImage
              src={details.restaurantMainPhoto}
              alt={`${details.restaurantName} 대표 사진`}
            />
            <S.HeaderInfo>
              <S.Category>
                {details.restaurantCuisineType?.join(", ")}
              </S.Category>
              <S.RestaurantName>{details.restaurantName}</S.RestaurantName>
              <StarRating
                averageRating={ratingInfo.averageRating}
                reviewCount={ratingInfo.reviewCount}
              />
              <S.AddressContainer>
                <span>{details.restaurantAddress}</span>
                <S.CopyButton onClick={handleCopyAddress}>
                  주소 복사
                </S.CopyButton>
              </S.AddressContainer>
            </S.HeaderInfo>
          </S.RestaurantHeader>

          <S.RestaurantDescription>
            <h3>가게 설명</h3>
            <p>{details.restaurantDescription}</p>
          </S.RestaurantDescription>

          <S.MenuSection>
            <h2>메뉴 정보</h2>
            <S.MenuTable>
              <S.MenuTableHeader>
                <div>메뉴</div>
                <div>가격</div>
                <div>사진</div>
              </S.MenuTableHeader>
              {menuItems.map((item) => (
                <S.MenuItem key={item.menuId}>
                  <div className="menu-name">{item.menuName}</div>
                  <div className="menu-price">
                    {item.menuPrice.toLocaleString()}원
                  </div>
                  <S.MenuImageContainer>
                    {item.menuImageUrl ? (
                      <S.MenuImage
                        src={item.menuImageUrl}
                        alt={item.menuName}
                      />
                    ) : (
                      <S.NoImage>사진 없음</S.NoImage>
                    )}
                  </S.MenuImageContainer>
                </S.MenuItem>
              ))}
            </S.MenuTable>
          </S.MenuSection>
        </S.MainContent>
        <S.Sidebar>
          {/* 좌표값이 있을 때만 KakaoMap 컴포넌트를 렌더링 */}
          {details?.restaurantMapX && details?.restaurantMapZ ? (
            <KakaoMap
              lat={details.restaurantMapX}
              lng={details.restaurantMapZ}
              name={details.restaurantName}
            />
          ) : (
            <S.MapPlaceholder>
              위치 정보가 없어 지도를 표시할 수 없습니다.
            </S.MapPlaceholder>
          )}
          <div>클릭시 카카오맵에서 해당 위치를 확인할 수 있습니다.</div>
        </S.Sidebar>
      </S.PageContainer>
    </>
  );
};

export default Restaurant;
