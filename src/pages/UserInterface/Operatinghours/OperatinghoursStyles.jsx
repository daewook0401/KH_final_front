export const H2 = ({ children }) => (
  <h2 className="text-[24px] font-extrabold text-[#1e2b47] text-center relative font-[Pretendard,sans-serif] after:block after:w-[380px] after:h-[1px] after:bg-[#1e2b47] after:mt-[10px] after:mx-auto">
    {children}
  </h2>
);

// ModalWrapper
export const ModalWrapper = ({ children }) => (
  <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000]">
    {children}
  </div>
);

// CloseBtn
export const CloseBtn = ({ children }) => (
  <div className="flex justify-end mt-[80px] mr-[30px] text-white cursor-pointer z-[1001]">
    {children}
  </div>
);

// ModalLabel
export const ModalLabel = ({ children }) => (
  <div className="w-[1000px] h-[700px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-[1000]">
    {children}
  </div>
);

// ModalHeader
export const ModalHeader = ({ children }) => (
  <div className="w-full h-[8%] mt-[15px] items-center border-b border-[#fdfdfd]">
    {children}
  </div>
);

// ModalContent
export const ModalContent = ({ children }) => (
  <div className="flex mt-[10px] px-[40px] font-bold h-[70%] box-border">
    {children}
  </div>
);

// ModalFooter
export const ModalFooter = ({ children }) => (
  <div className="w-full h-[20%]">{children}</div>
);

// DatePickerWrapper
export const DatePickerWrapper = ({ children }) => (
  <div className="flex items-center gap-[8px] min-h-[30px]">{children}</div>
);

// TimeWrapper
export const TimeWrapper = ({ children }) => (
  <div className="flex flex-col w-full ml-[80px]">{children}</div>
);

// TimeRow
export const TimeRow = ({ children }) => (
  <div className="flex items-center justify-start gap-[12px] py-[10px] w-full h-[64px] mb-[10px] mt-[3px]">
    {children}
  </div>
);

// BreakTimeRow
export const BreakTimeRow = ({ children }) => (
  <div className="flex items-center gap-[8px] ml-[10px]">{children}</div>
);

// DayLabel
export const DayLabel = ({ children }) => (
  <div className="w-[120px] font-bold font-[Pretendard,sans-serif] text-[16px] text-center">
    {children}
  </div>
);

// TimeInput
export const TimeInput = (props) => (
  <input
    {...props}
    className="w-[80px] h-[40px] text-[16px] text-center border border-[#ccc] rounded-[8px] px-[8px] m-[5px] font-[Pretendard,sans-serif] cursor-pointer bg-white hover:border-[#0058a3]"
  />
);

// ActionButton
export const ActionButton = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-transparent border-none cursor-pointer text-[14px] text-[#007bff] hover:underline"
  >
    {children}
  </button>
);

// EnrollButton
export const EnrollButton = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-[#0551cc] text-white border-none rounded-[4px] px-[12px] py-[6px] text-[16px] cursor-pointer ml-[850px] mt-[50px] hover:bg-[#0551cc]"
  >
    {children}
  </button>
);

// Span
export const Span = ({ children }) => (
  <span className="text-[16px] font-bold mx-[4px] inline-block">
    {children}
  </span>
);
