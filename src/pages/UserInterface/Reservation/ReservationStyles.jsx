import classNames from "classnames";

export const H2 = ({ children }) => (
  <h2 className="text-[24px] font-extrabold text-[#1e2b47] text-center relative font-[Pretendard,sans-serif] after:content-[''] after:block after:w-[900px] after:h-[1px] after:bg-[#1e2b47] after:mt-[10px] after:mx-auto">
    {children}
  </h2>
);

export const ModalWrapper = ({ children }) => (
  <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000]">
    {children}
  </div>
);

export const CloseBtn = ({ children }) => (
  <div className="flex justify-end mt-[80px] mr-[30px] text-white cursor-pointer z-[1001]">
    {children}
  </div>
);

export const ModalLabel = ({ children }) => (
  <div className="w-[1000px] h-[700px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[1000] rounded-2xl">
    {children}
  </div>
);

export const ModalHeader = ({ children }) => (
  <div className="w-full h-[8%] mt-[15px] items-center border-b border-[#fdfdfd]">
    {children}
  </div>
);

export const ModalContent = ({ children }) => (
  <div className="flex font-bold h-[82%]">{children}</div>
);

export const ModalLeft = ({ children }) => (
  <div className="w-1/2 h-full flex flex-col items-center mt-[20px]">
    {children}
  </div>
);

export const ModalRight = ({ children }) => (
  <div className="w-1/2 h-full flex flex-col items-center justify-center mt-[20px]">
    {children}
  </div>
);

export const ModalRightTop = ({ children }) => (
  <div className="w-[80%] h-[40%]">{children}</div>
);

export const CountBox = ({ isSelected, children, ...props }) => (
  <button
    {...props}
    className={classNames(
      "w-[70px] h-[40px] m-[5px] border border-[#ccc] rounded-[8px] cursor-pointer transition-all duration-200 ease-in-out",
      {
        "bg-[#00a859] text-white font-bold": isSelected,
        "bg-white text-black font-medium hover:bg-[#f0f0f0]": !isSelected,
      }
    )}
  >
    {children}
  </button>
);
export const ModalRightBottom = ({ children }) => (
  <div className="w-[80%] h-[60%]">{children}</div>
);

export const TimeBox = CountBox; // 동일한 구조로 재사용 가능

export const ModalFooter = ({ children }) => (
  <div className="w-full h-[10%]">{children}</div>
);

export const GetTime = ({ children }) => (
  <div className="w-full flex items-center justify-center text-[20px] font-bold">
    {children}
  </div>
);

export const ModalLeftHeader = ({ children }) => (
  <div className="w-[70%] flex items-center justify-center text-[20px] font-bold mb-[20px] p-[10px] border-b border-[#ccc]">
    {children}
  </div>
);

export const ModalRightTopHeader = ({ children }) => (
  <div className="w-full flex items-center justify-center text-[20px] font-bold mb-[20px] p-[10px] border-b border-[#ccc]">
    {children}
  </div>
);

export const ModalRightBottomHeader = ModalRightTopHeader;

export const EnrollButton = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-[#0551cc] text-white border-none rounded-[4px] px-[12px] py-[6px] text-[16px] cursor-pointer ml-[850px] hover:bg-[#0551cc]"
  >
    {children}
  </button>
);
