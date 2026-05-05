import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Edit2, Trash2, X, Upload, MoreVertical, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductManagement = () => {
  const { products, addProduct, editProduct, deleteProduct } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    collection: '',
    price: '',
    tags: '',
    image: '',
    stock: { S: 0, M: 0, L: 0, XL: 0 }
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      collection: '',
      price: '',
      tags: '',
      image: '',
      stock: { S: 0, M: 0, L: 0, XL: 0 }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      tags: product.tags.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      stock: Object.fromEntries(Object.entries(formData.stock).map(([k, v]) => [k, parseInt(v)]))
    };

    if (editingProduct) {
      editProduct({ ...productData, id: editingProduct.id });
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-[#3b302a]">Product Management</h2>
          <p className="text-[#a3948b] mt-1">Add, update or remove items from your catalog</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3b302a] text-white rounded-xl hover:bg-[#2a221d] transition-all shadow-lg shadow-[#3b302a]/10"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-[#e5ddd5] overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-64 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => openEditModal(product)}
                  className="p-2 bg-white/90 backdrop-blur-md text-[#3b302a] rounded-full shadow-sm hover:bg-white transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-white/90 backdrop-blur-md text-rose-600 rounded-full shadow-sm hover:bg-rose-50 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-[#3b302a]/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-[#a3948b] uppercase tracking-widest font-bold mb-1">{product.collection}</p>
                  <h3 className="text-xl font-semibold text-[#3b302a]">{product.name}</h3>
                </div>
                <p className="text-xl font-bold text-[#3b302a]">${product.price}</p>
              </div>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#f3ede8]">
                <div className="flex -space-x-2">
                  {Object.entries(product.stock).map(([size, count]) => (
                    <div key={size} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${count > 0 ? 'bg-[#fcfaf7] text-[#3b302a]' : 'bg-gray-100 text-gray-400 line-through'}`}>
                      {size}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#a3948b] ml-auto">
                  Total Stock: {Object.values(product.stock).reduce((a, b) => a + b, 0)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-[#e5ddd5] flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-[#3b302a]">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#f8f5f2] rounded-full">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#a3948b] uppercase tracking-widest">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#fcfaf7] border border-[#e5ddd5] rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#c2b2a6]"
                        placeholder="e.g. Silk Sleep Set"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#a3948b] uppercase tracking-widest">Collection</label>
                      <input 
                        type="text" 
                        required
                        value={formData.collection}
                        onChange={(e) => setFormData({...formData, collection: e.target.value})}
                        className="w-full bg-[#fcfaf7] border border-[#e5ddd5] rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#c2b2a6]"
                        placeholder="e.g. Luxe Silk"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#a3948b] uppercase tracking-widest">Price ($)</label>
                      <input 
                        type="number" 
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-[#fcfaf7] border border-[#e5ddd5] rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#c2b2a6]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#a3948b] uppercase tracking-widest">Tags (comma separated)</label>
                      <input 
                        type="text" 
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        className="w-full bg-[#fcfaf7] border border-[#e5ddd5] rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#c2b2a6]"
                        placeholder="New, Featured, Best Seller"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#a3948b] uppercase tracking-widest">Image URL</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="flex-1 bg-[#fcfaf7] border border-[#e5ddd5] rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#c2b2a6]"
                        placeholder="https://images.unsplash.com/..."
                      />
                      {formData.image && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#e5ddd5]">
                          <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-[#a3948b] uppercase tracking-widest">Inventory Levels</label>
                    <div className="grid grid-cols-4 gap-4">
                      {['S', 'M', 'L', 'XL'].map(size => (
                        <div key={size} className="space-y-2">
                          <label className="block text-center text-[10px] font-bold text-[#6b5e55]">{size}</label>
                          <input 
                            type="number" 
                            value={formData.stock[size]}
                            onChange={(e) => setFormData({
                              ...formData, 
                              stock: { ...formData.stock, [size]: e.target.value }
                            })}
                            className="w-full bg-[#fcfaf7] border border-[#e5ddd5] rounded-lg px-2 py-2 text-center outline-none focus:ring-1 focus:ring-[#c2b2a6]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-[#e5ddd5] bg-[#fcfaf7] flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-white border border-[#e5ddd5] text-[#6b5e55] rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-[#3b302a] text-white rounded-xl font-semibold hover:bg-[#2a221d] transition-all"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagement;
