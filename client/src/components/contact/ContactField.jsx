export default function ContactField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#7D746C]">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#e5ddd5] bg-[#F8F5F2] px-4 py-3 text-sm text-[#3B302A] outline-none transition focus:border-[#3B302A]"
      />
    </div>
  );
}
