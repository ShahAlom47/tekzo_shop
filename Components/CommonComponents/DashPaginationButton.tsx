import React from "react";

type DashPaginationButtonProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export const DashPaginationButton: React.FC<DashPaginationButtonProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  const handlePrev = () => {
    if (!isFirst) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (!isLast) onPageChange(currentPage + 1);
  };

  return (
    <div
      className={`flex items-center justify-center my-2 space-x-2 ${totalPages < 1 ? 'hidden' : ''} ${className}`}
      role="navigation"
      aria-label="Pagination Navigation"
    >
      <button
        onClick={handlePrev}
        disabled={isFirst}
        className={` btn-base rounded-none rounded-l-full 
          ${
            isFirst
              ? "cursor-not-allowed "
              : ""
          }`}
      >
     Prev
      </button>

      <span className="px-3 py-y text-gray-700 font-medium select-none">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={isLast}
        className={`  btn-base rounded-none rounded-r-full  
          ${
            isLast
              ? "cursor-not-allowed"
              : ""
          }`}
      >
     Next
      </button>
    </div>
  );
};
