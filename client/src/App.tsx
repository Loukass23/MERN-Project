import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Ducks from "./pages/Ducks";
import Login from "./pages/LogIn";
import Register from "./pages/Register";
import { AuthContextProvider } from "./context/AuthContext";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthContextProvider>
          <Navbar />
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="signup" element={<Register />} />
            <Route path="ducks" element={<Ducks />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
