import PropTypes from "prop-types";
import "./Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Mobilde gösterilecek sayfa sayısı

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // İlk sayfa her zaman görünür
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 3;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 2;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Son sayfa her zaman görünür
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span className="pagination-range">
          {startItem}-{endItem} / {totalItems}
        </span>
        {onItemsPerPageChange && (
          <div className="pagination-per-page">
            <label htmlFor="items-per-page">Sayfa başına:</label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="pagination-select"
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>
        )}
      </div>

      <div className="pagination-controls">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="pagination-btn pagination-btn--prev"
          aria-label="Önceki sayfa"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`pagination-btn pagination-btn--number ${
                  currentPage === page ? "pagination-btn--active" : ""
                }`}
                aria-label={`Sayfa ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="pagination-btn pagination-btn--next"
          aria-label="Sonraki sayfa"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number,
  totalItems: PropTypes.number,
  onItemsPerPageChange: PropTypes.func,
};

Pagination.defaultProps = {
  itemsPerPage: 10,
  totalItems: 0,
  onItemsPerPageChange: null,
};

export default Pagination;
