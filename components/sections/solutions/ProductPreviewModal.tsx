import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export type ProductPreviewData = {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  features: { title: string; desc: string }[];
  techStack: string[];
  demoType: 'live' | 'guided';
  mockupScreens: {
    title: string;
    description: string;
    stat: string;
    badge: string;
  }[];
};

interface ProductPreviewModalProps {
  product: ProductPreviewData | null;
  onClose: () => void;
}

export function ProductPreviewModal({ product, onClose }: ProductPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tc = useTranslations('common');
  const ts = useTranslations('solutions');

  if (!product) return null;

  return (
    <AnimatePresence>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-preview-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-brand-surface border border-brand-border rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border bg-brand-primary/40">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                {ts('modal.previewLabel')} — {product.name}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={ts('modal.closeAria')}
              className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-text hover:border-brand-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* Overview Section */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full border border-green-500/30 text-green-400 bg-green-500/10 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {ts('modal.productionReady')}
                </span>
              </div>
              <h2 id="product-preview-title" className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-balance">
                {product.name}
              </h2>
              <p className="text-lg text-brand-accent font-medium italic font-serif">
                {product.tagline}
              </p>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed font-light">
                {product.desc}
              </p>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-brand-primary/50 border border-brand-border">
              {product.metrics.map((m) => (
                <div key={m.label} className="p-3">
                  <div className="text-xl sm:text-2xl font-black text-brand-text mb-1 font-mono">
                    {m.value}
                  </div>
                  <div className="text-xs text-brand-muted uppercase font-bold tracking-wider">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Feature Tabs */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-brand-accent flex items-center gap-2">
                <Layers className="w-4 h-4" />
                {ts('modal.modulesTitle')}
              </h3>

              <div className="flex flex-wrap gap-2 border-b border-brand-border pb-3">
                {product.mockupScreens.map((screen, idx) => (
                  <button
                    key={screen.title}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === idx
                        ? 'bg-brand-accent text-brand-on-accent shadow-md shadow-brand-accent/20'
                        : 'border border-brand-border text-brand-muted hover:border-brand-accent/50 hover:text-brand-text'
                    }`}
                  >
                    {screen.title}
                  </button>
                ))}
              </div>

              {/* Active Screen Interactive Display Card */}
              {product.mockupScreens[activeTab] && (
                <div className="bg-brand-surface-2 border border-brand-border rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-brand-accent-soft text-brand-accent border border-brand-accent/30 inline-block w-fit">
                      {product.mockupScreens[activeTab].badge}
                    </span>
                    <span className="text-xs font-mono text-brand-muted flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-brand-accent" />
                      {product.mockupScreens[activeTab].stat}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold uppercase mb-2">
                    {product.mockupScreens[activeTab].title}
                  </h4>
                  <p className="text-sm text-brand-muted font-light leading-relaxed mb-6">
                    {product.mockupScreens[activeTab].description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-brand-border/60">
                    {product.features.map((feat) => (
                      <div key={feat.title} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-brand-text uppercase tracking-wide">
                            {feat.title}
                          </div>
                          <div className="text-[11px] text-brand-muted leading-tight font-light mt-0.5">
                            {feat.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tech Stack Chips */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-brand-muted tracking-wider">
                {ts('modal.archTitle')}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1 rounded-lg bg-brand-primary border border-brand-border text-brand-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-brand-border bg-brand-primary/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-brand-muted font-light text-center sm:text-left">
              {ts('modal.footerNote')}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline px-5 py-3 text-xs uppercase font-bold tracking-wider flex-1 sm:flex-initial text-center"
              >
                {ts('modal.close')}
              </button>
              <Link
                href={`/contact?product=${product.id}`}
                onClick={onClose}
                className="btn-primary px-6 py-3 text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 flex-1 sm:flex-initial shadow-lg shadow-brand-accent-strong/20"
              >
                <span>{ts('demoAccess')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
