import useApi from "../../../hooks/useApi";

const OperatingHoursView = () => {
  const { header, body, error, loading, refetch } = useApi("/api/operatings", {
    method: "get",
  });

  useEffect(() => {
    const dataToSend = {
      restaurantNo: "2",
    };

    refetch({ data: dataToSend });
  }, []);
  return (
    <>
      <div></div>
    </>
  );
};
export default OperatingHoursView;
