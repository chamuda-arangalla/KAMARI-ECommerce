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
      className={`${logoTone[tone] || logoTone.dark} ${className} ${imageClassName}`.trim()}
    />
  );
}
