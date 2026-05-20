import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { getSiteContent, updateSiteContent } from "../../services/siteContentApi";
import ImageUploadField from "../../components/admin/ImageUploadField";

const token = () => localStorage.getItem("adminToken");

const EMPTY_VALUE = { title: "", description: "" };
const EMPTY_STAT  = { number: "", label: "" };
const EMPTY_PARA  = "";

export default function AboutContentPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    getSiteContent("about")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load about content"))
      .finally(() => setLoading(false));
  }, []);

  const set = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      await updateSiteContent("about", data, token());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24 text-[#a3948b] text-base">Loading...</div>;

  return (
    <div className="space-y-8 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#3b302a]">About Page</h1>
          <p className="text-base text-[#a3948b] mt-2">Edit the content shown on the About page</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#3b302a] text-white px-6 py-3 rounded-xl text-base font-semibold hover:bg-[#2e2622] disabled:opacity-50 transition"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saved ? "Saved ✓" : saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && <p className="text-red-500 text-base bg-red-50 border border-red-100 rounded-xl px-5 py-4">{error}</p>}

      {/* Hero */}
      <Section title="Hero Section">
        <Field label="Hero Title"    value={data.heroTitle}    onChange={(v) => set("heroTitle", v)} />
        <Field label="Hero Subtitle" value={data.heroSubtitle} onChange={(v) => set("heroSubtitle", v)} />
        <ImageUploadField label="Hero Image" value={data.heroImage} onChange={(v) => set("heroImage", v)} />
      </Section>

      {/* Brand Story */}
      <Section title="Brand Story Section">
        <Field label="Story Title" value={data.storyTitle} onChange={(v) => set("storyTitle", v)} />
        <ImageUploadField label="Story Image" value={data.storyImage} onChange={(v) => set("storyImage", v)} />
        <div>
          <Label>Story Paragraphs</Label>
          {(data.storyParagraphs || []).map((para, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <textarea
                value={para}
                rows={2}
                onChange={(e) => {
                  const arr = [...(data.storyParagraphs || [])];
                  arr[i] = e.target.value;
                  set("storyParagraphs", arr);
                }}
                className="flex-1 border border-[#e5ddd5] rounded-xl px-4 py-3 text-base outline-none focus:border-[#3b302a] resize-none"
              />
              <button onClick={() => set("storyParagraphs", (data.storyParagraphs || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button onClick={() => set("storyParagraphs", [...(data.storyParagraphs || []), EMPTY_PARA])} className="flex items-center gap-2 text-sm text-[#3b302a] border border-dashed border-[#3b302a] rounded-xl px-4 py-2 hover:bg-[#f8f5f2] transition">
            <Plus size={16} /> Add Paragraph
          </button>
        </div>
      </Section>

      {/* Values */}
      <Section title="Our Values">
        {(data.values || []).map((v, i) => (
          <div key={i} className="border border-[#e5ddd5] rounded-xl p-5 space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#3b302a]">Value {i + 1}</span>
              <button onClick={() => set("values", (data.values || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
            </div>
            <Field label="Title" value={v.title} onChange={(val) => { const arr = [...(data.values || [])]; arr[i] = { ...v, title: val }; set("values", arr); }} />
            <TextArea label="Description" value={v.description} onChange={(val) => { const arr = [...(data.values || [])]; arr[i] = { ...v, description: val }; set("values", arr); }} />
          </div>
        ))}
        <AddBtn onClick={() => set("values", [...(data.values || []), { ...EMPTY_VALUE }])} label="Add Value" />
      </Section>

      {/* Stats */}
      <Section title="Stats (Dark Strip)">
        <div className="grid grid-cols-2 gap-4">
          {(data.stats || []).map((s, i) => (
            <div key={i} className="border border-[#e5ddd5] rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Stat {i + 1}</span>
                <button onClick={() => set("stats", (data.stats || []).filter((_, j) => j !== i))} className="text-red-400"><Trash2 size={16} /></button>
              </div>
              <Field label="Number" value={s.number} onChange={(val) => { const arr = [...(data.stats || [])]; arr[i] = { ...s, number: val }; set("stats", arr); }} />
              <Field label="Label"  value={s.label}  onChange={(val) => { const arr = [...(data.stats || [])]; arr[i] = { ...s, label: val };  set("stats", arr); }} />
            </div>
          ))}
        </div>
        <AddBtn onClick={() => set("stats", [...(data.stats || []), { ...EMPTY_STAT }])} label="Add Stat" />
      </Section>


      {/* CTA */}
      <Section title="CTA Section">
        <Field label="CTA Title"    value={data.ctaTitle}    onChange={(v) => set("ctaTitle", v)} />
        <TextArea label="CTA Subtitle" value={data.ctaSubtitle} onChange={(v) => set("ctaSubtitle", v)} />
      </Section>

    </div>
  );
}

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-[#e5ddd5] p-8 space-y-5">
    <h2 className="text-xl font-bold text-[#3b302a] border-b border-[#f0ebe5] pb-4">{title}</h2>
    {children}
  </div>
);

const Label = ({ children }) => <p className="text-sm font-semibold text-[#a3948b] uppercase tracking-wider mb-2">{children}</p>;

const Field = ({ label, value, onChange }) => (
  <div>
    <Label>{label}</Label>
    <input value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full border border-[#e5ddd5] rounded-xl px-4 py-3 text-base outline-none focus:border-[#3b302a] transition" />
  </div>
);

const TextArea = ({ label, value, onChange }) => (
  <div>
    <Label>{label}</Label>
    <textarea value={value || ""} rows={3} onChange={(e) => onChange(e.target.value)} className="w-full border border-[#e5ddd5] rounded-xl px-4 py-3 text-base outline-none focus:border-[#3b302a] transition resize-none" />
  </div>
);

const AddBtn = ({ onClick, label }) => (
  <button onClick={onClick} className="flex items-center gap-2 text-sm text-[#3b302a] border border-dashed border-[#3b302a] rounded-xl px-4 py-2 hover:bg-[#f8f5f2] transition mt-2">
    <Plus size={16} /> {label}
  </button>
);
