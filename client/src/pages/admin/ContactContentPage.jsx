import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { getSiteContent, updateSiteContent } from "../../services/siteContentApi";

const token = () => localStorage.getItem("adminToken");

export default function ContactContentPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    getSiteContent("contact")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load contact content"))
      .finally(() => setLoading(false));
  }, []);

  const set = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      await updateSiteContent("contact", data, token());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateList = (field, index, value) => {
    const arr = [...(data[field] || [])];
    arr[index] = value;
    set(field, arr);
  };

  const removeFromList = (field, index) =>
    set(field, (data[field] || []).filter((_, i) => i !== index));

  const addToList = (field, empty = "") =>
    set(field, [...(data[field] || []), empty]);

  if (loading) return <div className="flex justify-center py-24 text-[#a3948b] text-base">Loading...</div>;

  return (
    <div className="space-y-8 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#3b302a]">Contact Page</h1>
          <p className="text-base text-[#a3948b] mt-2">Edit the content shown on the Contact page</p>
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
      </Section>

      {/* Contact Details */}
      <Section title="Contact Details">
        <ListEditor label="Address Lines" items={data.address || []} onAdd={() => addToList("address")} onRemove={(i) => removeFromList("address", i)} onChange={(i, v) => updateList("address", i, v)} />
        <ListEditor label="Phone Numbers" items={data.phones  || []} onAdd={() => addToList("phones")}  onRemove={(i) => removeFromList("phones", i)}  onChange={(i, v) => updateList("phones", i, v)} />
        <ListEditor label="Email Addresses" items={data.emails || []} onAdd={() => addToList("emails")} onRemove={(i) => removeFromList("emails", i)} onChange={(i, v) => updateList("emails", i, v)} />
        <ListEditor label="Working Hours"  items={data.workingHours || []} onAdd={() => addToList("workingHours")} onRemove={(i) => removeFromList("workingHours", i)} onChange={(i, v) => updateList("workingHours", i, v)} />
      </Section>

      {/* Social & Map */}
      <Section title="Social Media & Map">
        <Field label="WhatsApp Number (digits only, e.g. 94771234567)" value={data.whatsappNumber}   onChange={(v) => set("whatsappNumber", v)} />
        <Field label="Instagram Handle (without @)"                     value={data.instagramHandle}  onChange={(v) => set("instagramHandle", v)} />
        <Field label="Facebook Handle (without @)"                      value={data.facebookHandle}   onChange={(v) => set("facebookHandle", v)} />
        <TextArea label="Google Maps Embed URL" value={data.mapEmbedUrl} onChange={(v) => set("mapEmbedUrl", v)} />
      </Section>

      {/* FAQs */}
      <Section title="Frequently Asked Questions">
        {(data.faqs || []).map((faq, i) => (
          <div key={i} className="border border-[#e5ddd5] rounded-xl p-5 space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#3b302a]">FAQ {i + 1}</span>
              <button onClick={() => removeFromList("faqs", i)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
            </div>
            <Field
              label="Question"
              value={faq.question}
              onChange={(v) => { const arr = [...(data.faqs || [])]; arr[i] = { ...faq, question: v }; set("faqs", arr); }}
            />
            <TextArea
              label="Answer"
              value={faq.answer}
              onChange={(v) => { const arr = [...(data.faqs || [])]; arr[i] = { ...faq, answer: v }; set("faqs", arr); }}
            />
          </div>
        ))}
        <button
          onClick={() => set("faqs", [...(data.faqs || []), { question: "", answer: "" }])}
          className="flex items-center gap-2 text-sm text-[#3b302a] border border-dashed border-[#3b302a] rounded-xl px-4 py-2 hover:bg-[#f8f5f2] transition"
        >
          <Plus size={16} /> Add FAQ
        </button>
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

const ListEditor = ({ label, items, onAdd, onRemove, onChange }) => (
  <div>
    <Label>{label}</Label>
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input value={item} onChange={(e) => onChange(i, e.target.value)} className="flex-1 border border-[#e5ddd5] rounded-xl px-4 py-3 text-base outline-none focus:border-[#3b302a] transition" />
          <button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>
        </div>
      ))}
    </div>
    <button onClick={onAdd} className="flex items-center gap-2 mt-2 text-sm text-[#3b302a] border border-dashed border-[#3b302a] rounded-xl px-4 py-2 hover:bg-[#f8f5f2] transition">
      <Plus size={16} /> Add
    </button>
  </div>
);
