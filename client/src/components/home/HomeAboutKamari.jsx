import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import aboutHeroImg from "../../assets/images/about-image.png";

const ABOUT_COPY =
  "We design modern women's clothing for the Sri Lankan lifestyle - comfortable, versatile and beautifully made for every occasion.";

function AnimatedLetter({ children, index, progress, total }) {
  const delay = total > 1 ? index / (total - 1) : 0;
  const enterStart = 0.16 + delay * 0.34;
  const enterEnd = enterStart + 0.08;
  const exitStart = 0.64 + delay * 0.22;
  const exitEnd = exitStart + 0.08;
  const color = useTransform(
    progress,
    [enterStart, enterEnd, exitStart, exitEnd],
    ["#2C2B28", "#FFFFFF", "#FFFFFF", "#2C2B28"],
  );

  return (
    <motion.span aria-hidden="true" style={{ color }}>
      {children}
    </motion.span>
  );
}

function AnimatedColorText({ progress, text }) {
  let letterIndex = 0;
  const totalLetters = text.replace(/\s/g, "").length;

  return (
    <span aria-label={text}>
      {text.split(" ").map((word, wordIndex, words) => (
        <span key={`${word}-${wordIndex}`} className="inline-block">
          {Array.from(word).map((letter, charIndex) => {
            const currentIndex = letterIndex;
            letterIndex += 1;

            return (
              <AnimatedLetter
                key={`${word}-${charIndex}`}
                index={currentIndex}
                progress={progress}
                total={totalLetters}
              >
                {letter}
              </AnimatedLetter>
            );
          })}
          {wordIndex < words.length - 1 ? "\u00A0" : null}
        </span>
      ))}
    </span>
  );
}

export default function HomeAboutKamari({ onNavigate }) {
  const wrapperRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const textY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["22vh", "0vh", "-22vh"],
  );

  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0],
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    ["#2C2B28", "#FFFFFF", "#FFFFFF", "#2C2B28"],
  );

  const btnBorderColor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [
      "rgba(44,43,40,0.45)",
      "rgba(255,255,255,0.55)",
      "rgba(255,255,255,0.55)",
      "rgba(44,43,40,0.45)",
    ],
  );

  return (
    <div
      ref={wrapperRef}
      aria-label="About KAMARI"
      className="relative"
      style={{ height: "250vh", zIndex: 1 }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <img
          src={aboutHeroImg}
          alt="KAMARI everyday style, effortlessly Sri Lankan"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#2C2B28]/10 via-transparent to-[#2C2B28]/10" />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            style={{ y: textY, opacity: textOpacity, color: textColor }}
            className="flex flex-col items-center px-6 text-center"
          >
            <motion.p
              style={{ color: textColor }}
              className="mb-3 text-xs uppercase tracking-[0.24em] opacity-70 lg:mr-3"
            >
              About KAMARI
            </motion.p>

            <motion.p
              className="mx-auto mb-8 max-w-2xl text-4xl leading-tight opacity-75 md:text-6xl md:leading-[1.08]"
            >
              <AnimatedColorText progress={scrollYProgress} text={ABOUT_COPY} />
            </motion.p>

            <motion.button
              type="button"
              onClick={() => onNavigate("/about")}
              style={{ borderColor: btnBorderColor, color: textColor }}
            >
              <motion.p
                style={{ color: textColor }}
                className="inline-flex items-center border px-5 py-3 text-xs uppercase tracking-[0.24em] transition-[background,color]"
              > 
                About KAMARI
              </motion.p>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
