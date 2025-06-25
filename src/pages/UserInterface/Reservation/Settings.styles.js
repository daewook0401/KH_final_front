import styled from "styled-components";

export const H2 = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #1e2b47;
  text-align: center;
  position: relative;
  font-family: "Pretendard", sans-serif;

  &::after {
    content: "";
    display: block;
    width: 900px;
    height: 1px;
    background-color: #1e2b47;
    margin: 10px auto 0 auto;
  }
`;

export const ModalWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
`;

export const CloseBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  margin-right: 30px;
  cursor: pointer;
  color: white;
  z-index: 1001;
`;

export const ModalLabel = styled.div`
  width: 1000px;
  height: 700px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  z-index: 1000;
  border-radius: 2rem;
  padding: 30px;
`;

export const ModalHeader = styled.div`
  width: 100%;
  height: 6%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalContent = styled.div`
  display: flex;
  justify-content: space-between;
  height: 82%;
  padding: 0 20px;
  gap: 40px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 5%;
  padding-right: 30px;
`;

export const ModalLeft = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ModalRight = styled.div`
  width: 50%;
  min-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`;

export const ModalLeftTop = styled.div`
  width: 90%;
  height: 60%;
`;

export const ModalLeftBottom = styled.div`
  width: 90%;
  height: 40%;
`;

export const ModalLeftTopHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

export const ModalLeftBottomHeader = styled(ModalLeftTopHeader)``;

export const ModalRightTopHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

export const EnrollButton = styled.button`
  background-color: rgb(5, 81, 204);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0046aa;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  font-family: "Pretendard", sans-serif;
  resize: none;
  margin-top: 10px;
  &:focus {
    outline: none;
    border-color: #0058a3;
  }
`;

export const Input = styled.input`
  width: 90%;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 30px;
  font-size: 16px;
  font-family: "Pretendard", sans-serif;
  text-align: center;
  margin-top: 10px;
  &:focus {
    outline: none;
    border-color: #0058a3;
  }
`;

export const Select = styled.select`
  width: 40%;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  font-family: "Pretendard", sans-serif;
  margin-top: 10px;
  &:focus {
    outline: none;
    border-color: #0058a3;
  }
`;

export const CountBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Label = styled.label`
  font-size: 16px;
  font-family: "Pretendard", sans-serif;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: #333;
  text-align: left;
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
`;

export const ModalLeftTopContent = styled.div`
  width: 100%;
  margin-top: 10px;
`;

export const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  width: 100%;
  margin-bottom: 10px;
`;

export const TimeInput = styled.input`
  width: 80px;
  height: 40px;
  font-size: 16px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0 8px;
  font-family: "Pretendard", sans-serif;
  cursor: pointer;
  background-color: #fff;
  &:hover {
    border-color: #0058a3;
  }
`;

export const DayLabel = styled.div`
  width: 120px;
  font-weight: bold;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  text-align: center;
`;

export const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  justify-content: flex-start;
`;

export const Span = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin: 0 4px;
`;
