export default function SocialAuthLink({ href, icon, children }) {
  return (
    <a
      href={href}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#d7c9b8] bg-white py-3 text-sm font-medium text-[#2c2b28] transition hover:bg-[#eae0d6]"
    >
      {icon}
      {children}
    </a>
  );
}
