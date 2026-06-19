import React from "react";

/** Max 7 page buttons — never build huge arrays for million-record tables */
export function getPageWindow(currentPage, totalPages) {
  if (!totalPages || totalPages <= 1) return totalPages ? [1] : [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const start = Math.max(1, currentPage - 3);
  const end = Math.min(totalPages, start + 6);
  const adjustedStart = Math.max(1, end - 6);

  return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i);
}

function formatCount(value) {
  if (value == null) return "0";
  return Number(value).toLocaleString("en-GB");
}

const PaginationSection = ({
  currentPage,
  totalPages = 1,
  hasMore = false,
  paginate,
  startIndex = 0,
  endIndex = 0,
  total = 0,
  isEstimated = false,
}) => {
  const hasKnownTotal = total > 0;
  const visiblePages = getPageWindow(currentPage, totalPages);

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages && !hasMore;

  const totalLabel = isEstimated ? `~${formatCount(total)}` : formatCount(total);

  return (
    <div className="table-bottom-control">
      <div className="dataTables_info">
        {endIndex > 0 ? (
          <>
            {hasKnownTotal
              ? `Showing ${startIndex} to ${endIndex} of ${totalLabel}`
              : `Showing ${startIndex} to ${endIndex}`}
            {totalPages > 1 && (
              <span className="text-muted ms-2">
                (Page {formatCount(currentPage)} of {formatCount(totalPages)})
              </span>
            )}
          </>
        ) : (
          "No entries"
        )}
      </div>
      <div className="dataTables_paginate paging_simple_numbers">
        <a
          className={`btn btn-primary previous ${prevDisabled ? "disabled" : ""}`}
          role="button"
          onClick={() => !prevDisabled && paginate(currentPage - 1)}
        >
          <i className="fa-light fa-angle-left"></i>
        </a>
        {visiblePages.map((number) => (
          <span key={number}>
            <a
              className={`btn btn-primary ${currentPage === number ? "current" : ""}`}
              role="button"
              onClick={() => paginate(number)}
            >
              {number}
            </a>
          </span>
        ))}
        <a
          className={`btn btn-primary next ${nextDisabled ? "disabled" : ""}`}
          role="button"
          onClick={() => !nextDisabled && paginate(currentPage + 1)}
        >
          <i className="fa-light fa-angle-right"></i>
        </a>
      </div>
    </div>
  );
};

export default PaginationSection;
