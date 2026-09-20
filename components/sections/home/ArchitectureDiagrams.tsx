import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Database, 
  Server, 
  Layers, 
  ArrowRight,
  Code2,
  Lock,
  GitBranch
} from 'lucide-react';

export function ArchitectureDiagrams() {
  const [activeTab, setActiveTab] = useState<'ticketia' | 'alimgesto' | 'cloud' | 'security'>('ticketia');

  const ARCHITECTURES = {
    ticketia: {
      title: 'Ticketia — Moteur de Billetterie & Contrôle Hors-Ligne',
      subtitle: 'Architecture zéro-latence pour stades et événements à forte affluence',
      stats: [
        { label: 'Validation QR Code', value: '< 0.3 seconde' },
        { label: 'Capacité Offline', value: '100% Autonome' },
        { label: 'Protection Rejeu', value: 'Nonce & Ed25519' },
      ],
      flow: [
        { step: '01', title: 'Achat & Signature', desc: 'Génération du billet avec QR code signé cryptographiquement (clé privée ECDSA) stocké localement sur smartphone.' },
        { step: '02', title: 'Porte d\'Accès Sans Réseau', desc: 'L\'application contrôleur vérifie la signature via la clé publique pré-chargée en cache SQLite local.' },
        { step: '03', title: 'Mesh P2P & Anti-Doublon', desc: 'Les terminaux contrôleurs échangent les jetons scannés en réseau local maillé (Wi-Fi local / Bluetooth).' },
        { step: '04', title: 'Réconciliation Cloud', desc: 'Synchronisation par lots vers la base centrale PostgreSQL dès rétablissement du réseau internet.' },
      ],
      techChips: ['Next.js', 'Golang Engine', 'Redis Cache', 'SQLite Local', 'Ed25519 Keys'],
    },
    alimgesto: {
      title: 'AlimGesto — Architecture Hybride Edge-to-Cloud',
      subtitle: 'Continuité de vente absolue pour commerces et supérettes',
      stats: [
        { label: 'Tolérance Panne Internet', value: 'Zero Impact Vente' },
        { label: 'Vitesse Encaissement', value: '< 5s par ticket' },
        { label: 'Synchronisation', value: 'Delta Bidirectionnel' },
      ],
      flow: [
        { step: '01', title: 'Caisse Edge Locale', desc: 'L\'encaissement et le tiroir-caisse s\'exécutent sur un moteur local ultra-rapide sans dépendance Internet.' },
        { step: '02', title: 'File d\'Attente Journalisée', desc: 'Chaque vente génère un événement append-only persisté localement en base transactionnelle.' },
        { step: '03', title: 'Sync Delta Automatique', desc: 'Dès que la connexion 4G/Fibre est détectée, le synchroniseur pousse les deltas sans bloquer les ventes.' },
        { step: '04', title: 'Console Patron en Temps Réel', desc: 'Le gérant suit à distance sur son mobile les stocks consolidés et la trésorerie en temps réel.' },
      ],
      techChips: ['Electron / React', 'SQLite Embedded', 'PostgreSQL Cloud', 'WebSockets', 'REST Sync'],
    },
    cloud: {
      title: 'Infrastructure Cloud & Haute Disponibilité',
      subtitle: 'Déploiement conteneurisé scalable pour entreprises et SaaS',
      stats: [
        { label: 'Disponibilité Cible', value: '99.9% SLA' },
        { label: 'Déploiement Continu', value: 'Zero-Downtime' },
        { label: 'Sauvegardes', value: 'Snapshots Quotidiens' },
      ],
      flow: [
        { step: '01', title: 'Reverse Proxy & WAF', desc: 'Filtrage anti-DDoS, terminaison SSL Let\'s Encrypt automatisée et routage de trafic Nginx/Cloudflare.' },
        { step: '02', title: 'Clusters Conteneurisés Docker', desc: 'Isolation stricte des services applicatifs, micro-services et API avec orchestration résiliente.' },
        { step: '03', title: 'Base de Données Redondée', desc: 'PostgreSQL avec réplication en streaming, rétention des journaux WAL et snapshots chiffrés.' },
        { step: '04', title: 'Supervision & Alerting 24/7', desc: 'Métriques systèmes (CPU, RAM, Disque, I/O) avec alertes automatiques vers l\'équipe d\'infogérance.' },
      ],
      techChips: ['Docker / Compose', 'Nginx WAF', 'PostgreSQL Replication', 'Prometheus', 'Linux Debian'],
    },
    security: {
      title: 'Gouvernance & Sécurité Zero-Trust',
      subtitle: 'Protection des données sensibles et conformité institutionnelle',
      stats: [
        { label: 'Chiffrement au Repos', value: 'AES-256' },
        { label: 'Chiffrement en Transit', value: 'TLS 1.3 Strict' },
        { label: 'Authentification', value: 'MFA & RBAC' },
      ],
      flow: [
        { step: '01', title: 'Principe du Moindre Privilège', desc: 'Gestion fine des rôles (RBAC), séparation étanche des environnements de dev, staging et production.' },
        { step: '02', title: 'Chiffrement bout en bout', desc: 'Données nominatives chiffrées au repos (AES-256) et certificats TLS 1.3 avec HSTS strict.' },
        { step: '03', title: 'Piste d\'Audit Immuable', desc: 'Journalisation inviolable de toutes les actions administratives et accès aux données sensibles.' },
        { step: '04', title: 'Plan de Continuité (PCA/PRA)', desc: 'Sauvegardes déportées géographiquement avec tests de restauration trimestriels planifiés.' },
      ],
      techChips: ['OAuth2 / OIDC', 'AES-256 Encryption', 'Audit Vault', 'Firewall UFW', 'Fail2ban'],
    },
  };

  const current = ARCHITECTURES[activeTab];

  return (
    <section className="py-20 lg:py-28 border-t border-brand-border bg-brand-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <p className="text-brand-accent text-xs font-mono font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>Architecture & Rigor</span>
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-balance">
            Schémas d'architecture & ingénierie
          </h2>
          <p className="text-brand-muted text-sm sm:text-base font-light mt-4">
            Découvrez comment nous concevons nos systèmes pour résister aux coupures réseaux, garantir la souveraineté des données et encaisser de forts volumes.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {(
            [
              { id: 'ticketia', label: 'Ticketia (Offline-First)', icon: Zap },
              { id: 'alimgesto', label: 'AlimGesto (Edge-Sync)', icon: Database },
              { id: 'cloud', label: 'Cloud & DevOps (SLA 99.9%)', icon: Server },
              { id: 'security', label: 'Sécurité & Zero-Trust', icon: ShieldCheck },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-accent text-brand-on-accent shadow-lg shadow-brand-accent/20 scale-105'
                    : 'bg-brand-primary/60 border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-accent/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Architecture Content Board */}
        <div className="bg-brand-primary border border-brand-border rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-brand-border">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-accent font-bold mb-1">
                Spécification Système
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                {current.title}
              </h3>
              <p className="text-sm text-brand-muted font-light mt-1">
                {current.subtitle}
              </p>
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap gap-4">
              {current.stats.map((s) => (
                <div key={s.label} className="p-3 bg-brand-surface border border-brand-border rounded-xl font-mono">
                  <div className="text-[10px] text-brand-muted uppercase">{s.label}</div>
                  <div className="text-base font-bold text-brand-accent mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Pipeline */}
          <div className="py-8">
            <div className="text-xs font-mono uppercase tracking-wider text-brand-muted mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-accent" />
              <span>Pipeline & Flux de Données Étape par Étape</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {current.flow.map((step, idx) => (
                <div
                  key={step.step}
                  className="bg-brand-surface-2 border border-brand-border rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-brand-accent/50 transition-colors"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-accent-soft text-brand-accent border border-brand-accent/30 inline-block">
                      PHASE {step.step}
                    </span>
                    <h4 className="text-sm font-bold uppercase tracking-tight text-brand-text pt-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-brand-muted font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Footer */}
          <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-accent" />
              <span className="text-xs font-mono text-brand-muted uppercase">Technologies mobilisées :</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {current.techChips.map((chip) => (
                <span
                  key={chip}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-brand-surface border border-brand-border text-brand-text"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
