import { useState } from "react";
import { X, Upload } from "lucide-react";
import { createProduct } from "../../services/productApi";

const initialForm = {
  name: "",
  collection: "",
  setName: "",
  price: "",
  description: "",
  fabric: "",
  design: "",
  productCare: "",
};

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImagesChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const colors = [
        {
          colorName: "Ivory",
          colorCode: "#F8F5F2",
          imageIndexes: images.map((_, index) => index),
          sizes: [
            { size: "XS", stock: 0 },
            { size: "S", stock: 0 },
            { size: "M", stock: 0 },
            { size: "L", stock: 0 },
          ],
        },
      ];

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("colors", JSON.stringify(colors));
      formData.append("isFeatured", "false");
      formData.append("isNewArrival", "true");

      images.forEach((image) => {
        formData.append("images", image);
      });

      const token = localStorage.getItem("adminToken");

      await createProduct(formData, token);

      setForm(initialForm);
      setImages([]);
      onSuccess?.();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-[#e5ddd5] shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5ddd5]">
          <div>
            <h3 className="text-xl font-semibold text-[#3b302a]">Add Product</h3>
            <p className="text-sm text-[#a3948b]">Create a new product for KAMARI</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#a3948b] hover:text-[#3b302a] hover:bg-[#f8f5f2] rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Product Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Collection" name="collection" value={form.collection} onChange={handleChange} />
            <Input label="Set Name" name="setName" value={form.setName} onChange={handleChange} />
            <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} />
          </div>

          <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />
          <Textarea label="Fabric" name="fabric" value={form.fabric} onChange={handleChange} />
          <Textarea label="Design" name="design" value={form.design} onChange={handleChange} />
          <Textarea label="Product Care" name="productCare" value={form.productCare} onChange={handleChange} />

          <div>
            <label className="block text-xs font-semibold text-[#a3948b] uppercase tracking-wider mb-2">
              Product Images
            </label>

            <label className="flex flex-col items-center justify-center border border-dashed border-[#c2b2a6] rounded-xl p-8 cursor-pointer hover:bg-[#fcfaf7] transition">
              <Upload size={24} className="text-[#a3948b] mb-2" />
              <span className="text-sm text-[#6b5e55]">
                Upload product images
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImagesChange}
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <p className="text-xs text-[#a3948b] mt-2">
                {images.length} image(s) selected
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#e5ddd5] text-sm text-[#6b5e55] hover:bg-[#f8f5f2]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#3b302a] text-white text-sm hover:bg-[#2e2622] disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-[#a3948b] uppercase tracking-wider mb-2">
      {label}
    </label>
    <input
      required
      {...props}
      className="w-full px-4 py-2.5 bg-white border border-[#e5ddd5] rounded-xl text-sm focus:ring-1 focus:ring-[#c2b2a6] outline-none"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-[#a3948b] uppercase tracking-wider mb-2">
      {label}
    </label>
    <textarea
      required
      rows={3}
      {...props}
      className="w-full px-4 py-2.5 bg-white border border-[#e5ddd5] rounded-xl text-sm focus:ring-1 focus:ring-[#c2b2a6] outline-none resize-none"
    />
  </div>
);

export default AddProductModal;