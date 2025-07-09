import useApi from "../../../hooks/useApi";

const AdminReservation = () => {
  const {
    header: allReservationHd,
    body: allReservationBd,
    refetch: refetchReservations,
    isLoading,
    error,
  } = useApi("/api/reservation/all", { method: "get" });

  const {
    header: deleteReservationHd,
    body: deleteReservationBd,
    refetch: deleteReserve,
  } = useApi("/api/reservation", { method: "delete" }, false);

  const deleteReservation = (reservationNo) => {
    deleteReserve({ params: { reservationNo } }).then(() => {
      alert("예약이 취소되었습니다.");
      refetchReservations();
    });
  };

  const reservations = allReservationBd?.items || [];
  return (
    <section className="p-6">
      <h1 className="text-xl font-bold mb-4">예약 내역</h1>

      {error && (
        <p className="text-red-500 text-sm mb-4">
          예약 정보를 불러오지 못했습니다.
        </p>
      )}
      {isLoading && <p className="text-gray-500 text-sm mb-4">로드 중…</p>}

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-[960px] w-full text-sm text-left">
          <thead className="bg-gray-100 text-center">
            <tr className="whitespace-nowrap">
              <th className="px-4 py-3 font-medium">예약번호</th>
              <th className="px-4 py-3 font-medium">매장번호</th>
              <th className="px-4 py-3 font-medium">회원번호</th>
              <th className="px-4 py-3 font-medium">예약일</th>
              <th className="px-4 py-3 font-medium">예약시간</th>
              <th className="px-4 py-3 font-medium">인원</th>
              <th className="px-4 py-3 font-medium">등록일</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium w-12">예약취소</th>
            </tr>
          </thead>

          <tbody>
            {reservations.length > 0 ? (
              reservations.map((r) => (
                <tr
                  key={r.reservationNo}
                  className="border-b last:border-0 text-center"
                >
                  <td className="px-4 py-2">{r.reservationNo}</td>
                  <td className="px-4 py-2">{r.restaurantNo}</td>
                  <td className="px-4 py-2">{r.memberNo}</td>
                  <td className="px-4 py-2">{r.reserveDay}</td>
                  <td className="px-4 py-2">{r.reserveTime}</td>
                  <td className="px-4 py-2">{r.numberOfGuests}</td>
                  <td className="px-4 py-2">
                    {r.createDate?.slice(0, 10) /* YYYY-MM-DD */}
                  </td>
                  <td className="px-4 py-2">{r.reservationStatus}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteReservation(r.reservationNo)}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      예약취소하기
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 text-center text-gray-500 whitespace-nowrap "
                >
                  조회된 예약이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminReservation;
