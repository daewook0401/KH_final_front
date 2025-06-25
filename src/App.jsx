import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./provider/AuthContext";
import Main from "./pages/UserInterface/Main/Main";
import Openinghours from "./pages/UserInterface/Openinghours/Openinghours";
import Reservation from "./pages/UserInterface/Reservation/Reservation";
import Settings from "./pages/UserInterface/Reservation/Settings";
import ChattingBtn from "./pages/UserInterface/Chatting/ChattingBtn";
import Restaurant from "./pages/UserInterface/Restaurant/Restaurant";
import RestaurantInsert from "./pages/UserInterface/Restaurant/RestaurantInsert";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/restaurant/*" element={<Restaurant />} />
        <Route path="/restaurantInsert" element={<RestaurantInsert />} />
          <Route path="/openinghours" element={<Openinghours />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AuthProvider>
      <ChattingBtn />
    </>

  );
}

export default App;
