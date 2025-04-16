import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Ducks from "./pages/Ducks";
// import Register from "./pages/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<Homepage />} />
          {/* <Route path="signup" element={<Register />} /> */}
          <Route path="ducks" element={<Ducks />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
