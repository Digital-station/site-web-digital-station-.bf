import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { SERVICES } from "../../constants";
import ThemeSwitcher from "../ui/themeswitcher";
import LanguageSwitcher from "../ui/Languageswitcher";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 lg:left-16 z-40 transition-all duration-300 ${isScrolled ? "bg-brand-primary/95 backdrop-blur-md h-16 border-b border-brand-border shadow-2xl" : "bg-transparent h-24"}`}
    >
      <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/Logo.webp"
            alt="Digital Station Logo"
            className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 object-contain shrink-0"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "opacity-100 text-white" : ""}`}
          >
            Home
          </Link>

          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link
              to="/services"
              className={`nav-link flex items-center gap-1 ${servicesOpen || location.pathname === "/services" || location.pathname.startsWith("/services/") ? "opacity-100 text-white font-bold" : ""}`}
            >
              Services{" "}
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-300 ${servicesOpen ? "rotate-180 text-brand-accent" : ""}`}
              />
            </Link>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[500px]"
                >
                  <div className="bg-brand-surface border border-brand-border p-8 rounded-2xl shadow-2xl grid grid-cols-2 gap-x-8 gap-y-6">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.num}
                        to={`/services/${s.slug}`}
                        className="group/item"
                      >
                        <div className="text-[9px] font-mono text-brand-accent mb-1 opacity-50 flex items-center gap-2">
                          <Sparkles className="w-2 h-2" />
                          {s.num}
                        </div>
                        <div className="text-sm font-bold text-white uppercase tracking-tighter mb-1 transition-colors group-hover/item:text-brand-accent">
                          {s.title}
                        </div>
                        <div className="text-[10px] text-neutral-500 leading-tight">
                          {s.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/case-studies"
            className={`nav-link ${location.pathname === "/case-studies" ? "opacity-100 text-white" : ""}`}
          >
            Case Studies
          </Link>
          <Link
            to="/about"
            className={`nav-link ${location.pathname === "/about" ? "opacity-100 text-white" : ""}`}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className={`nav-link ${location.pathname === "/contact" ? "opacity-100 text-white" : ""}`}
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 mr-1">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[82%] h-screen h-[100dvh] bg-brand-primary z-[60] flex flex-col md:hidden border-l border-brand-border shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="h-16 md:h-20 px-6 md:px-8 flex items-center justify-between border-b border-brand-border shrink-0">
                <Link
                  to="/"
                  className="flex items-center gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img
                    src="/Logo.webp"
                    alt="Best Pro Digital"
                    className="w-10 h-10"
                  />
                  <span className="font-display text-xl font-bold tracking-tighter text-white uppercase italic">
                    Best Pro Digital
                  </span>
                </Link>
                <div className="flex items-center gap-4">
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-10 w-10 rounded-full border border-brand-accent flex items-center justify-center bg-brand-accent"
                  >
                    <ArrowRight className="w-5 h-5 text-brand-primary" />
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 px-6 md:px-8 py-6 md:py-10 flex flex-col gap-6 md:gap-10 overflow-y-auto overscroll-contain">
                <div className="space-y-1">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <Link
                      to="/"
                      className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white hover:text-brand-accent transition-colors"
                    >
                      Home
                    </Link>
                  </motion.div>

                  <div className="space-y-4 pt-4 md:pt-8">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-[10px] uppercase font-black tracking-[0.4em] text-brand-accent">
                        Our Services
                      </span>
                      <div className="h-px flex-1 bg-brand-accent opacity-10" />
                    </motion.div>

                    <div className="flex flex-col gap-1 md:gap-3 pl-2">
                      {SERVICES.map((s, i) => (
                        <motion.div
                          key={s.slug}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.03 }}
                        >
                          <Link
                            to={`/services/${s.slug}`}
                            className="text-base md:text-xl font-bold uppercase tracking-tighter text-white/90 hover:text-brand-accent transition-all flex items-center justify-between group py-1"
                          >
                            {s.title}
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-accent" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-5">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      to="/case-studies"
                      className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white hover:text-brand-accent transition-colors"
                    >
                      Nos solutions
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <Link
                      to="/about"
                      className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white hover:text-brand-accent transition-colors"
                    >
                      About Us
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      to="/contact"
                      className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white hover:text-brand-accent transition-colors"
                    >
                      Contact
                    </Link>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 }}
                  className="pt-6 border-t border-brand-border"
                >
                  <div className="flex items-center gap-10">
                    <div className="flex flex-col items-center gap-2">
                      <LanguageSwitcher />
                      <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/70">
                        Language
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <ThemeSwitcher />
                      <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/70">
                        Theme
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="p-8 border-t border-brand-border shrink-0 bg-brand-primary">
                <Link
                  to="/contact"
                  className="btn-primary w-full py-6 text-xl uppercase font-black tracking-tighter shadow-[0_0_40px_rgba(var(--brand-accent),0.2)]"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
