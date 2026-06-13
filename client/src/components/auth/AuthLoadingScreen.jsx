export default function AuthLoadingScreen({ message = "Signing you in..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EAE0D6] font-['Poppins']">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#2c2b28] border-t-transparent" />
        <p className="text-sm tracking-wide text-[#8f8376]">{message}</p>
      </div>
    </div>
  );
}
