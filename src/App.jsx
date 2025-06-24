import { useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./provider/AuthContext";
import Main from "./pages/UserInterface/Main/Main";
import ReviewPage from "./pages/review/reviewPage";
import ReviewInsertPage from "./pages/review/ReviewInsertPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/re" element={<ReviewPage />} />
        <Route path="/rein" element={<ReviewInsertPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
