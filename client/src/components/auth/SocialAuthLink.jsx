export default function SocialAuthLink({ href, icon, children }) {
  return (
    <a
      href={href}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e5ddd5] bg-white py-3 text-sm font-medium text-[#3b302a] transition hover:bg-[#f8f5f2]"
    >
      {icon}
      {children}
    </a>
  );
}
