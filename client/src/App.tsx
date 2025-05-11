import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Ducks from "./pages/Ducks";
import Login from "./pages/LogIn";
import Register from "./pages/Register";
import { AuthContextProvider } from "./context/AuthContext";
import DuckDetail from "./pages/DuckDetail";
import ProfilePage from "./pages/ProfilePage";
import AuthWrapper from "./components/AuthWrapper";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthContextProvider>
          <Navbar />
          <AuthWrapper>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="signup" element={<Register />} />
              <Route path="ducks" element={<Ducks />} />
              <Route path="/ducks/:id" element={<DuckDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
            </Routes>
          </AuthWrapper>
        </AuthContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
