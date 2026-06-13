const logoTone = {
  dark: "",
  light: "brightness-0 invert",
};

export default function BrandLogo({
  className = "",
  imageClassName = "",
  tone = "dark",
}) {
  return (
    <img
      src="/Kamari-logo.png"
      alt="KAMARI"
      style={{ clipPath: "inset(0 2px 0 0)" }}
      className={`${logoTone[tone] || logoTone.dark} ${className} ${imageClassName}`.trim()}
    />
  );
}
