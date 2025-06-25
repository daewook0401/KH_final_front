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
  font-weight: bold;
  height: 82%;
`;

export const ModalLeft = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;
export const ModalRight = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const ModalRightTop = styled.div`
  width: 80%;
  height: 40%;
  align-items: center;
  justify-content: center;
`;

export const CountBox = styled.button`
  width: 70px;
  height: 40px;
  margin: 5px;
  background-color: ${(props) => (props.isSelected ? "#00a859" : "#fff")};
  color: ${(props) => (props.isSelected ? "white" : "black")};
  border: 1px solid #ccc;
  border-radius: 8px;
  font-weight: ${(props) => (props.isSelected ? "700" : "500")};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#00a859" : "#f0f0f0")};
  }
`;

export const ModalRightBottom = styled.div`
  width: 80%;
  height: 60%;
  align-items: center;
  justify-content: center;
`;

export const TimeBox = styled.button`
  width: 70px;
  height: 40px;
  margin: 5px;
  background-color: ${(props) => (props.isSelected ? "#00a859" : "#fff")};
  color: ${(props) => (props.isSelected ? "white" : "black")};
  border: 1px solid #ccc;
  border-radius: 8px;
  font-weight: ${(props) => (props.isSelected ? "700" : "500")};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#00a859" : "#f0f0f0")};
  }
`;

export const ModalFooter = styled.div`
  width: 100%;
  height: 10%;
`;

export const GetTime = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
`;

export const ModalLeftHeader = styled.div`
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

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

export const ModalRightBottomHeader = styled.div`
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
  margin-left: 850px;

  &:hover {
    background-color: rgb(5, 81, 204);
  }
`;
