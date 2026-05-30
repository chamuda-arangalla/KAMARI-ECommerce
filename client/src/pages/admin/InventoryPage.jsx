import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddProductModal from "../../components/admin/AddProductModel";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAdmin } from "../../context/useAdmin";
import { deleteProduct } from "../../services/productApi";
import { AlertCircle, Search, Edit2, Plus, Trash2 } from "lucide-react";

const InventoryPage = () => {
  const navigate = useNavigate();
  const { products, productsLoading, productsError, refreshProducts } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#3b302a]">Inventory</h2>
          <p className="text-base text-[#a3948b] mt-2">Manage stock levels across all collections</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3b302a] text-white text-base font-semibold rounded-xl hover:bg-[#2e2622] transition-all shadow-sm"
          >
            <Plus size={20} />
            Add Product
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3948b]" size={20} />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white border border-[#e5ddd5] rounded-xl text-base w-full md:w-72 focus:ring-1 focus:ring-[#c2b2a6] outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5ddd5] overflow-hidden shadow-sm">
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
          <div className="px-6 py-4 bg-[#fcfaf7] text-[#6b5e55] text-base border-b border-[#e5ddd5]">
            Loading products...
          </div>
        )}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfaf7] border-b border-[#e5ddd5]">
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Product</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Collection</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Sizes & Stock</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Status</th>
                <th className="px-6 py-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8]">
              {filteredProducts.map((product) => {
                const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
                const isLowStock = Object.values(product.stock).some((count) => count < 5);
                return (
                  <tr
                    key={product.id}
                    onClick={() => openProductView(product)}
                    className="hover:bg-[#fcfaf7] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover border border-[#e5ddd5]"
                        />
                        <div>
                          <p className="text-base font-semibold text-[#3b302a]">{product.name}</p>
                          <p className="text-sm text-[#a3948b] mt-0.5">LKR {product.price?.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-base text-[#6b5e55] px-3 py-1.5 bg-[#f8f5f2] rounded-full">
                        {product.collection}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-4 flex-wrap">
                        {Object.entries(product.stock).map(([size, count]) => (
                          <div key={size} className="flex flex-col items-center">
                            <span className="text-xs text-[#a3948b] font-bold mb-1 uppercase">{size}</span>
                            <span className={`text-base font-semibold ${count < 5 ? "text-amber-600" : "text-[#3b302a]"}`}>
                              {count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {totalStock === 0 ? (
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
                    <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openProductView(product, true)}
                          aria-label={`Edit ${product.name}`}
                          className="p-2.5 text-[#a3948b] hover:text-[#3b302a] hover:bg-[#f8f5f2] rounded-xl transition-all"
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
                          className="p-2.5 text-[#a3948b] hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
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

          {filteredProducts.map((product) => {
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
                    className="h-20 w-20 shrink-0 rounded-xl border border-[#e5ddd5] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-base font-semibold text-[#3b302a]">{product.name}</p>
                    <p className="mt-1 text-sm text-[#a3948b]">LKR {product.price?.toLocaleString()}</p>
                    <span className="mt-2 inline-flex rounded-full bg-[#f8f5f2] px-3 py-1 text-sm text-[#6b5e55]">
                      {product.collection}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {Object.entries(product.stock).map(([size, count]) => (
                    <div key={size} className="min-w-12 rounded-lg border border-[#e5ddd5] bg-[#fcfaf7] px-3 py-2 text-center">
                      <p className="text-[11px] font-bold uppercase text-[#a3948b]">{size}</p>
                      <p className={`text-sm font-semibold ${count < 5 ? "text-amber-600" : "text-[#3b302a]"}`}>
                        {count}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  {totalStock === 0 ? (
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
                      className="p-2.5 text-[#a3948b] hover:text-[#3b302a] hover:bg-[#f8f5f2] rounded-xl transition-all"
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
                      className="p-2.5 text-[#a3948b] hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
