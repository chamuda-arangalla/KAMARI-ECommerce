import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Loader2, Save, Upload } from "lucide-react";
import { categories as defaultCategories, moodImages as defaultMoodImages } from "../../data/homeData";
import { getHomeContent, updateHomeContent } from "../../services/homeContentApi";

const defaultContent = {
  heroImage: {
    url: "https://images.unsplash.com/photo-1602810317536-5d5e8a552d95?auto=format&fit=crop&w=1800&q=90",
    publicId: "",
  },
  collectionImage: {
    url: defaultCategories[0].image,
    publicId: "",
  },
  brandStoryImage: {
    url: "https://images.unsplash.com/photo-1600421684555-707fae8df4fd?auto=format&fit=crop&w=1000&q=85",
    publicId: "",
  },
  categories: defaultCategories.map((item) => ({
    ...item,
    image: { url: item.image, publicId: "" },
  })),
  moodImages: defaultMoodImages.map((url) => ({ url, publicId: "" })),
};

const HomeImagesPage = () => {
  const [content, setContent] = useState(defaultContent);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const previews = useMemo(() => {
    const next = {};

    Object.entries(files).forEach(([key, file]) => {
      if (file) next[key] = URL.createObjectURL(file);
    });

    return next;
  }, [files]);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getHomeContent();
        setContent(normalizeContent(response.data));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load home images");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const updateImageUrl = (field, url) => {
    setContent((prev) => ({
      ...prev,
      [field]: { ...(prev[field] || {}), url },
    }));
  };

  const updateCategory = (index, updates) => {
    setContent((prev) => ({
      ...prev,
      categories: prev.categories.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item,
      ),
    }));
  };

  const updateCategoryImageUrl = (index, url) => {
    setContent((prev) => ({
      ...prev,
      categories: prev.categories.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, image: { ...(item.image || {}), url } }
          : item,
      ),
    }));
  };

  const updateMoodImageUrl = (index, url) => {
    setContent((prev) => ({
      ...prev,
      moodImages: prev.moodImages.map((item, itemIndex) =>
        itemIndex === index ? { ...(item || {}), url } : item,
      ),
    }));
  };

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({ ...prev, [field]: file || null }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      formData.append("heroImageUrl", content.heroImage?.url || "");
      formData.append("collectionImageUrl", content.collectionImage?.url || "");
      formData.append("brandStoryImageUrl", content.brandStoryImage?.url || "");
      formData.append("categories", JSON.stringify(content.categories));
      formData.append("moodImages", JSON.stringify(content.moodImages));

      Object.entries(files).forEach(([field, file]) => {
        if (file) formData.append(field, file);
      });

      const response = await updateHomeContent(formData, token);
      setContent(normalizeContent(response.data));
      setFiles({});
      setMessage("Home images updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update home images");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#6b5e55]">
        <Loader2 className="animate-spin" size={18} />
        Loading home images...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-[#3b302a]">Home Images</h2>
          <p className="mt-1 text-[#a3948b]">Update the images shown on the storefront home page</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-[#3b302a] px-6 py-3 text-white transition hover:bg-[#2a221d] disabled:opacity-60"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className="border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}
      {error && (
        <div className="border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ImageField
          title="Hero Image"
          field="heroImage"
          image={content.heroImage}
          preview={previews.heroImage}
          onUrlChange={(url) => updateImageUrl("heroImage", url)}
          onFileChange={handleFileChange}
        />
        <ImageField
          title="New Collection Image"
          field="collectionImage"
          image={content.collectionImage}
          preview={previews.collectionImage}
          onUrlChange={(url) => updateImageUrl("collectionImage", url)}
          onFileChange={handleFileChange}
        />
        <ImageField
          title="Brand Story Image"
          field="brandStoryImage"
          image={content.brandStoryImage}
          preview={previews.brandStoryImage}
          onUrlChange={(url) => updateImageUrl("brandStoryImage", url)}
          onFileChange={handleFileChange}
        />
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-[#3b302a]">Shop By Set</h3>
          <p className="text-sm text-[#a3948b]">These four cards are displayed below the new collection section.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {content.categories.map((category, index) => (
            <div key={category.id || index} className="border border-[#e5ddd5] bg-white">
              <ImageField
                title={`Category ${index + 1}`}
                field={`categoryImage${index}`}
                image={category.image}
                preview={previews[`categoryImage${index}`]}
                onUrlChange={(url) => updateCategoryImageUrl(index, url)}
                onFileChange={handleFileChange}
              />
              <div className="border-t border-[#e5ddd5] p-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#a3948b]">
                  Label
                </label>
                <input
                  type="text"
                  value={category.name}
                  onChange={(event) => updateCategory(index, { name: event.target.value })}
                  className="w-full border border-[#e5ddd5] bg-[#fcfaf7] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#c2b2a6]"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-[#3b302a]">Mood Strip</h3>
          <p className="text-sm text-[#a3948b]">Five images for the @KAMARISLEEPWEAR strip.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 xl:grid-cols-5">
          {content.moodImages.map((image, index) => (
            <ImageField
              key={index}
              title={`Mood ${index + 1}`}
              field={`moodImage${index}`}
              image={image}
              preview={previews[`moodImage${index}`]}
              onUrlChange={(url) => updateMoodImageUrl(index, url)}
              onFileChange={handleFileChange}
            />
          ))}
        </div>
      </section>
    </form>
  );
};

const ImageField = ({ title, field, image, preview, onUrlChange, onFileChange }) => {
  const src = preview || image?.url || "";

  return (
    <div className="border border-[#e5ddd5] bg-white">
      <div className="aspect-[4/3] bg-[#f8f5f2]">
        {src ? (
          <img src={src} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[#a3948b]">
            <ImagePlus size={28} />
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <h4 className="text-sm font-semibold text-[#3b302a]">{title}</h4>
        <input
          type="url"
          value={image?.url || ""}
          onChange={(event) => onUrlChange(event.target.value)}
          className="w-full border border-[#e5ddd5] bg-[#fcfaf7] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#c2b2a6]"
          placeholder="https://..."
        />
        <label className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-[#c2b2a6] px-3 py-2 text-sm text-[#6b5e55] transition hover:bg-[#f8f5f2]">
          <Upload size={16} />
          Upload Image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => onFileChange(field, event.target.files?.[0])}
          />
        </label>
      </div>
    </div>
  );
};

const normalizeContent = (data = {}) => ({
  ...defaultContent,
  ...data,
  heroImage: data.heroImage || defaultContent.heroImage,
  collectionImage: data.collectionImage || defaultContent.collectionImage,
  brandStoryImage: data.brandStoryImage || defaultContent.brandStoryImage,
  categories: (data.categories?.length ? data.categories : defaultContent.categories).map((item, index) => ({
    id: item.id || index + 1,
    name: item.name || defaultContent.categories[index]?.name || `Category ${index + 1}`,
    image:
      typeof item.image === "string"
        ? { url: item.image, publicId: "" }
        : item.image || defaultContent.categories[index]?.image,
  })),
  moodImages: (data.moodImages?.length ? data.moodImages : defaultContent.moodImages).map((item, index) =>
    typeof item === "string"
      ? { url: item, publicId: "" }
      : item || defaultContent.moodImages[index],
  ),
});

export default HomeImagesPage;
