import { motion } from "framer-motion";
import { categories, products, moodImages } from "../data/homeData";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

const Home = () => {
  return (
    <main className="bg-[#F8F5F2] text-[#3B302A]">
      {/* Hero */}
      <section className="relative h-screen min-h-[620px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1602810317536-5d5e8a552d95?auto=format&fit=crop&w=1800&q=90"
          alt="KAMARI hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3B302A]/10" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
          className="absolute left-[8%] top-1/2 -translate-y-1/2"
        >
          <h2 className="mb-4 text-5xl font-light tracking-[0.22em] md:text-7xl">
            KAMARI
          </h2>
          <p className="mb-7 text-sm tracking-[0.12em]">
            Glow even in the dark.
          </p>
          <button className="rounded-full bg-[#E8DED6] px-8 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-[#d8c9bd]">
            Shop the Collection
          </button>
        </motion.div>
      </section>

      {/* New Collection */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-10 md:grid-cols-2">
        <img
          src="https://www.freepik.com/free-photos-vectors/short-night-dress"
          alt="New collection"
          className="h-[420px] w-full object-cover"
        />

        <div className="flex items-center justify-center bg-[#F8F5F2] px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[#7D746C]">
              New Collection
            </p>
            <h3 className="mb-4 text-4xl font-light leading-tight">
              Introducing <br /> The Flow Collection
            </h3>
            <p className="mb-6 max-w-sm text-sm leading-7 text-[#6E625C]">
              Softness that lingers beyond the night.
            </p>
            <button className="rounded-full bg-[#E8DED6] px-7 py-3 text-[11px] uppercase tracking-[0.16em] transition hover:bg-[#d8c9bd]">
              Explore Collection
            </button>
          </motion.div>
        </div>
      </section>

      {/* Shop by Set */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <h3 className="mb-7 text-center text-[12px] uppercase tracking-[0.24em]">
          Shop by Set
        </h3>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {categories.map((item) => (
            <div key={item.id} className="group relative h-[260px] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#3B302A]/25" />
              <h4 className="absolute bottom-6 left-0 w-full text-center text-sm font-light tracking-[0.22em] text-white">
                {item.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-7 flex items-center justify-between">
          <h3 className="text-[12px] uppercase tracking-[0.24em]">
            Best Sellers
          </h3>
          <button className="text-[11px] uppercase tracking-[0.18em]">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative mb-4 h-[330px] overflow-hidden bg-[#E8DED6]">
                {product.tag && (
                  <span className="absolute left-3 top-3 z-10 bg-[#F8F5F2] px-3 py-1 text-[9px] uppercase tracking-[0.16em]">
                    {product.tag}
                  </span>
                )}

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <h4 className="mb-1 text-sm">{product.name}</h4>
              <p className="text-xs text-[#7D746C]">{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 px-6 py-10 md:grid-cols-2">
        <div className="flex min-h-[360px] items-center justify-center bg-[#EFE7DF] px-8 text-center">
          <div>
            <h3 className="mb-5 text-3xl font-light italic">
              More than just sleepwear, <br /> it’s a feeling.
            </h3>
            <p className="mx-auto mb-7 max-w-md text-sm leading-7 text-[#6E625C]">
              At Kamari, we create pieces that embrace your softest moments and
              empower your everyday calm. Made for comfort, designed for you.
            </p>
            <button className="rounded-full border border-[#3B302A]/30 px-7 py-3 text-[11px] uppercase tracking-[0.16em] transition hover:bg-[#3B302A] hover:text-[#F8F5F2]">
              Discover KAMARI
            </button>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1600421684555-707fae8df4fd?auto=format&fit=crop&w=1000&q=85"
          alt="Brand story"
          className="h-[360px] w-full object-cover"
        />
      </section>

      {/* Mood Strip */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <h3 className="mb-5 text-center text-[11px] uppercase tracking-[0.22em]">
          @KAMARISLEEPWEAR
        </h3>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {moodImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Kamari mood"
              className="h-[180px] w-full object-cover"
            />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-5 bg-[#E8DED6] px-8 py-8 md:flex-row">
          <div>
            <h3 className="mb-2 text-lg font-light">Stay close to KAMARI</h3>
            <p className="text-sm text-[#6E625C]">
              Be the first to know about new drops, exclusive offers, and more.
            </p>
          </div>

          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-[#F8F5F2] px-5 py-3 text-sm outline-none"
            />
            <button className="bg-[#3B302A] px-8 py-3 text-xs uppercase tracking-[0.16em] text-[#F8F5F2]">
              Join
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 border-t border-[#3B302A]/10 pt-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-4 text-2xl font-light tracking-[0.22em]">KAMARI</h2>
            <p className="text-xs text-[#7D746C]">© 2026 KAMARI. All rights reserved.</p>
          </div>

          <FooterColumn title="Shop" items={["All Products", "Collections"]} />
          <FooterColumn title="Info" items={["About", "Contact"]} />
          <FooterColumn title="Help" items={["Size Guide", "Shipping", "Returns"]} />
          <FooterColumn title="Customer Care" items={["FAQ", "Track Your Order", "Privacy Policy"]} />
        </div>
      </footer>
    </main>
  );
};

const FooterColumn = ({ title, items }) => {
  return (
    <div>
      <h4 className="mb-4 text-[11px] uppercase tracking-[0.2em]">{title}</h4>
      <ul className="space-y-3 text-sm text-[#6E625C]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;