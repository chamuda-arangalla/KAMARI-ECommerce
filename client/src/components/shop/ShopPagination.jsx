export default function ShopPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="shop-pagination">
      <button
        className="shop-page-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        {"<"}
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNumber) => (
          <button
            key={pageNumber}
            className={`shop-page-btn ${pageNumber === page ? "active" : ""}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ),
      )}
      <button
        className="shop-page-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {">"}
      </button>
    </div>
  );
}
