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
      <label className="mb-2 block text-xs font-semibold normal-case tracking-[0.14em] text-[#5F564D]" style={{ textTransform: "none" }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#E8E2DC] bg-white px-4 py-3 text-sm text-[#2C2B28] outline-none transition placeholder:text-[#9A8F86] focus:border-[#BDAF9F] focus:ring-4 focus:ring-[#EAE0D6]/60"
      />
    </div>
  );
}
