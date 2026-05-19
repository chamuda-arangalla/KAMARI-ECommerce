import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, GripVertical, ImageOff, Upload, X } from "lucide-react";
import {
  getCollectionsAdmin,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../../services/collectionApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const token = () => localStorage.getItem("adminToken");

const EMPTY_FORM = { name: "", subtitle: "", description: "", displayOrder: "" };

export default function CollectionsManagement() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCollectionsAdmin(token());
      setCollections(res.data || []);
    } catch {
      setError("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, displayOrder: collections.length + 1 });
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (col) => {
    setEditing(col);
    setForm({
      name: col.name,
      subtitle: col.subtitle || "",
      description: col.description || "",
      displayOrder: col.displayOrder ?? "",
    });
    setImageFile(null);
    setImagePreview(col.image?.url || "");
    setFormError("");
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError("Collection name is required"); return; }
    try {
      setSaving(true);
      setFormError("");
      const payload = { ...form, displayOrder: Number(form.displayOrder) || 0 };
      if (editing) {
        await updateCollection(editing._id, payload, imageFile, token());
      } else {
        await createCollection(payload, imageFile, token());
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save collection");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (col) => {
    try {
      await updateCollection(col._id, { isActive: !col.isActive }, null, token());
      load();
    } catch { /* silent */ }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCollection(deleteTarget._id, token());
      setDeleteTarget(null);
      load();
    } catch {
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>

      {/* ── Page Header ─────────────────────────────── */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-[#3b302a]">Collections</h1>
          <p className="text-base text-[#a3948b] mt-2">
            Manage the collections shown in the header dropdown and shop filters
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-3 bg-[#3b302a] text-white px-6 py-3 rounded-xl text-base font-semibold hover:bg-[#2e2622] transition"
        >
          <Plus size={20} />
          Add Collection
        </button>
      </div>

      {error && <p className="text-red-500 text-base mb-6">{error}</p>}

      {/* ── Collection List ──────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-24 text-[#a3948b] text-lg">Loading...</div>
      ) : collections.length === 0 ? (
        <div className="text-center py-24 text-[#a3948b]">
          <p className="text-2xl font-medium mb-3">No collections yet</p>
          <p className="text-base">Click "Add Collection" to create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {collections.map((col) => (
            <div
              key={col._id}
              className={`flex items-center gap-5 bg-white rounded-2xl border p-5 transition ${
                col.isActive ? "border-[#e5ddd5]" : "border-dashed border-[#ddd] opacity-60"
              }`}
            >
              {/* Drag handle */}
              <GripVertical size={24} className="text-[#ccc] flex-shrink-0" />

              {/* Thumbnail */}
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#f3ede8]">
                {col.image?.url ? (
                  <img src={col.image.url} alt={col.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                    <ImageOff size={28} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <p className="text-xl font-bold text-[#3b302a] truncate">{col.name}</p>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    col.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {col.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                {col.subtitle && (
                  <p className="text-base text-[#7d746c] truncate">{col.subtitle}</p>
                )}
                {col.description && (
                  <p className="text-sm text-[#a3948b] mt-1 truncate">{col.description}</p>
                )}
                <p className="text-sm text-[#bbb] mt-2">Display order: {col.displayOrder}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggleActive(col)}
                  title={col.isActive ? "Hide collection" : "Show collection"}
                  className="p-3 rounded-xl hover:bg-[#f3ede8] transition"
                >
                  {col.isActive
                    ? <ToggleRight size={28} className="text-green-600" />
                    : <ToggleLeft size={28} className="text-[#bbb]" />}
                </button>
                <button
                  onClick={() => openEdit(col)}
                  className="p-3 rounded-xl hover:bg-[#f3ede8] text-[#7d746c] transition"
                >
                  <Pencil size={22} />
                </button>
                <button
                  onClick={() => setDeleteTarget(col)}
                  className="p-3 rounded-xl hover:bg-red-50 text-red-400 transition"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-[#f0ebe5] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#3b302a]">
                {editing ? "Edit Collection" : "Add Collection"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#a3948b] hover:text-[#3b302a] transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="px-8 py-6 space-y-6">

              {/* Image Upload */}
              <div>
                <label className="block text-base font-semibold text-[#3b302a] mb-3">
                  Collection Image
                </label>
                {imagePreview ? (
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-[#e5ddd5]">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow hover:bg-red-50 transition"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-3 right-3 bg-white text-[#3b302a] text-sm font-semibold px-4 py-2 rounded-xl shadow hover:bg-[#f8f5f2] transition flex items-center gap-2"
                    >
                      <Upload size={15} /> Change Image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-[#e5ddd5] rounded-2xl flex flex-col items-center justify-center gap-3 text-[#a3948b] hover:border-[#3b302a] hover:text-[#3b302a] transition"
                  >
                    <Upload size={32} />
                    <span className="text-base font-semibold">Click to upload image</span>
                    <span className="text-sm">JPG, PNG or WEBP · Max 5 MB</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-base font-semibold text-[#3b302a] mb-2">
                  Collection Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Batik Collection"
                  className="w-full border border-[#e5ddd5] rounded-xl px-4 py-3 text-base outline-none focus:border-[#3b302a] transition"
                />
                <p className="text-sm text-[#a3948b] mt-1.5">
                  Must match the Set Name used when adding products
                </p>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-base font-semibold text-[#3b302a] mb-2">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  placeholder="e.g. Sri Lankan hand-printed batik"
                  className="w-full border border-[#e5ddd5] rounded-xl px-4 py-3 text-base outline-none focus:border-[#3b302a] transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-base font-semibold text-[#3b302a] mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description of this collection..."
                  rows={3}
                  className="w-full border border-[#e5ddd5] rounded-xl px-4 py-3 text-base outline-none focus:border-[#3b302a] transition resize-none"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-base font-semibold text-[#3b302a] mb-2">Display Order</label>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))}
                  placeholder="1"
                  min={0}
                  className="w-36 border border-[#e5ddd5] rounded-xl px-4 py-3 text-base outline-none focus:border-[#3b302a] transition"
                />
                <p className="text-sm text-[#a3948b] mt-1.5">Lower numbers appear first in the header</p>
              </div>

              {formError && (
                <p className="text-red-500 text-base font-medium">{formError}</p>
              )}

              {/* Footer Buttons */}
              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-[#e5ddd5] text-base font-medium text-[#3b302a] hover:bg-[#f8f5f2] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-[#3b302a] text-white text-base font-semibold hover:bg-[#2e2622] disabled:opacity-50 transition"
                >
                  {saving ? "Saving..." : editing ? "Save Changes" : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Collection?"
        message={`"${deleteTarget?.name}" will be permanently removed. Products in this collection will not be deleted.`}
        confirmLabel="Delete"
        type="danger"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
