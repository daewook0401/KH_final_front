import PaginationLib from "react-js-pagination";

const Pagination = ({ currentPage, setCurrentPage, pageInfo }) => {
  const { boardNoPerPage, totalBoardNo, pageSize } = pageInfo;
  const arrowClass =
    "w-10 h-10 flex items-center justify-center border border-orange-300 rounded-xl text-sm font-semibold text-orange-400 hover:bg-orange-200 transition duration-150";

  const totalPages = Math.ceil(totalBoardNo / boardNoPerPage);

  return (
    <div className="flex justify-center mt-6">
      <PaginationLib
        activePage={currentPage}
        itemsCountPerPage={boardNoPerPage}
        totalItemsCount={totalBoardNo}
        pageRangeDisplayed={pageSize}
        onChange={setCurrentPage}
        firstPageText={
          currentPage !== 1 && <span className={arrowClass}>{"<<"}</span>
        }
        prevPageText={
          currentPage !== 1 && <span className={arrowClass}>{"<"}</span>
        }
        nextPageText={
          currentPage !== totalPages && (
            <span className={arrowClass}>{">"}</span>
          )
        }
        lastPageText={
          currentPage !== totalPages && (
            <span className={arrowClass}>{">>"}</span>
          )
        }
        itemClass="inline-block mx-1"
        linkClass="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-200 rounded-full"
        activeLinkClass="bg-orange-500 text-white"
        disabledClass="opacity-50 cursor-not-allowed"
      />
    </div>
  );
};

export default Pagination;
