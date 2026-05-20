import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadContentImage } from "../../services/siteContentApi";

const token = () => localStorage.getItem("adminToken");

export default function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const inputRef                  = useRef(null);

  const [uploaded, setUploaded] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      setUploaded(false);
      const res = await uploadContentImage(file, token());
      onChange(res.url);
      setUploaded(true);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      {label && (
        <p className="text-sm font-semibold text-[#a3948b] uppercase tracking-wider mb-2">{label}</p>
      )}

      {value ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-[#e5ddd5]" style={{ maxHeight: 220 }}>
          <img src={value} alt="preview" className="w-full object-cover" style={{ maxHeight: 220 }} />
          <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-[#3b302a] text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-[#f8f5f2] transition"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? "Uploading..." : "Change"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-white text-red-500 p-2 rounded-lg shadow hover:bg-red-50 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 border-2 border-dashed border-[#e5ddd5] rounded-xl flex flex-col items-center justify-center gap-2 text-[#a3948b] hover:border-[#3b302a] hover:text-[#3b302a] transition disabled:opacity-50"
        >
          {uploading
            ? <><Loader2 size={28} className="animate-spin" /><span className="text-sm">Uploading...</span></>
            : <><Upload size={28} /><span className="text-sm font-medium">Click to upload image</span><span className="text-xs">JPG, PNG or WEBP · Max 5 MB</span></>
          }
        </button>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {uploaded && (
        <p className="text-amber-600 text-sm mt-2 font-medium">
          ⚠ Image uploaded — click <strong>Save Changes</strong> to apply it to the page.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
