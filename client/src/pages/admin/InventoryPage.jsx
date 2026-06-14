import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddProductModal from "../../components/admin/AddProductModel";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAdmin } from "../../context/useAdmin";
import { deleteProduct } from "../../services/productApi";
import { AlertCircle, Search, Edit2, Plus, Trash2 } from "lucide-react";
import AdminPagination from "../../components/admin/AdminPagination";

const PAGE_SIZE = 5;

const InventoryPage = () => {
  const navigate = useNavigate();
  const { products, productsLoading, productsError, refreshProducts } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const openProductView = (product, editMode = false) => {
    navigate(`/admin/products/${product.id}`, {
      state: { from: "/admin/inventory", edit: editMode },
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.collection?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const confirmDeleteProduct = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const token = localStorage.getItem("adminToken");
      await deleteProduct(deleteTarget.id, token);
      setDeleteTarget(null);
      refreshProducts();
    } catch (error) {
      setDeleteError(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:gap-4 lg:space-y-0">
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#2c2b28]">Inventory</h2>
          <p className="text-base text-[#8f8376] mt-2">Manage stock levels across all collections</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2c2b28] text-white text-base font-semibold rounded-xl hover:bg-[#544c43] transition-all shadow-sm"
          >
            <Plus size={20} />
            Add Product
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8376]" size={20} />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 pr-4 py-3 bg-white border border-[#d7c9b8] rounded-xl text-base w-full md:w-72 focus:ring-1 focus:ring-[#c2b2a6] outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#d7c9b8] bg-white shadow-sm">
        {productsError && (
          <div className="px-6 py-4 bg-rose-50 text-rose-700 text-base border-b border-rose-100">
            {productsError}
          </div>
        )}
        {deleteError && (
          <div className="px-6 py-4 bg-rose-50 text-rose-700 text-base border-b border-rose-100">
            {deleteError}
          </div>
        )}
        {productsLoading && (
          <div className="px-6 py-4 bg-[#fcfaf7] text-[#5f564d] text-base border-b border-[#d7c9b8]">
            Loading products...
          </div>
        )}
        <div className="hidden min-h-0 flex-1 md:block">
          <table className="w-full table-fixed text-left">
            <colgroup>
              <col className="w-[28%]" />
              <col className="w-[18%]" />
              <col className="w-[30%]" />
              <col className="w-[16%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead>
              <tr className="bg-[#fcfaf7] border-b border-[#d7c9b8]">
                <th className="px-4 py-4 text-sm font-semibold text-[#8f8376] uppercase tracking-wider">Product</th>
                <th className="px-4 py-4 text-sm font-semibold text-[#8f8376] uppercase tracking-wider">Collection</th>
                <th className="px-4 py-4 text-sm font-semibold text-[#8f8376] uppercase tracking-wider">Sizes & Stock</th>
                <th className="px-4 py-4 text-sm font-semibold text-[#8f8376] uppercase tracking-wider">Status</th>
                <th className="px-2 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8]">
              {paginatedProducts.map((product) => {
                const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
                const isLowStock = Object.values(product.stock).some((count) => count < 5);
                return (
                  <tr
                    key={product.id}
                    onClick={() => openProductView(product)}
                    className="hover:bg-[#fcfaf7] transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover border border-[#d7c9b8]"
                        />
                        <div className="min-w-0">
                          <p className="break-words text-base font-semibold text-[#2c2b28]">{product.name}</p>
                          <p className="text-sm text-[#8f8376] mt-0.5">LKR {product.price?.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex max-w-full break-words rounded-full bg-[#eae0d6] px-3 py-1.5 text-sm text-[#5f564d]">
                        {product.collection}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(product.stock).map(([size, count]) => (
                          <div key={size} className="flex flex-col items-center">
                            <span className="text-xs text-[#8f8376] font-bold mb-1 uppercase">{size}</span>
                            <span className={`text-base font-semibold ${count < 5 ? "text-amber-600" : "text-[#2c2b28]"}`}>
                              {count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {product.isSoldOut || totalStock === 0 ? (
                        <span className="flex items-center gap-1.5 text-rose-600 text-sm font-semibold uppercase">
                          <AlertCircle size={16} /> Sold Out
                        </span>
                      ) : isLowStock ? (
                        <span className="flex items-center gap-1.5 text-amber-600 text-sm font-semibold uppercase">
                          <AlertCircle size={16} /> Low Stock
                        </span>
                      ) : (
                        <span className="text-emerald-600 text-sm font-semibold uppercase">In Stock</span>
                      )}
                    </td>
                    <td className="px-2 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openProductView(product, true)}
                          aria-label={`Edit ${product.name}`}
                          className="p-2.5 text-[#8f8376] hover:text-[#2c2b28] hover:bg-[#eae0d6] rounded-xl transition-all"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError("");
                            setDeleteTarget(product);
                          }}
                          aria-label={`Delete ${product.name}`}
                          className="p-2.5 text-[#8f8376] hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[#f3ede8] md:hidden">
          {!productsLoading && filteredProducts.length === 0 && (
            <div className="px-5 py-10 text-center text-[#8c7d73]">No products found.</div>
          )}

          {paginatedProducts.map((product) => {
            const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
            const isLowStock = Object.values(product.stock).some((count) => count < 5);

            return (
              <div
                key={product.id}
                className="p-4"
                onClick={() => openProductView(product)}
              >
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 shrink-0 rounded-xl border border-[#d7c9b8] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-base font-semibold text-[#2c2b28]">{product.name}</p>
                    <p className="mt-1 text-sm text-[#8f8376]">LKR {product.price?.toLocaleString()}</p>
                    <span className="mt-2 inline-flex rounded-full bg-[#eae0d6] px-3 py-1 text-sm text-[#5f564d]">
                      {product.collection}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {Object.entries(product.stock).map(([size, count]) => (
                    <div key={size} className="min-w-12 rounded-lg border border-[#d7c9b8] bg-[#fcfaf7] px-3 py-2 text-center">
                      <p className="text-[11px] font-bold uppercase text-[#8f8376]">{size}</p>
                      <p className={`text-sm font-semibold ${count < 5 ? "text-amber-600" : "text-[#2c2b28]"}`}>
                        {count}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  {product.isSoldOut || totalStock === 0 ? (
                    <span className="flex items-center gap-1.5 text-sm font-semibold uppercase text-rose-600">
                      <AlertCircle size={16} /> Sold Out
                    </span>
                  ) : isLowStock ? (
                    <span className="flex items-center gap-1.5 text-sm font-semibold uppercase text-amber-600">
                      <AlertCircle size={16} /> Low Stock
                    </span>
                  ) : (
                    <span className="text-sm font-semibold uppercase text-emerald-600">In Stock</span>
                  )}

                  <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => openProductView(product, true)}
                      aria-label={`Edit ${product.name}`}
                      className="p-2.5 text-[#8f8376] hover:text-[#2c2b28] hover:bg-[#eae0d6] rounded-xl transition-all"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError("");
                        setDeleteTarget(product);
                      }}
                      aria-label={`Delete ${product.name}`}
                      className="p-2.5 text-[#8f8376] hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {!productsLoading && !productsError && (
          <AdminPagination
            currentPage={safePage}
            totalItems={filteredProducts.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <AddProductModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={refreshProducts}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete product?"
        message={`"${deleteTarget?.name || "This product"}" will be permanently removed from inventory.`}
        confirmLabel="Delete Product"
        type="delete"
        loading={deleting}
        onCancel={() => {
          if (deleting) return;
          setDeleteTarget(null);
        }}
        onConfirm={confirmDeleteProduct}
      />
    </div>
  );
};

export default InventoryPage;
