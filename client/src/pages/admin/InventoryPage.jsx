import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddProductModal from "../../components/admin/AddProductModel";
import { useAdmin } from "../../context/AdminContext";
import { AlertCircle, Search, Edit2, Plus } from "lucide-react";

const InventoryPage = () => {
  const navigate = useNavigate();
  const { products, productsLoading, productsError, refreshProducts } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const openProductView = (product, editMode = false) => {
    navigate(`/admin/products/${product.id}`, {
      state: {
        from: "/admin/inventory",
        edit: editMode,
      },
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.collection.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-[#3b302a]">Inventory</h2>
          <p className="text-[#a3948b] mt-1">
            Manage stock levels across all collections
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3b302a] text-white rounded-xl text-sm hover:bg-[#2e2622] transition-all shadow-sm"
          >
            <Plus size={18} />
            Add Product
          </button>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3948b]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-[#e5ddd5] rounded-xl text-sm w-full md:w-72 focus:ring-1 focus:ring-[#c2b2a6] outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5ddd5] overflow-hidden shadow-sm">
        {productsError && (
          <div className="px-6 py-3 bg-rose-50 text-rose-700 text-sm border-b border-rose-100">
            {productsError}
          </div>
        )}
        {productsLoading && (
          <div className="px-6 py-3 bg-[#fcfaf7] text-[#6b5e55] text-sm border-b border-[#e5ddd5]">
            Loading products...
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfaf7] border-b border-[#e5ddd5]">
                <th className="px-6 py-4 text-xs font-semibold text-[#a3948b] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#a3948b] uppercase tracking-wider">
                  Collection
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#a3948b] uppercase tracking-wider">
                  Sizes & Stock
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#a3948b] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8]">
              {filteredProducts.map((product) => {
                const totalStock = Object.values(product.stock).reduce(
                  (a, b) => a + b,
                  0,
                );
                const isLowStock = Object.values(product.stock).some(
                  (count) => count < 5,
                );
                return (
                  <tr
                    key={product.id}
                    onClick={() => openProductView(product)}
                    className="hover:bg-[#fcfaf7] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-[#e5ddd5]"
                        />
                        <div>
                          <p className="font-medium text-[#3b302a]">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#a3948b]">
                            ${product.price}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#6b5e55] px-3 py-1 bg-[#f8f5f2] rounded-full">
                        {product.collection}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        {Object.entries(product.stock).map(([size, count]) => (
                          <div
                            key={size}
                            className="flex flex-col items-center"
                          >
                            <span className="text-[10px] text-[#a3948b] font-bold mb-1">
                              {size}
                            </span>
                            <span
                              className={`text-sm font-medium ${count < 5 ? "text-amber-600" : "text-[#3b302a]"}`}
                            >
                              {count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {totalStock === 0 ? (
                        <span className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold uppercase">
                          <AlertCircle size={14} /> Sold Out
                        </span>
                      ) : isLowStock ? (
                        <span className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold uppercase">
                          <AlertCircle size={14} /> Low Stock
                        </span>
                      ) : (
                        <span className="text-emerald-600 text-xs font-semibold uppercase">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          openProductView(product, true);
                        }}
                        className="p-2 text-[#a3948b] hover:text-[#3b302a] hover:bg-[#f8f5f2] rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <AddProductModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={refreshProducts}
      />
    </div>
  );
};

export default InventoryPage;
