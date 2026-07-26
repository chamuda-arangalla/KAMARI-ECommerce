export default function AuthTextField({
  label,
  name,
  type,
  value,
  onChange,
  autoComplete,
  ...inputProps
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[#8f8376]">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        autoComplete={autoComplete}
        {...inputProps}
        className="w-full rounded-xl border border-[#d7c9b8] bg-white px-4 py-3 text-base text-[#2c2b28] outline-none focus:ring-1 focus:ring-[#c2b2a6]"
      />
    </div>
  );
}
