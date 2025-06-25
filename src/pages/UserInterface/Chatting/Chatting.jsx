import {
  H2,
  ModalContent,
  ModalHeader,
  ModalLabel,
  ModalWrapper,
} from "./Chatting.styles";

const Chatting = ({ chatOpen, setChatOpen }) => {
  return (
    <>
      {chatOpen && (
        <ModalWrapper>
          <ModalLabel>
            <ModalHeader>
              <H2>chattinggggg</H2>
            </ModalHeader>
            <ModalContent></ModalContent>
          </ModalLabel>
        </ModalWrapper>
      )}
    </>
  );
};
export default Chatting;
