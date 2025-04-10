import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [allDucks, setDucks] = useState([]);

  useEffect(() => {
    const fetchDucks = async () => {
      try {
        const req = await fetch("http://localhost:8000/ducks/all");
        const res = await req.json();
        const data = res.ducks;
        setDucks(data);
        console.log("Duckies:", data);
      } catch (error) {
        console.error("Error fetching ducks:", error);
      }
    };
    fetchDucks();
  }, []);
  return (
    <>
      <h1>hello duck friends</h1>
    </>
  );
}

export default App;
