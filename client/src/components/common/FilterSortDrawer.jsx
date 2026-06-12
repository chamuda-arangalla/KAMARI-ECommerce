import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function FilterSortDrawer({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="pg-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            className="pg-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="pg-drawer-header">
              <span className="pg-drawer-title">Filter &amp; Sort</span>
              <button
                type="button"
                className="pg-drawer-close"
                aria-label="Close filters"
                onClick={onClose}
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
