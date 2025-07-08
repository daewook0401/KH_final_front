import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
i;

const Calendars = ({ selectedDate, setSelectedDate }) => {
  const dateHandler = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <Calendar onChange={(date) => dateHandler(date)} value={selectedDate} />
    </>
  );
};
export default Calendars;
