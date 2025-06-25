import PaginationLib from "react-js-pagination";

// npm install react-js-pagination
const Pagination = ({ currentPage, setCurrentPage, pageInfo }) => {
  const { boardNoPerPage, totalBoardNo, pageSize } = pageInfo;
  return (
    <div>
      <PaginationLib
        activePage={currentPage}
        itemsCountPerPage={boardNoPerPage}
        totalItemsCount={totalBoardNo}
        pageRangeDisplayed={pageSize}
        prevPageText={"<"}
        nextPageText={">"}
        onChange={(currentPage) => setCurrentPage(currentPage)}
      />
    </div>
  );
};
export default Pagination;
