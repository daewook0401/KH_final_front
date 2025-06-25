import {
  PageWrapper,
  Section,
  SectionTitle,
  CardGrid,
  Card,
  CardImg,
  CardName,
  Subtitle,
  SpaceTitle,
  HeroWrap,
  Title,
  SearchForm,
  PinIcon,
  Input,
  SearchBtn,
  ChipRow,
  Chip,
} from "./Main.styles";
import React, { useState } from "react";
import { FiMapPin } from "react-icons/fi";
import { createGlobalStyle } from "styled-components";
import Header from "../../../common/Header/Header";
import defaultImage from "/src/assets/rog.png";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: #f0f0f0;
  }
`;

const CATEGORIES = ["한식", "중식", "일식", "양식", "분식", "디저트"];

const koreanRestaurants = [
  {
    name: "하쿠 본점",
    imageUrl: "/src/assets/rog1.png",
  },
  {
    name: "평양옥 본점",
    imageUrl: "/src/assets/rog.png",
  },
  {
    name: "진미평양냉면",
    imageUrl: "/src/assets/rog.png",
  },
  {
    name: "광화문 본점",
    imageUrl: "/src/assets/rog.png",
  },
  {
    name: "서북면옥",
    imageUrl: "/src/assets/rog.png",
  },
  {
    name: "하쿠쿠 본점",
    imageUrl: "/src/assets/rog.png",
  },
];

const chineseRestaurants = [
  {
    name: "중화반점",
    imageUrl: "/src/assets/rog.png",
  },
  {
    name: "북경반점",
    imageUrl: "/src/assets/rog.png",
  },
  {
    name: "상해반점",
    imageUrl: "/src/assets/rog.png",
  },
  {
    name: "광동반점",
    imageUrl: "/src/assets/rog.png",
  },
  {
    name: "광동반점",
    imageUrl: "/src/assets/rog.png",
  },
];

const handleImageError = (e) => {
  e.target.src = defaultImage;
};

const CategorySection = ({ title, restaurants }) => (
  <Section>
    <SectionTitle>
      <SpaceTitle>
        <div>{title}</div>
        <button>더보기</button>
      </SpaceTitle>
      <Subtitle>추천맛집</Subtitle>
    </SectionTitle>
    <CardGrid>
      {restaurants.slice(0, 5).map(({ name, imageUrl }) => (
        <Card key={name}>
          <CardImg
            src={imageUrl || defaultImage}
            alt={name}
            onError={handleImageError}
          />
          <CardName>{name}</CardName>
        </Card>
      ))}
    </CardGrid>
  </Section>
);

const Main = () => {
  const [keyword, setKeyword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(keyword);
    setKeyword("");
  };

  return (
    <>
      <Header />
      <PageWrapper>
        <GlobalStyle />
        <HeroWrap>
          <Title>한눈에 펼쳐보는 서울 맛집 추천</Title>
          <SearchForm onSubmit={handleSubmit}>
            <PinIcon>
              <FiMapPin size={18} />
            </PinIcon>

            <Input
              placeholder="검색어 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <SearchBtn type="submit">검색</SearchBtn>
          </SearchForm>
          <ChipRow>
            {CATEGORIES.map((cat) => (
              <Chip key={cat}>{cat}</Chip>
            ))}
          </ChipRow>
        </HeroWrap>
        <br />
        <CategorySection title="한식" restaurants={koreanRestaurants} />
        <CategorySection title="중식" restaurants={chineseRestaurants} />
      </PageWrapper>
    </>
  );
};
export default Main;
