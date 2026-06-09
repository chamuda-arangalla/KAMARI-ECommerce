export default function AuthTextField({
  label,
  name,
  type,
  value,
  onChange,
  autoComplete,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[#a3948b]">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-[#e5ddd5] bg-white px-4 py-3 text-base text-[#3b302a] outline-none focus:ring-1 focus:ring-[#c2b2a6]"
      />
    </div>
  );
}
