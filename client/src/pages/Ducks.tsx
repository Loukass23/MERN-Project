import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { Modal } from "../components/Modal";
import { DuckFilters } from "../components/DuckFilters";
import { DuckSearchHeader } from "../components/DuckSearchHeader";
import { NoDucksFound } from "../components/NoDucksFound";
import { API_ENDPOINTS } from "../config/api";
import { useDucksData } from "../components/hooks/useDuckData";
import DuckCard from "../components/DuckCard";
import CreateDuckForm from "../components/CreateDuckForm";
import { useDuckFilters } from "../components/hooks/useDuckFilters";
import { AnimatePresence, motion } from "framer-motion";
import { PaginatedDuckResponse } from "../@types";

export default function Ducks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useAuth();

  // Custom hooks
  const {
    filter,
    filters,
    duckOptions,
    optionsLoading,
    setFilter,
    setFilters,
    resetAllFilters,
  } = useDuckFilters();

  const {
    ducks,
    loading: ducksLoading,
    error: ducksError,
    setDucks,
    pagination,
  } = useDucksData(filter, filters, currentPage);

  const handleDuckCreated = async () => {
    setShowCreateForm(false);
    setCurrentPage(1);
    const response = await fetch(
      `${API_ENDPOINTS.DUCKS.BASE}?sort=-uploadedAt&page=1&limit=10`
    );
    const data: PaginatedDuckResponse = await response.json();
    setDucks(data.ducks);
  };

  const handleCreateDuckClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowCreateForm(true);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const filteredDucks = ducks.filter((duck) =>
    [duck.name, duck.breed, duck.description].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-4 my-8">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={!pagination?.hasPreviousPage}
        className={`px-4 py-2 rounded-md ${
          pagination?.hasPreviousPage
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Previous
      </button>

      <span className="text-gray-700">
        Page {pagination?.currentPage || 1} of {pagination?.totalPages || 1}
      </span>

      <button
        onClick={() => setCurrentPage((p) => p + 1)}
        disabled={!pagination?.hasNextPage}
        className={`px-4 py-2 rounded-md ${
          pagination?.hasNextPage
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );

  if (optionsLoading || ducksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <LoadingIndicator text="Loading ducks..." />
      </div>
    );
  }

  if (ducksError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-600 mb-2">
            Error loading ducks
          </h3>
          <p className="text-gray-600">{ducksError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Modal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)}>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800 mb-2">
            🦆 <span className="text-yellow-500">Quack Alert!</span> 🦆
          </p>
          <p className="text-sm text-gray-600">
            To add your duck to the pond, please login or register first!
          </p>
          <button
            onClick={() => setShowLoginPrompt(false)}
            className="mt-4 px-4 py-1 rounded-full bg-yellow-400 text-white text-sm hover:bg-yellow-300 transition-colors"
          >
            Okay!
          </button>
        </div>
      </Modal>

      <div className="container mx-auto pt-24 px-4 py-8">
        <DuckSearchHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateClick={handleCreateDuckClick}
          filter={filter}
          onFilterChange={setFilter}
          isAuthenticated={isAuthenticated}
        />

        <DuckFilters
          filters={filters}
          duckOptions={duckOptions}
          optionsLoading={optionsLoading}
          onFilterChange={handleFilterChange}
          onReset={resetAllFilters}
        />

        {showCreateForm && duckOptions && (
          <CreateDuckForm
            onDuckCreated={handleDuckCreated}
            options={duckOptions}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        <AnimatePresence mode="popLayout">
          {filteredDucks.length === 0 ? (
            <motion.div
              key="no-ducks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            >
              <NoDucksFound
                hasFilters={
                  !!searchTerm ||
                  !!filters.breed ||
                  !!filters.gender ||
                  filters.isRubberDuck
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key="ducks-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.84 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredDucks.map((duck, index) => (
                <motion.div
                  key={duck._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.048,
                    duration: 0.5,
                    ease: "backOut",
                  }}
                >
                  <DuckCard duck={duck} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredDucks.length > 0 && <PaginationControls />}
      </div>
    </div>
  );
}
