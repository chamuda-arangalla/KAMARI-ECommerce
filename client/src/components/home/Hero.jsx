import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="h-screen w-full relative flex items-center justify-center bg-[#f8f5f2]">

      {/* Background Image (replace later) */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1"
          alt="hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center"
      >
        <h1 className="text-5xl md:text-6xl font-light tracking-widest mb-4">
          KAMARI
        </h1>

        <p className="text-lg mb-6">
          Glow even in the dark
        </p>

        <button className="px-6 py-3 rounded-full bg-[#e8ded6] hover:bg-[#d6c9bf] transition">
          Shop the Collection
        </button>
      </motion.div>

    </section>
  );
};

export default Hero;