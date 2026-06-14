import { ChevronLeft, ChevronRight } from "lucide-react";

const getVisiblePages = (currentPage, totalPages) => {
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

export default function AdminPagination({ currentPage, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const firstItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const lastItem = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-[#d7c9b8] bg-[#fcfaf7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:py-3">
      <p className="text-center text-sm text-[#8f8376] sm:text-left">
        Showing {firstItem}-{lastItem} of {totalItems}
      </p>

      {totalPages > 1 && <div className="flex items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage === 1}
          aria-label="Previous page"
          className="rounded-lg border border-[#d7c9b8] bg-white p-2 text-[#5f564d] transition hover:bg-[#eae0d6] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="px-3 text-sm font-medium text-[#5f564d] sm:hidden">
          Page {safePage} of {totalPages}
        </span>

        <div className="hidden items-center gap-1.5 sm:flex">
          {getVisiblePages(safePage, totalPages).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === safePage ? "page" : undefined}
              className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                page === safePage
                  ? "bg-[#2c2b28] text-white"
                  : "border border-[#d7c9b8] bg-white text-[#5f564d] hover:bg-[#eae0d6]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage === totalPages}
          aria-label="Next page"
          className="rounded-lg border border-[#d7c9b8] bg-white p-2 text-[#5f564d] transition hover:bg-[#eae0d6] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>}
    </div>
  );
}
