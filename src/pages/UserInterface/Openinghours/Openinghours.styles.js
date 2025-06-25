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
    width: 380px;
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
  justify-content: end;
  margin-top: 80px;
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
`;
export const ModalHeader = styled.div`
  width: 100%;
  height: 8%;
  margin-top: 15px;
  align-items: center;
  border-bottom: 1px solidrgb(253, 253, 253);
`;

export const ModalContent = styled.div`
  display: flex;
  margin-top: 10px;
  padding: 0 40px;
  font-weight: bold;
  height: 70%;
  box-sizing: border-box;
`;

export const ModalFooter = styled.div`
  width: 100%;
  height: 20%;
`;

export const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
`;

export const TimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 80px;
`;

export const TimeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 10px 0;
  width: 100%;
  height: 64px;
  margin-bottom: 10px;
  margin-top: 3px;
`;

export const BreakTimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 10px;
`;

export const DayLabel = styled.div`
  width: 120px;
  font-weight: bold;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  text-align: center;
`;

export const TimeInput = styled.input`
  width: 80px;
  height: 40px;
  font-size: 16px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0 8px;
  margin: 5px;
  font-family: "Pretendard", sans-serif;
  cursor: pointer;
  background-color: #fff;

  &:hover {
    border-color: #0058a3;
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #007bff;

  &:hover {
    text-decoration: underline;
  }
`;

export const EnrollButton = styled.button`
  background-color: rgb(5, 81, 204);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 16px;
  cursor: pointer;
  margin-left: 850px;
  margin-top: 50px;

  &:hover {
    background-color: rgb(5, 81, 204);
  }
`;

export const Span = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin: 0 4px;
  display: inline-block;
`;
