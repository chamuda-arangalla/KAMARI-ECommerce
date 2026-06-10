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
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5F564D]">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#d7c9b8] bg-[#EAE0D6] px-4 py-3 text-sm text-[#2C2B28] outline-none transition focus:border-[#2C2B28]"
      />
    </div>
  );
}
