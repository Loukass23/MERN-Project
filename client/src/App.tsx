import { useEffect, useState } from "react";
import "./App.css";
import { DuckListType, DuckType } from "./@types";

function App() {
  const [allDucks, setDucks] = useState<DuckListType>([]);

  useEffect(() => {
    const fetchDucks = async () => {
      try {
        const req = await fetch("http://localhost:8000/api/ducks/");
        const res = await req.json();
        // console.log(res);
        const data = res.ducks as DuckListType;
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
      <div className="ducks-container">
        {allDucks.map((duck) => (
          <div key={duck.id} className="duck-card">
            <h2>{duck.name}</h2>
            <img
              src={duck.image}
              alt={duck.name}
              style={{ maxWidth: "500px", maxHeight: "500px" }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
