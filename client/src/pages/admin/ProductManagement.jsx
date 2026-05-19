import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Eye, Loader2, Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddProductModal from '../../components/admin/AddProductModel';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { getProductById } from '../../services/productApi';

const ProductManagement = () => {
  const { products, productsLoading, productsError, addProduct, editProduct, deleteProduct, refreshProducts } = useAdmin();
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [isAddOpen, setIsAddOpen]           = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError]     = useState("");
  const [formData, setFormData] = useState({
    name: '', collection: '', price: '', tags: '', image: '',
    stock: { S: 0, M: 0, L: 0, XL: 0 },
  });

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({ ...product, tags: product.tags.join(', ') });
    setIsModalOpen(true);
  };

  const openDetailsModal = async (product) => {
    const productId = product.id;
    const hasMongoId = /^[a-f\d]{24}$/i.test(productId);
    try {
      setDetailsLoading(true);
      setDetailsError("");
      setSelectedProduct(product.raw || null);
      if (!hasMongoId) { setDetailsError("This sample product does not have a database ID"); return; }
      const token = localStorage.getItem("adminToken");
      if (!token) { setDetailsError("Admin token missing. Please login again."); return; }
      const response = await getProductById(productId, token);
      setSelectedProduct(response.data);
    } catch (error) {
      setDetailsError(error.response?.data?.message || "Failed to load product");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      stock: Object.fromEntries(Object.entries(formData.stock).map(([k, v]) => [k, parseInt(v)])),
    };
    if (editingProduct) editProduct({ ...productData, id: editingProduct.id });
    else addProduct(productData);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    const product = products.find(item => item.id === id);
    setDeleteTarget(product || { id, name: "this product" });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-[#3b302a]">Product Management</h2>
          <p className="text-base text-[#a3948b] mt-2">Add, update or remove items from your catalog</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3b302a] text-white text-base font-semibold rounded-xl hover:bg-[#2a221d] transition-all shadow-lg shadow-[#3b302a]/10"
        >
          <Plus size={22} /> Add New Product
        </button>
      </div>

      {productsError && (
        <div className="bg-rose-50 text-rose-700 border border-rose-100 px-5 py-4 text-base rounded-xl">{productsError}</div>
      )}
      {productsLoading && (
        <div className="bg-white border border-[#e5ddd5] px-5 py-4 text-base text-[#6b5e55] rounded-xl">Loading products...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => openDetailsModal(product)}
            className="bg-white rounded-2xl border border-[#e5ddd5] overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="relative h-64 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); openDetailsModal(product); }}
                  className="p-2.5 bg-white/90 backdrop-blur-md text-[#3b302a] rounded-full shadow hover:bg-white transition-all" title="View details">
                  <Eye size={20} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); openEditModal(product); }}
                  className="p-2.5 bg-white/90 backdrop-blur-md text-[#3b302a] rounded-full shadow hover:bg-white transition-all">
                  <Edit2 size={20} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                  className="p-2.5 bg-white/90 backdrop-blur-md text-rose-600 rounded-full shadow hover:bg-rose-50 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-[#3b302a]/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-[#a3948b] uppercase tracking-widest font-bold mb-1">{product.collection}</p>
                  <h3 className="text-xl font-bold text-[#3b302a]">{product.name}</h3>
                </div>
                <p className="text-xl font-bold text-[#3b302a]">LKR {product.price?.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#f3ede8]">
                <div className="flex -space-x-2">
                  {Object.entries(product.stock).map(([size, count]) => (
                    <div key={size} className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${count > 0 ? 'bg-[#fcfaf7] text-[#3b302a]' : 'bg-gray-100 text-gray-400 line-through'}`}>
                      {size}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[#a3948b] ml-auto font-medium">
                  Total: {Object.values(product.stock).reduce((a, b) => a + b, 0)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
              <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-[#e5ddd5] flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#3b302a]">Edit Product</h3>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#f8f5f2] rounded-full">
                    <X size={26} />
                  </button>
                </div>
                <div className="p-8 space-y-6 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Product Name", key: "name",       placeholder: "e.g. Silk Sleep Set" },
                      { label: "Collection",   key: "collection", placeholder: "e.g. Luxe Silk" },
                      { label: "Price (LKR)",  key: "price",      placeholder: "" },
                      { label: "Tags",         key: "tags",       placeholder: "New, Featured, Best Seller" },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-bold text-[#a3948b] uppercase tracking-widest">{label}</label>
                        <input type={key === "price" ? "number" : "text"} value={formData[key]} placeholder={placeholder}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className="w-full bg-[#fcfaf7] border border-[#e5ddd5] rounded-xl px-4 py-3 text-base outline-none focus:ring-1 focus:ring-[#c2b2a6]" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#a3948b] uppercase tracking-widest">Stock Per Size</label>
                    <div className="grid grid-cols-4 gap-4">
                      {['S', 'M', 'L', 'XL'].map(size => (
                        <div key={size} className="space-y-1">
                          <label className="block text-center text-sm font-bold text-[#6b5e55]">{size}</label>
                          <input type="number" value={formData.stock[size]}
                            onChange={(e) => setFormData({ ...formData, stock: { ...formData.stock, [size]: e.target.value } })}
                            className="w-full bg-[#fcfaf7] border border-[#e5ddd5] rounded-lg px-2 py-2.5 text-center text-base outline-none focus:ring-1 focus:ring-[#c2b2a6]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-8 border-t border-[#e5ddd5] bg-[#fcfaf7] flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3.5 bg-white border border-[#e5ddd5] text-base text-[#6b5e55] font-semibold rounded-xl hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-3.5 bg-[#3b302a] text-white text-base font-semibold rounded-xl hover:bg-[#2a221d] transition-all">
                    Update Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={refreshProducts} />
      <ProductDetailsModal product={selectedProduct} loading={detailsLoading} error={detailsError}
        onClose={() => { setSelectedProduct(null); setDetailsError(""); }} />
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete product?"
        message={`This will remove ${deleteTarget?.name || "this product"} from the catalog. This action cannot be undone.`}
        confirmLabel="Delete Product" type="delete"
        onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete}
      />
    </div>
  );
};

const ProductDetailsModal = ({ product, loading, error, onClose }) => {
  if (!product && !loading && !error) return null;
  const images = product?.colors?.flatMap((c) => c.images || []) || [];
  const mainImage = images[0]?.url || "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80";
  const totalStock = product?.colors?.reduce((t, c) => t + (c.sizes || []).reduce((s, i) => s + Number(i.stock || 0), 0), 0) || 0;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-[#e5ddd5] shadow-2xl rounded-2xl">
        <div className="sticky top-0 bg-white border-b border-[#e5ddd5] px-8 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#3b302a]">Product Details</h3>
            <p className="text-sm text-[#a3948b] mt-0.5">{product?._id || "Loading..."}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2.5 hover:bg-[#f8f5f2] text-[#6b5e55] rounded-xl">
            <X size={24} />
          </button>
        </div>

        {loading && (
          <div className="p-12 flex items-center justify-center gap-3 text-base text-[#6b5e55]">
            <Loader2 size={22} className="animate-spin" /> Loading product...
          </div>
        )}
        {error && <div className="m-6 bg-rose-50 border border-rose-100 text-rose-700 px-5 py-4 text-base rounded-xl">{error}</div>}

        {product && (
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
              <div className="space-y-3">
                <img src={mainImage} alt={product.name} className="w-full aspect-square object-cover bg-[#f8f5f2] border border-[#e5ddd5] rounded-xl" />
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img) => (
                    <img key={img.publicId || img.url} src={img.url} alt={product.name}
                      className="w-full aspect-square object-cover border border-[#e5ddd5] rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-[#a3948b] uppercase tracking-widest font-bold">
                    {product.collection} / {product.setName}
                  </p>
                  <h2 className="text-3xl font-bold text-[#3b302a] mt-1">{product.name}</h2>
                  <p className="text-2xl font-bold text-[#3b302a] mt-2">LKR {Number(product.price || 0).toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <DetailTile label="Total Stock" value={totalStock} />
                  <DetailTile label="Colors"      value={product.colors?.length || 0} />
                  <DetailTile label="Featured"    value={product.isFeatured   ? "Yes" : "No"} />
                  <DetailTile label="New Arrival" value={product.isNewArrival ? "Yes" : "No"} />
                </div>
                <DetailBlock label="Description" value={product.description || "No description"} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DetailBlock label="Fabric"       value={product.fabric} />
                  <DetailBlock label="Design"       value={product.design} />
                  <DetailBlock label="Product Care" value={product.productCare} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#a3948b] uppercase tracking-widest">Colors & Size Quantity</h4>
              {product.colors?.map((color) => (
                <div key={color._id || color.colorName} className="border border-[#e5ddd5] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 bg-[#fcfaf7] flex items-center gap-4 border-b border-[#e5ddd5]">
                    <span className="w-7 h-7 rounded border border-[#d7ccc3]" style={{ backgroundColor: color.colorCode || "#ffffff" }} />
                    <div>
                      <p className="text-base font-semibold text-[#3b302a]">{color.colorName}</p>
                      <p className="text-sm text-[#a3948b]">{color.colorCode || "No color code"}</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {color.sizes?.map((item) => (
                      <div key={item.size} className="border border-[#e5ddd5] px-4 py-3 rounded-lg text-center">
                        <p className="text-xs text-[#a3948b] uppercase font-bold mb-1">{item.size}</p>
                        <p className="text-xl font-bold text-[#3b302a]">{item.stock}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailTile = ({ label, value }) => (
  <div className="bg-[#fcfaf7] border border-[#e5ddd5] px-4 py-4 rounded-xl">
    <p className="text-sm text-[#a3948b] uppercase font-bold mb-1">{label}</p>
    <p className="text-xl font-bold text-[#3b302a]">{value}</p>
  </div>
);

const DetailBlock = ({ label, value }) => (
  <div>
    <p className="text-sm text-[#a3948b] uppercase tracking-widest font-bold mb-1">{label}</p>
    <p className="text-base text-[#4f443d] leading-relaxed">{value || "N/A"}</p>
  </div>
);

export default ProductManagement;
