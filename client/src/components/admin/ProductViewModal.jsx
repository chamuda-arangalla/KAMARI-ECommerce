import { useEffect, useState } from "react";
import { Edit2, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "../../services/productApi";
import { getCollectionsAdmin } from "../../services/collectionApi";
import ConfirmDialog from "../common/ConfirmDialog";

const fallbackImage =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80";

const createDraft = (product) => ({
  name: product.name || "",
  collection: product.collection || "",
  setName: product.setName || "",
  price: product.price || "",
  description: product.description || "",
  fabric: product.fabric || "",
  design: product.design || "",
  productCare: product.productCare || "",
  sizeChartImage: product.sizeChartImage || "",
  isFeatured: Boolean(product.isFeatured),
  isNewArrival: Boolean(product.isNewArrival),
  isSoldOut: Boolean(product.isSoldOut),
  colors: (product.colors || []).map((color) => ({
    colorName: color.colorName || "",
    colorCode: color.colorCode || "",
    images: color.images || [],
    sizes: (color.sizes || []).map((item) => ({
      size: item.size || "",
      stock: Number(item.stock || 0),
    })),
  })),
});

const createEmptyColor = () => ({
  colorName: "",
  colorCode: "#f8f5f2",
  images: [],
  sizes: [
    { size: "XS", stock: 0 },
    { size: "S", stock: 0 },
    { size: "M", stock: 0 },
    { size: "L", stock: 0 },
  ],
});

const createEmptySize = () => ({
  size: "",
  stock: 0,
});

const ProductViewModal = ({ productId, startInEdit = false, onClose, onChanged }) => {
  const [product, setProduct] = useState(null);
  const [draft, setDraft] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [localImageUploads, setLocalImageUploads] = useState([]);
  const [sizeChartUpload, setSizeChartUpload] = useState(null);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("adminToken");
        const response = await getProductById(productId, token);

        setProduct(response.data);
        setDraft(createDraft(response.data));
        setEditMode(startInEdit);
        setLocalImageUploads([]);
        setSizeChartUpload(null);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, startInEdit]);

  useEffect(() => {
    if (!editMode) return;

    const token = localStorage.getItem("adminToken");
    getCollectionsAdmin(token)
      .then((response) => setCollections(response.data || []))
      .catch(() => setCollections([]));
  }, [editMode]);

  if (!productId) return null;

  const images = product?.colors?.flatMap((color) => color.images || []) || [];
  const uniqueImages = images.filter(
    (image, index, list) =>
      image?.url && list.findIndex((item) => item.url === image.url) === index,
  );
  const mainImage = images[0]?.url || fallbackImage;
  const totalStock =
    product?.colors?.reduce(
      (total, color) =>
        total +
        (color.sizes || []).reduce(
          (sum, item) => sum + Number(item.stock || 0),
          0,
        ),
      0,
    ) || 0;

  const updateDraft = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateColor = (colorIndex, field, value) => {
    setDraft((prev) => ({
      ...prev,
      colors: prev.colors.map((color, index) =>
        index === colorIndex ? { ...color, [field]: value } : color,
      ),
    }));
  };

  const updateSize = (colorIndex, sizeIndex, field, value) => {
    setDraft((prev) => ({
      ...prev,
      colors: prev.colors.map((color, index) => {
        if (index !== colorIndex) return color;

        return {
          ...color,
          sizes: color.sizes.map((size, currentSizeIndex) =>
            currentSizeIndex === sizeIndex
              ? { ...size, [field]: field === "stock" ? Number(value) : value }
              : size,
          ),
        };
      }),
    }));
  };

  const addColor = () => {
    setDraft((prev) => ({
      ...prev,
      colors: [...prev.colors, createEmptyColor()],
    }));
  };

  const removeColor = (colorIndex) => {
    setDraft((prev) => ({
      ...prev,
      colors:
        prev.colors.length === 1
          ? prev.colors
          : prev.colors.filter((_, index) => index !== colorIndex),
    }));
  };

  const addSize = (colorIndex) => {
    setDraft((prev) => ({
      ...prev,
      colors: prev.colors.map((color, index) =>
        index === colorIndex
          ? { ...color, sizes: [...color.sizes, createEmptySize()] }
          : color,
      ),
    }));
  };

  const toggleColorImage = (colorIndex, image) => {
    if (!image?.url) return;

    setDraft((prev) => ({
      ...prev,
      colors: prev.colors.map((color, index) => {
        if (index !== colorIndex) return color;

        const hasImage = color.images.some((item) => item.url === image.url);

        return {
          ...color,
          images: hasImage
            ? color.images.filter((item) => item.url !== image.url)
            : [
                ...color.images,
                {
                  url: image.url,
                  publicId: image.publicId || image.url,
                },
              ],
        };
      }),
    }));
  };

  const addColorImageFile = (colorIndex, file) => {
    if (!file) return;

    const uploadId = crypto.randomUUID();
    const preview = URL.createObjectURL(file);
    setLocalImageUploads((prev) => [...prev, { uploadId, file, preview }]);
    setDraft((prev) => ({
      ...prev,
      colors: prev.colors.map((color, index) =>
        index === colorIndex
          ? {
              ...color,
              images: [
                ...color.images,
                {
                  url: preview,
                  publicId: uploadId,
                  uploadId,
                },
              ],
            }
          : color,
      ),
    }));
  };

  const handleSizeChartUpload = (file) => {
    if (!file) return;

    if (sizeChartUpload) URL.revokeObjectURL(sizeChartUpload.preview);

    setSizeChartUpload({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const removeSize = (colorIndex, sizeIndex) => {
    setDraft((prev) => ({
      ...prev,
      colors: prev.colors.map((color, index) => {
        if (index !== colorIndex) return color;

        return {
          ...color,
          sizes:
            color.sizes.length === 1
              ? color.sizes
              : color.sizes.filter((_, currentIndex) => currentIndex !== sizeIndex),
        };
      }),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const invalidColor = draft.colors.some(
        (color) =>
          !color.colorName.trim() ||
          color.sizes.some((size) => !size.size.trim() || Number(size.stock) < 0),
      );

      if (invalidColor) {
        setError("Each color needs a name, and each size needs a label with stock 0 or more");
        return;
      }

      const token = localStorage.getItem("adminToken");
      const referencedUploadIds = new Set(
        draft.colors.flatMap((color) =>
          color.images
            .filter((image) => image.uploadId)
            .map((image) => image.uploadId),
        ),
      );
      const referencedUploads = localImageUploads.filter((upload) =>
        referencedUploadIds.has(upload.uploadId),
      );
      const uploadIndexById = new Map(
        referencedUploads.map((upload, index) => [upload.uploadId, index]),
      );
      const colorsPayload = draft.colors.map((color) => ({
        ...color,
        colorName: color.colorName.trim(),
        images: color.images
          .filter((image) => !image.uploadId)
          .map((image) => ({
            url: image.url,
            publicId: image.publicId,
          })),
        imageIndexes: color.images
          .filter((image) => image.uploadId)
          .map((image) => uploadIndexById.get(image.uploadId))
          .filter((index) => index !== undefined),
        sizes: color.sizes.map((size) => ({
          size: size.size.trim().toUpperCase(),
          stock: Number(size.stock || 0),
        })),
      }));
      const formData = new FormData();

      Object.entries(draft).forEach(([key, value]) => {
        if (key !== "colors") formData.append(key, String(value));
      });
      formData.append("colors", JSON.stringify(colorsPayload));
      referencedUploads.forEach((upload) => {
        formData.append("images", upload.file);
      });
      if (sizeChartUpload) {
        formData.append("sizeChartImage", sizeChartUpload.file);
      }

      const response = await updateProduct(productId, formData, token);

      setProduct(response.data);
      setDraft(createDraft(response.data));
      localImageUploads.forEach((upload) => URL.revokeObjectURL(upload.preview));
      if (sizeChartUpload) URL.revokeObjectURL(sizeChartUpload.preview);
      setLocalImageUploads([]);
      setSizeChartUpload(null);
      setEditMode(false);
      onChanged?.();
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("adminToken");
      await deleteProduct(productId, token);

      onChanged?.();
      onClose();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteOpen(false);
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-stretch justify-center p-0 sm:items-center sm:p-4">
        <div className="absolute inset-0 bg-[#3b302a]/25 backdrop-blur-sm" onClick={onClose} />
        <div className="relative flex h-[100dvh] w-full max-w-6xl flex-col overflow-hidden border border-[#e5ddd5] bg-white shadow-xl sm:h-auto sm:max-h-[92vh] sm:rounded-3xl">
        <div className="shrink-0 bg-[#fcfaf7] border-b border-[#e5ddd5] px-4 py-4 sm:px-8 sm:py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-t-3xl">
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold text-[#3b302a] sm:text-2xl">
              {product?.name || "Product View"}
            </h3>
            <p className="mt-0.5 truncate text-sm text-[#a3948b] sm:text-base">{productId}</p>
          </div>

          <div className="grid grid-cols-[1fr_1fr_44px] gap-2 sm:flex sm:items-center">
            {product && (
              <>
                <button
                  type="button"
                  onClick={() => setEditMode((value) => !value)}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8ccc2] bg-white px-3 py-2.5 text-sm font-medium text-[#5f5149] hover:bg-[#f8f5f2] hover:text-[#3b302a] sm:px-5 sm:text-base"
                >
                  <Edit2 size={18} />
                  {editMode ? "Cancel Edit" : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60 sm:px-5 sm:text-base"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[#6b5e55] hover:bg-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {loading && (
          <div className="p-12 flex items-center justify-center gap-3 text-base text-[#6b5e55]">
            <Loader2 size={22} className="animate-spin" />
            Loading product...
          </div>
        )}

        {error && (
          <div className="m-6 bg-rose-50 border border-rose-100 text-rose-700 px-5 py-4 text-base rounded-xl">
            {error}
          </div>
        )}

        {product && draft && (
          <div className="space-y-6 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr] lg:gap-6">
              <div className="space-y-3">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full max-h-[420px] aspect-square object-cover bg-[#f8f5f2] border border-[#e5ddd5]"
                />
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-4">
                  {images.map((image) => (
                    <img
                      key={image.publicId || image.url}
                      src={image.url}
                      alt={product.name}
                      className="w-full aspect-square object-cover border border-[#e5ddd5]"
                    />
                  ))}
                </div>
              </div>

              {editMode ? (
                <EditForm
                  draft={draft}
                  collections={collections}
                  sizeChartUpload={sizeChartUpload}
                  onSizeChartUpload={handleSizeChartUpload}
                  updateDraft={updateDraft}
                />
              ) : (
                <ProductSummary product={product} totalStock={totalStock} />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-sm font-bold text-[#a3948b] uppercase tracking-widest">
                  Colors And Size Quantity
                </h4>
                {editMode && (
                  <button
                    type="button"
                    onClick={addColor}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8d7667] px-4 py-2.5 text-base font-medium text-white shadow-sm hover:bg-[#735f53]"
                  >
                    <Plus size={18} />
                    Add Color
                  </button>
                )}
              </div>

              {(editMode ? draft.colors : product.colors || []).map((color, colorIndex) => (
                <div key={`${color.colorName}-${colorIndex}`} className="overflow-hidden border border-[#e5ddd5]">
                  <div className="flex flex-col gap-3 border-b border-[#e5ddd5] bg-[#fcfaf7] px-4 py-3 sm:flex-row sm:items-center">
                    <span
                      className="h-6 w-6 shrink-0 border border-[#d7ccc3]"
                      style={{ backgroundColor: color.colorCode || "#ffffff" }}
                    />
                    {editMode ? (
                      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-[1fr_120px_auto]">
                        <input
                          value={color.colorName}
                          onChange={(event) =>
                            updateColor(colorIndex, "colorName", event.target.value)
                          }
                          className="px-3 py-2 rounded-lg border border-[#e5ddd5] text-sm focus:ring-1 focus:ring-[#c2b2a6] outline-none"
                          placeholder="Color name"
                        />
                        <input
                          type="color"
                          value={color.colorCode || "#ffffff"}
                          onChange={(event) =>
                            updateColor(colorIndex, "colorCode", event.target.value)
                          }
                          className="h-10 rounded-lg border border-[#e5ddd5]"
                        />
                        <button
                          type="button"
                          onClick={() => removeColor(colorIndex)}
                          disabled={draft.colors.length === 1}
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-rose-100 text-rose-600 text-xs hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-[#3b302a]">{color.colorName}</p>
                        <p className="text-xs text-[#a3948b]">{color.colorCode || "No color code"}</p>
                      </div>
                    )}
                  </div>
                  {editMode && (
                    <div className="px-4 py-4 border-b border-[#e5ddd5]">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="text-xs font-bold text-[#a3948b] uppercase tracking-widest">
                          Color Images
                        </p>
                        <label
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#3b302a] hover:underline cursor-pointer"
                        >
                          <Plus size={13} />
                          Upload Image
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(event) => {
                              addColorImageFile(colorIndex, event.target.files?.[0]);
                              event.target.value = "";
                            }}
                          />
                        </label>
                      </div>

                      {uniqueImages.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2">
                          {uniqueImages.map((image) => {
                            const selected = color.images.some(
                              (item) => item.url === image.url,
                            );

                            return (
                              <button
                                key={image.url}
                                type="button"
                                onClick={() => toggleColorImage(colorIndex, image)}
                                className={`relative rounded-lg overflow-hidden border-2 ${selected ? "border-[#8d7667]" : "border-[#e5ddd5]"}`}
                              >
                                <img
                                  src={image.url}
                                  alt="Product"
                                  className="w-full aspect-square object-cover"
                                />
                                {selected && (
                                  <span className="absolute left-1 top-1 rounded-md bg-[#8d7667] text-white text-[10px] px-1.5 py-0.5">
                                    Linked
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-[#8c7d73]">
                          No existing images found. Upload an image for this color.
                        </p>
                      )}

                      {color.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {color.images.map((image) => (
                            <button
                              key={image.url}
                              type="button"
                              onClick={() => toggleColorImage(colorIndex, image)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#e5ddd5] px-2 py-1 text-xs text-[#6b5e55] hover:bg-rose-50 hover:text-rose-600"
                            >
                              <X size={12} />
                              Remove linked image
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {(color.sizes || []).map((item, sizeIndex) => (
                      <div key={`${item.size}-${sizeIndex}`} className="border border-[#e5ddd5] px-3 py-2">
                        {editMode ? (
                          <div className="space-y-2">
                            <input
                              value={item.size}
                              onChange={(event) =>
                                updateSize(colorIndex, sizeIndex, "size", event.target.value)
                              }
                              className="w-full rounded-md text-xs uppercase font-bold border border-[#e5ddd5] px-2 py-1 focus:ring-1 focus:ring-[#c2b2a6] outline-none"
                            />
                            <input
                              type="number"
                              min="0"
                              value={item.stock}
                              onChange={(event) =>
                                updateSize(colorIndex, sizeIndex, "stock", event.target.value)
                              }
                              className="w-full rounded-md text-lg font-semibold border border-[#e5ddd5] px-2 py-1 focus:ring-1 focus:ring-[#c2b2a6] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeSize(colorIndex, sizeIndex)}
                              disabled={color.sizes.length === 1}
                              className="w-full rounded-md text-xs text-rose-600 border border-rose-100 px-2 py-1 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs text-[#a3948b] uppercase font-bold">{item.size}</p>
                            <p className="text-lg font-semibold text-[#3b302a]">{item.stock}</p>
                          </>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => addSize(colorIndex)}
                        className="min-h-[84px] rounded-xl border border-dashed border-[#c2b2a6] text-[#6b5e55] text-xs uppercase tracking-wider hover:bg-[#fcfaf7]"
                      >
                        + Add Size
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {editMode && (
              <div className="sticky bottom-0 flex justify-end border-t border-[#e5ddd5] bg-white px-0 py-4 sm:px-2 sm:py-5">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8d7667] px-7 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[#735f53] disabled:opacity-60 sm:w-auto"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
        </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete product?"
        message={`This will remove ${product?.name || "this product"} from the active catalog. This action cannot be undone.`}
        confirmLabel="Delete Product"
        type="delete"
        loading={saving}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

const EditForm = ({ draft, collections, sizeChartUpload, onSizeChartUpload, updateDraft }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Name" value={draft.name} onChange={(value) => updateDraft("name", value)} />
      <CollectionSelect
        collections={collections}
        value={draft.setName || draft.collection}
        onChange={(value) => {
          const selected = collections.find((collection) => collection.name === value);
          updateDraft("setName", selected ? selected.name : "");
          updateDraft("collection", selected ? selected.name : "");
        }}
      />
      <Field label="Price" type="number" value={draft.price} onChange={(value) => updateDraft("price", value)} />
    </div>
    <Area label="Description" value={draft.description} onChange={(value) => updateDraft("description", value)} />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Area label="Fabric" value={draft.fabric} onChange={(value) => updateDraft("fabric", value)} />
      <Area label="Design" value={draft.design} onChange={(value) => updateDraft("design", value)} />
      <Area label="Product Care" value={draft.productCare} onChange={(value) => updateDraft("productCare", value)} />
    </div>
    <div>
      <span className="block text-xs text-[#a3948b] uppercase tracking-widest font-bold mb-1">
        Size Chart Image
      </span>
      <label className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-[#c2b2a6] px-3 py-2 cursor-pointer hover:bg-[#fcfaf7]">
        <span className="text-sm text-[#6b5e55]">
          {sizeChartUpload ? sizeChartUpload.file.name : "Upload replacement size chart"}
        </span>
        <Plus size={15} />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            onSizeChartUpload(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>
      {(sizeChartUpload?.preview || draft.sizeChartImage) && (
        <img
          src={sizeChartUpload?.preview || draft.sizeChartImage}
          alt="Size chart"
          className="mt-3 w-32 aspect-square object-cover rounded-xl border border-[#e5ddd5]"
        />
      )}
    </div>
    <div className="flex flex-wrap gap-6">
      <CheckField label="Best Seller" checked={draft.isFeatured} onChange={(value) => updateDraft("isFeatured", value)} />
      <CheckField label="New Arrival" checked={draft.isNewArrival} onChange={(value) => updateDraft("isNewArrival", value)} />
      <CheckField label="Sold Out" checked={draft.isSoldOut} onChange={(value) => updateDraft("isSoldOut", value)} />
    </div>
  </div>
);

const CollectionSelect = ({ collections, value, onChange }) => (
  <label className="block">
    <span className="block text-sm text-[#a3948b] uppercase tracking-widest font-bold mb-2">
      Collection
    </span>
    <select
      required
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-[#e5ddd5] bg-white px-4 py-3 text-base outline-none focus:ring-1 focus:ring-[#c2b2a6]"
    >
      <option value="">Select a collection</option>
      {collections.map((collection) => (
        <option key={collection._id} value={collection.name}>
          {collection.name}
        </option>
      ))}
    </select>
  </label>
);

const ProductSummary = ({ product, totalStock }) => (
  <div className="space-y-4">
    <div>
      <p className="text-xs text-[#a3948b] uppercase tracking-widest font-bold">
        {product.collection} / {product.setName}
      </p>
      <h2 className="text-3xl font-semibold text-[#3b302a] mt-1">{product.name}</h2>
      <p className="text-2xl font-bold text-[#3b302a] mt-2">
        LKR {Number(product.price || 0).toLocaleString()}
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <DetailTile label="Total Stock" value={totalStock} />
      <DetailTile label="Colors" value={product.colors?.length || 0} />
      <DetailTile label="Best Seller" value={product.isFeatured ? "Yes" : "No"} />
      <DetailTile label="New Arrival" value={product.isNewArrival ? "Yes" : "No"} />
    </div>

    <DetailBlock label="Description" value={product.description || "No description"} />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <DetailBlock label="Fabric" value={product.fabric} />
      <DetailBlock label="Design" value={product.design} />
      <DetailBlock label="Product Care" value={product.productCare} />
    </div>
  </div>
);

const Field = ({ label, type = "text", value, onChange }) => (
  <label className="block">
    <span className="block text-sm text-[#a3948b] uppercase tracking-widest font-bold mb-2">
      {label}
    </span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-[#e5ddd5] px-4 py-3 text-base outline-none focus:ring-1 focus:ring-[#c2b2a6]"
    />
  </label>
);

const Area = ({ label, value, onChange }) => (
  <label className="block">
    <span className="block text-sm text-[#a3948b] uppercase tracking-widest font-bold mb-2">
      {label}
    </span>
    <textarea
      rows={3}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-[#e5ddd5] px-4 py-3 text-base outline-none focus:ring-1 focus:ring-[#c2b2a6] resize-none"
    />
  </label>
);

const CheckField = ({ label, checked, onChange }) => (
  <label className="inline-flex items-center gap-3 text-base text-[#3b302a]">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-5 w-5 accent-[#3b302a]"
    />
    {label}
  </label>
);

const DetailTile = ({ label, value }) => (
  <div className="bg-[#fcfaf7] border border-[#e5ddd5] px-4 py-4 rounded-xl">
    <p className="text-sm text-[#a3948b] uppercase font-bold mb-1">{label}</p>
    <p className="text-xl font-bold text-[#3b302a]">{value}</p>
  </div>
);

const DetailBlock = ({ label, value }) => (
  <div>
    <p className="text-sm text-[#a3948b] uppercase tracking-widest font-bold mb-1">
      {label}
    </p>
    <p className="text-base text-[#4f443d] leading-relaxed">{value || "N/A"}</p>
  </div>
);

export default ProductViewModal;
