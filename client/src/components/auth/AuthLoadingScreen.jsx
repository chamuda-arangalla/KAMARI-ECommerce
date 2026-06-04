export default function AuthLoadingScreen({ message = "Signing you in..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F5F2] font-['Poppins']">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#3b302a] border-t-transparent" />
        <p className="text-sm tracking-wide text-[#a3948b]">{message}</p>
      </div>
    </div>
  );
}
