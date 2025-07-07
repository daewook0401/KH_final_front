const AdminReservation = () => {
  const {
    header: allReservationHd,
    body: allReservationBd,
    refetch: allReservation,
  } = useApi("/api/reservation/all", {
    method: "get",
  });

  console.log(allReservationHd, allReservationBd);
  return (
    <>
      <div>a</div>
    </>
  );
};
export default AdminReservation;
