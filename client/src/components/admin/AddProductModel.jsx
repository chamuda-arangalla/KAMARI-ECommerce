import { useMemo, useState, useEffect } from "react";
import {
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { createProduct } from "../../services/productApi";
import { getCollectionsAdmin } from "../../services/collectionApi";

const initialForm = {
  name: "",
  collection: "",
  setName: "",
  price: "",
  description: "",
  fabric: "",
  design: "",
  productCare: "",
  isFeatured: false,
  isNewArrival: true,
};

const createColor = () => ({
  id: crypto.randomUUID(),
  colorName: "",
  colorCode: "#f8f5f2",
  imageIds: [],
  sizes: [
    { id: crypto.randomUUID(), size: "XS", stock: 0 },
    { id: crypto.randomUUID(), size: "S", stock: 0 },
    { id: crypto.randomUUID(), size: "M", stock: 0 },
    { id: crypto.randomUUID(), size: "L", stock: 0 },
  ],
});

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [sizeChartFile, setSizeChartFile] = useState(null);
  const [colors, setColors] = useState([createColor()]);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("adminToken");
    getCollectionsAdmin(token)
      .then((res) => setCollections(res.data || []))
      .catch(() => setCollections([]));
  }, [isOpen]);

  const imageIndexById = useMemo(
    () => new Map(images.map((image, index) => [image.id, index])),
    [images],
  );

  if (!isOpen) return null;

  const resetForm = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
    if (sizeChartFile) URL.revokeObjectURL(sizeChartFile.preview);
    setForm(initialForm);
    setImages([]);
    setSizeChartFile(null);
    setColors([createColor()]);
  };


  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImagesChange = (e) => {
    const selectedImages = Array.from(e.target.files || []).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...selectedImages]);
    e.target.value = "";
  };

  const handleSizeChartChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (sizeChartFile) URL.revokeObjectURL(sizeChartFile.preview);

    setSizeChartFile({
      file,
      preview: URL.createObjectURL(file),
    });
    e.target.value = "";
  };

  const removeImage = (imageId) => {
    setImages((prev) => {
      const image = prev.find((item) => item.id === imageId);
      if (image) URL.revokeObjectURL(image.preview);
      return prev.filter((item) => item.id !== imageId);
    });

    setColors((prev) =>
      prev.map((color) => ({
        ...color,
        imageIds: color.imageIds.filter((id) => id !== imageId),
      })),
    );
  };

  const updateColor = (colorId, field, value) => {
    setColors((prev) =>
      prev.map((color) =>
        color.id === colorId ? { ...color, [field]: value } : color,
      ),
    );
  };

  const toggleColorImage = (colorId, imageId) => {
    setColors((prev) =>
      prev.map((color) => {
        if (color.id !== colorId) return color;

        const hasImage = color.imageIds.includes(imageId);

        return {
          ...color,
          imageIds: hasImage
            ? color.imageIds.filter((id) => id !== imageId)
            : [...color.imageIds, imageId],
        };
      }),
    );
  };

  const addColor = () => {
    setColors((prev) => [...prev, createColor()]);
  };

  const removeColor = (colorId) => {
    setColors((prev) =>
      prev.length === 1 ? prev : prev.filter((color) => color.id !== colorId),
    );
  };

  const updateSize = (colorId, sizeId, field, value) => {
    setColors((prev) =>
      prev.map((color) => {
        if (color.id !== colorId) return color;

        return {
          ...color,
          sizes: color.sizes.map((size) =>
            size.id === sizeId ? { ...size, [field]: value } : size,
          ),
        };
      }),
    );
  };

  const addSize = (colorId) => {
    setColors((prev) =>
      prev.map((color) =>
        color.id === colorId
          ? {
              ...color,
              sizes: [
                ...color.sizes,
                { id: crypto.randomUUID(), size: "", stock: 0 },
              ],
            }
          : color,
      ),
    );
  };

  const removeSize = (colorId, sizeId) => {
    setColors((prev) =>
      prev.map((color) =>
        color.id === colorId
          ? {
              ...color,
              sizes:
                color.sizes.length === 1
                  ? color.sizes
                  : color.sizes.filter((size) => size.id !== sizeId),
            }
          : color,
      ),
    );
  };

  const validate = () => {
    if (!images.length) return "Upload at least one product image";

    for (const color of colors) {
      if (!color.colorName.trim()) return "Each color needs a color name";
      if (!color.imageIds.length) return "Assign at least one image to each color";

      const hasInvalidSize = color.sizes.some(
        (size) => !size.size.trim() || Number(size.stock) < 0,
      );

      if (hasInvalidSize) {
        return "Each size needs a label and a stock value of 0 or more";
      }
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const colorsPayload = colors.map((color) => ({
        colorName: color.colorName.trim(),
        colorCode: color.colorCode,
        imageIndexes: color.imageIds
          .map((imageId) => imageIndexById.get(imageId))
          .filter((index) => index !== undefined),
        sizes: color.sizes.map((size) => ({
          size: size.size.trim().toUpperCase(),
          stock: Number(size.stock) || 0,
        })),
      }));

      formData.append("colors", JSON.stringify(colorsPayload));

      images.forEach((image) => {
        formData.append("images", image.file);
      });

      if (sizeChartFile) {
        formData.append("sizeChartImage", sizeChartFile.file);
      }

      const token = localStorage.getItem("adminToken");
      await createProduct(formData, token);

      resetForm();
      onSuccess?.();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/35 backdrop-blur-sm flex items-stretch justify-center p-0 sm:items-center sm:px-4 sm:py-6">
      <div className="flex h-[100dvh] w-full max-w-6xl flex-col bg-white border border-[#e5ddd5] shadow-2xl sm:h-auto sm:max-h-[92vh]">
        <div className="shrink-0 flex items-start justify-between gap-4 px-5 py-5 sm:items-center sm:px-8 sm:py-6 border-b border-[#e5ddd5] bg-[#fcfaf7]">
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-[#3b302a]">Add Product</h3>
            <p className="mt-1 max-w-sm text-sm sm:text-base text-[#8c7d73]">
              Build colors, assign images, and enter size stock.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2.5 text-[#8c7d73] hover:text-[#3b302a] hover:bg-white border border-transparent hover:border-[#e5ddd5] rounded-xl"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-0">
            <div className="p-5 sm:p-6 space-y-6">
              <section className="space-y-4">
                <SectionTitle title="Product Details" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Product Name" name="name" value={form.name} onChange={handleChange} />

                  <div>
                    <SmallLabel>Collection</SmallLabel>
                    <select
                      required
                      value={form.setName}
                      onChange={(e) => {
                        const selected = collections.find((c) => c.name === e.target.value);
                        setForm((prev) => ({
                          ...prev,
                          setName: selected ? selected.name : "",
                          collection: selected ? selected.name : "",
                        }));
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-[#e5ddd5] text-sm focus:ring-1 focus:ring-[#c2b2a6] outline-none"
                    >
                      <option value="">Select a collection</option>
                      {collections.map((col) => (
                        <option key={col._id} value={col.name}>{col.name}</option>
                      ))}
                    </select>
                  </div>

                  <Input label="Price (LKR)" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} />
                </div>

                <Textarea label="Description" name="description" value={form.description} onChange={handleChange} required={false} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Textarea label="Fabric" name="fabric" value={form.fabric} onChange={handleChange} />
                  <Textarea label="Design" name="design" value={form.design} onChange={handleChange} />
                  <Textarea label="Product Care" name="productCare" value={form.productCare} onChange={handleChange} />
                </div>

                <div>
                  <SmallLabel>Size Chart Image</SmallLabel>
                  <label className="flex items-center justify-between gap-4 border border-dashed border-[#c2b2a6] px-4 py-3 cursor-pointer hover:bg-[#fcfaf7]">
                    <span className="text-sm text-[#6b5e55]">
                      {sizeChartFile ? sizeChartFile.file.name : "Upload size chart from your device"}
                    </span>
                    <Upload size={18} className="text-[#8c7d73]" />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleSizeChartChange}
                      className="hidden"
                    />
                  </label>
                  {sizeChartFile && (
                    <div className="mt-3 w-36 border border-[#e5ddd5] bg-white">
                      <img
                        src={sizeChartFile.preview}
                        alt="Size chart preview"
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-6">
                  <Checkbox label="Best Seller" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                  <Checkbox label="New Arrival" name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <SectionTitle title="Colors, Images & Stock" />
                  <button
                    type="button"
                    onClick={addColor}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3b302a] text-white text-base font-medium rounded-lg hover:bg-[#2e2622]"
                  >
                    <Plus size={18} />
                    Add Color
                  </button>
                </div>

                <div className="space-y-4">
                  {colors.map((color, colorIndex) => (
                    <ColorEditor
                      key={color.id}
                      color={color}
                      colorIndex={colorIndex}
                      images={images}
                      onUpdateColor={updateColor}
                      onToggleImage={toggleColorImage}
                      onAddSize={addSize}
                      onUpdateSize={updateSize}
                      onRemoveSize={removeSize}
                      onRemoveColor={removeColor}
                      canRemoveColor={colors.length > 1}
                    />
                  ))}
                </div>
              </section>
            </div>

            <aside className="p-5 sm:p-6 bg-[#f8f5f2] border-t xl:border-t-0 xl:border-l border-[#e5ddd5] space-y-5">
              <SectionTitle title="Uploaded Images" />

              <label className="flex flex-col items-center justify-center border border-dashed border-[#b8a99f] bg-white p-6 sm:p-8 cursor-pointer hover:border-[#3b302a] transition">
                <Upload size={28} className="text-[#6b5e55] mb-3" />
                <span className="text-base font-semibold text-[#3b302a]">Upload product images</span>
                <span className="text-sm text-[#8c7d73] mt-1">JPG, PNG, or WEBP up to 5MB</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImagesChange}
                  className="hidden"
                />
              </label>

              {images.length === 0 ? (
                <div className="h-48 border border-[#e5ddd5] bg-white flex flex-col items-center justify-center text-[#8c7d73]">
                  <ImagePlus size={28} />
                  <p className="text-sm mt-2">No images selected</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative group bg-white border border-[#e5ddd5]">
                      <img
                        src={image.preview}
                        alt={`Product upload ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      <span className="absolute left-2 top-2 px-2 py-1 bg-black/60 text-white text-xs">
                        #{index}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute right-2 top-2 p-1.5 bg-white text-rose-600 opacity-0 group-hover:opacity-100 transition"
                        aria-label="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>
          </div>

          <div className="shrink-0 bg-white border-t border-[#e5ddd5] px-5 py-4 sm:px-8 sm:py-5 grid grid-cols-2 gap-3 sm:flex sm:justify-end sm:gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 sm:px-6 py-3 rounded-xl border border-[#d7ccc3] text-base font-medium text-[#6b5e55] hover:bg-[#f8f5f2] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3 rounded-xl bg-[#3b302a] text-white text-base font-semibold hover:bg-[#2e2622] disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ColorEditor = ({
  color,
  colorIndex,
  images,
  onUpdateColor,
  onToggleImage,
  onAddSize,
  onUpdateSize,
  onRemoveSize,
  onRemoveColor,
  canRemoveColor,
}) => (
  <div className="border border-[#e5ddd5] bg-white">
    <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#f0e8e1]">
      <div className="flex items-center gap-3">
        <span
          className="w-8 h-8 border border-[#d7ccc3] rounded"
          style={{ backgroundColor: color.colorCode || "#ffffff" }}
        />
        <div>
          <p className="text-base font-semibold text-[#3b302a]">Color {colorIndex + 1}</p>
          <p className="text-sm text-[#8c7d73]">{color.imageIds.length} image(s) assigned</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemoveColor(color.id)}
        disabled={!canRemoveColor}
        className="p-2.5 text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg"
        aria-label="Remove color"
      >
        <Trash2 size={18} />
      </button>
    </div>

    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-4">
        <Input
          label="Color Name"
          value={color.colorName}
          onChange={(e) => onUpdateColor(color.id, "colorName", e.target.value)}
          placeholder="Ivory"
        />
        <Input
          label="Color Code"
          type="color"
          value={color.colorCode}
          onChange={(e) => onUpdateColor(color.id, "colorCode", e.target.value)}
        />
      </div>

      <div>
        <SmallLabel>Assign Images To This Color</SmallLabel>
        {images.length === 0 ? (
          <p className="text-sm text-[#8c7d73] border border-[#e5ddd5] px-4 py-3">
            Upload images first, then select the ones for this color.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {images.map((image, index) => {
              const selected = color.imageIds.includes(image.id);

              return (
                <button
                  type="button"
                  key={image.id}
                  onClick={() => onToggleImage(color.id, image.id)}
                  className={`relative border-2 ${selected ? "border-[#3b302a]" : "border-[#e5ddd5]"}`}
                >
                  <img
                    src={image.preview}
                    alt={`Assign upload ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  <span className={`absolute left-1.5 top-1.5 px-1.5 py-0.5 text-[10px] ${selected ? "bg-[#3b302a] text-white" : "bg-white text-[#6b5e55]"}`}>
                    #{index}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <SmallLabel>Size Quantity</SmallLabel>
          <button
            type="button"
            onClick={() => onAddSize(color.id)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#3b302a] hover:underline"
          >
            <Plus size={14} />
            Add Size
          </button>
        </div>

        <div className="space-y-2">
          {color.sizes.map((size) => (
            <div key={size.id} className="grid grid-cols-[minmax(0,1fr)_minmax(72px,96px)_36px] gap-2 sm:grid-cols-[1fr_120px_36px]">
              <input
                required
                value={size.size}
                onChange={(e) => onUpdateSize(color.id, size.id, "size", e.target.value)}
                className="w-full px-3 py-2 bg-[#fcfaf7] border border-[#e5ddd5] text-sm focus:ring-1 focus:ring-[#c2b2a6] outline-none"
                placeholder="Size"
              />
              <input
                required
                type="number"
                min="0"
                value={size.stock}
                onChange={(e) => onUpdateSize(color.id, size.id, "stock", e.target.value)}
                className="w-full px-3 py-2 bg-[#fcfaf7] border border-[#e5ddd5] text-sm focus:ring-1 focus:ring-[#c2b2a6] outline-none"
                placeholder="Qty"
              />
              <button
                type="button"
                onClick={() => onRemoveSize(color.id, size.id)}
                className="border border-[#e5ddd5] text-rose-600 hover:bg-rose-50"
                aria-label="Remove size"
              >
                <X size={15} className="mx-auto" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SectionTitle = ({ title }) => (
  <h4 className="text-sm font-bold text-[#8c7d73] uppercase tracking-wider">
    {title}
  </h4>
);

const SmallLabel = ({ children }) => (
  <label className="block text-sm font-semibold text-[#8c7d73] uppercase tracking-wider mb-2">
    {children}
  </label>
);

const Input = ({ label, required = true, ...props }) => (
  <div>
    {label && <SmallLabel>{label}</SmallLabel>}
    <input
      required={required}
      {...props}
      className="w-full px-4 py-3 bg-white border border-[#e5ddd5] text-base focus:ring-1 focus:ring-[#c2b2a6] outline-none"
    />
  </div>
);

const Textarea = ({ label, required = true, ...props }) => (
  <div>
    <SmallLabel>{label}</SmallLabel>
    <textarea
      required={required}
      rows={3}
      {...props}
      className="w-full px-4 py-3 bg-white border border-[#e5ddd5] text-base focus:ring-1 focus:ring-[#c2b2a6] outline-none resize-none"
    />
  </div>
);

const Checkbox = ({ label, ...props }) => (
  <label className="inline-flex items-center gap-3 text-base text-[#3b302a]">
    <input
      type="checkbox"
      {...props}
      className="h-5 w-5 accent-[#3b302a]"
    />
    {label}
  </label>
);

export default AddProductModal;
