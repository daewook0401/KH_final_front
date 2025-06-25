import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./provider/AuthContext";
import Main from "./pages/UserInterface/Main/Main";
import Restaurant from "./pages/UserInterface/Restaurant/Restaurant";
import RestaurantInsert from "./pages/UserInterface/Restaurant/RestaurantInsert";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/restaurant/*" element={<Restaurant />} />
        <Route path="/restaurantInsert" element={<RestaurantInsert />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
