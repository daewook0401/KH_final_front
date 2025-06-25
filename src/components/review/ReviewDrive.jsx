function ReviewDrive({ onWriteReview }) {
  return (
    <div className="p-6 mb-6 bg-white border border-blue-200 rounded text-center">
      <p className="text-blue-700 font-semibold mb-3">
        아직 리뷰가 없네요! 맛있게 드셨다면 리뷰를 작성해주세요!
      </p>
      <button
        className="px-5 py-2 bg-blue-200 text-blue-800 font-medium rounded hover:bg-blue-300 transition-colors"
        onClick={onWriteReview}
        type="button"
      >
        리뷰 작성하러 가기
      </button>
    </div>
  );
}

export default ReviewDrive;
