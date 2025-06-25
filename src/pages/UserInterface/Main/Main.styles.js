import styled from "styled-components";

export const PageWrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #fde4d7;
`;

export const Section = styled.section`
  margin-bottom: 3rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const SpaceTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Subtitle = styled.div`
  color: #fc742f;
`;
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
`;

export const Card = styled.article`
  border: 1px solid #eee;
  border-radius: 0.5rem;
  overflow: hidden;
  text-align: center;
  background: #fff;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const CardImg = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
`;

export const CardName = styled.p`
  padding: 0.75rem 0.5rem;
  font-weight: 500;
`;

export const HeroWrap = styled.section`
  background: linear-gradient(135deg, #ffa868, #ffaa6b);
  color: #fff;
  text-align: center;
  padding: 40px 20px;
  border-radius: 12px;
`;

export const Title = styled.h1`
  margin-bottom: 24px;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.3;
`;

export const SearchForm = styled.form`
  display: flex;
  width: 100%;
  max-width: 360px;
  margin: 0 auto 24px;
  background: #fff;
  border-radius: 999px;
  overflow: hidden;
`;

export const PinIcon = styled.span`
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: #ff7750;
`;

export const Input = styled.input`
  flex: 1;
  border: none;
  padding: 12px 0;
  font-size: 0.95rem;
  color: #333;
  &::placeholder {
    color: #b4b4b4;
  }

  &:focus {
    outline: none;
  }
`;

export const SearchBtn = styled.button`
  background: #ff5a3c;
  color: #fff;
  padding: 0 24px;
  font-weight: 600;
  border: none;
  cursor: pointer;
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

export const Chip = styled.button`
  border: none;
  background: #fff;
  color: #444;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #ffe2d1;
  }
`;
