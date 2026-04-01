import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PaginationProps {
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  totalPages = 5,
  currentPage: initialPage = 1,
  onPageChange,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`flex items-center justify-center rounded-full p-3 transition-colors ${
          currentPage === 1
            ? "text-slate-300 cursor-not-allowed"
            : "text-blue-600 hover:bg-slate-100"
        }`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : page === currentPage + 1
                ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                : "bg-transparent text-slate-600 hover:bg-slate-50"
            }`}
          >
            {String(page).padStart(2, "0")}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center rounded-full p-3 transition-colors ${
          currentPage === totalPages
            ? "text-slate-300 cursor-not-allowed"
            : "text-blue-600 hover:bg-slate-100"
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
