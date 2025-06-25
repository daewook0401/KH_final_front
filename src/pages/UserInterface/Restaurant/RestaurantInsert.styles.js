import styled, { css } from "styled-components";

// 공통 버튼 스타일
const buttonStyles = css`
  padding: 12px 18px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s;
`;

// ===================================================================
// Export할 스타일 컴포넌트들
// ===================================================================

export const Container = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
`;

export const Form = styled.form``;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  ${(props) =>
    props.readOnly &&
    css`
      background-color: #f2f2f2;
      cursor: not-allowed;
    `}
`;

export const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
`;

export const AddressGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
`;

export const PostcodeWrap = styled.div`
  border: 1px solid #333;
  width: 100%;
  height: 400px;
  margin-top: 10px;
  position: relative;
`;

export const CategoryGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 15px;
`;

export const CategoryLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: normal;
  cursor: pointer;
  font-size: 15px;
`;

export const CategoryInput = styled.input`
  margin-right: 5px;
`;

export const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 4px;
  display: block;
  border: 1px solid #eee;
`;

export const AddressButton = styled.button`
  ${buttonStyles}
  white-space: nowrap;
  padding: 12px 15px;
  background-color: #555;
  &:hover {
    background-color: #333;
  }
`;

export const SubmitButton = styled.button`
  ${buttonStyles}
  width: 100%;
  background-color: #007bff;
  &:hover {
    background-color: #0056b3;
  }
`;
