import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./provider/AuthContext";
import Main from "./pages/UserInterface/Main/Main";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
