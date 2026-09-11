import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Music2,
} from "lucide-react";

const PinterestIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
  </svg>
);

export const Footer = () => {
  const socials = [
    { icon: Facebook, href: "#", label: "Facebook " },
    { icon: Instagram, href: "#", label: "Instagram " },
    { icon: Twitter, href: "#", label: "Twitter " },
  ];

  return (
    <footer className="lg:pl-16 border-t border-brand-border py-20 bg-brand-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-6">
              <Logo className="w-8 h-8 transition-transform group-hover:scale-110" />
              <span className="font-display text-xl font-bold tracking-tighter text-white">
                Digital Station
              </span>
            </Link>
            <p className="text-white/40 text-sm max-w-sm mb-8">
              We help businesses build better websites, smarter software, and
              stronger digital systems. Simple, effective, and built for growth.
            </p>
            <div className="flex flex-wrap gap-4">
              {socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/40 hover:border-brand-accent hover:text-brand-accent transition-all hover:scale-110"
                  aria-label={social.label}
                  title={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-black mb-8">
              Navigation
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  to="/case-studies"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  About us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-black mb-8">
              Contacts
            </h4>
            <ul className="space-y-4">
              <li className="text-sm text-white/60">infos@digitalstation.bf</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] uppercase tracking-widest opacity-30">
            © {new Date().getFullYear()} / Digital Station. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link
              to="/privacy"
              className="text-[10px] uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-[10px] uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
