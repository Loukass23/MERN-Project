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
    setCurrentPage(1);
  };

  const filteredDucks = ducks.filter((duck) =>
    [duck.name, duck.breed, duck.description].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const PaginationControls = () => (
    <motion.div
      className="pagination-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={!pagination?.hasPreviousPage}
        className={`pagination-button ${
          pagination?.hasPreviousPage
            ? "pagination-button-active"
            : "pagination-button-disabled"
        }`}
      >
        Previous
      </button>

      <span className="pagination-page-info">
        Page {pagination?.currentPage || 1} of {pagination?.totalPages || 1}{" "}
      </span>

      <button
        onClick={() => setCurrentPage((p) => p + 1)}
        disabled={!pagination?.hasNextPage}
        className={`pagination-button ${
          pagination?.hasNextPage
            ? "pagination-button-active"
            : "pagination-button-disabled"
        }`}
      >
        Next
      </button>
    </motion.div>
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
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-600 mb-2">
            Error loading ducks
          </h3>
          <p className="text-gray-600 mb-4">{ducksError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pb-12 overflow-hidden relative">
      {/* Wave Background */}
      <div className="wave-background">
        <div className="wave-deep-layer"></div>
        <motion.div
          className="wave-layer-1"
          animate={{ backgroundPositionX: ["0%", "100%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="wave-layer-2"
          animate={{ backgroundPositionX: ["100%", "0%"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="wave-layer-3"
          animate={{ backgroundPositionX: ["0%", "100%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Modal */}
      <Modal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)}>
        <div className="modal-content">
          <div className="modal-icon">🦆</div>
          <p className="modal-title">
            <span className="text-yellow-500">Quack Alert!</span>
          </p>
          <p className="modal-message">
            To add your duck to the pond, please login or register first!
          </p>
          <div className="modal-buttons">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="modal-button modal-button-secondary"
            >
              Maybe Later
            </button>
            <button
              onClick={() => (window.location.href = "/login")}
              className="modal-button modal-button-primary"
            >
              Login Now
            </button>
          </div>
        </div>
      </Modal>

      {/* Content */}
      <div className="container mx-auto pt-24 px-4 sm:px-6 lg:px-8 relative z-10">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <CreateDuckForm
              onDuckCreated={handleDuckCreated}
              options={duckOptions}
              onCancel={() => setShowCreateForm(false)}
            />
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {filteredDucks.length === 0 ? (
            <motion.div
              key="no-ducks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="mt-8"
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
              className="ducks-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {filteredDucks.map((duck, index) => (
                <motion.div
                  key={duck._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.04,
                    duration: 0.4,
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
