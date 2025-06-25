import styled from "styled-components";

export const H2 = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1e2b47;
  text-align: center;
  font-family: "Pretendard", sans-serif;
  margin-top: 10px;
`;

export const ModalWrapper = styled.div`
  position: fixed;
  bottom: 120px;
  right: 30px;
  width: 380px;
  height: 500px;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
`;

export const ModalLabel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ModalHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

export const ModalContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;
