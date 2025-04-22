import { useEffect, useState } from "react";
import { DuckListType } from "../@types";

function Ducks() {
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
      <div className="mt-12 min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-yellow-400 mb-12">
            Hello Duck Friends!
          </h1>

          {allDucks.length === 0 ? (
            <div className="text-center text-xl text-gray-500">
              No ducks found. The pond is empty!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {allDucks.map((duck) => (
                <div
                  key={duck.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                      {duck.name}
                    </h2>
                    <div className="flex justify-center">
                      <img
                        src={duck.image}
                        alt={duck.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Ducks;
