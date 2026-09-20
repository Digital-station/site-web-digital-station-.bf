export type ProductDetail = {
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

export const SOLUTIONS_INTERACTIVE_DATA: Record<string, Record<'fr' | 'en', ProductDetail>> = {
  alimgesto: {
    fr: {
      id: 'alimgesto',
      name: 'AlimGesto',
      tagline: 'Conçue pour les alimentations, supérettes et commerces de détail',
      desc: 'Système tout-en-un de gestion des stocks, caisses enregistreuses tactiles et suivi des marges en temps réel, optimisé pour fonctionner en ligne comme hors-ligne.',
      tags: ['Point de Vente', 'Gestion de Stock', 'Commerce & Supérette', 'Mode Hors-Ligne'],
      metrics: [
        { label: 'Disponibilité', value: '100% Hors-Ligne' },
        { label: 'Gain de temps caisse', value: '-45%' },
        { label: 'Alertes péremption', value: 'Automatisées' },
      ],
      features: [
        { title: 'Caisse tactile rapide', desc: 'Encaissement multi-moyens (espèces, Mobile Money, cartes) en moins de 5 secondes.' },
        { title: 'Inventaire code-barres', desc: 'Scan via lecteur optique ou smartphone pour entrées/sorties instantanées.' },
        { title: 'Suivi des marges & pertes', desc: 'Calcul automatique des bénéfices nets et détection des écarts de caisse.' },
        { title: 'Alertes stock minimum', desc: 'Notifications automatiques avant rupture ou dépassement de date limite.' },
      ],
      techStack: ['React / Electron', 'Node.js', 'SQLite (Local)', 'PostgreSQL (Cloud)', 'WebSockets'],
      demoType: 'guided',
      mockupScreens: [
        {
          title: 'Caisse & Encaissement Rapide',
          description: 'Interface caisse tactile conçue pour les pics d’affluence avec raccourcis produits, gestion du rendu de monnaie et impression ticket thermique.',
          stat: '< 4 secondes par client',
          badge: 'Module Caisse',
        },
        {
          title: 'Gestion des Stocks & Inventaire',
          description: 'Vision panoramique de vos articles en rayon et en réserve. Réapprovisionnement intelligent et alertes de seuils critiques.',
          stat: '0 perte par rupture de stock',
          badge: 'Module Inventaire',
        },
        {
          title: 'Tableau de bord Directeur',
          description: 'Chiffre d’affaires journalier, marge brute par catégorie, meilleures ventes et journal de trésorerie consultables à distance sur smartphone.',
          stat: 'Chiffres consolidés en direct',
          badge: 'Module Analytics',
        },
      ],
    },
    en: {
      id: 'alimgesto',
      name: 'AlimGesto',
      tagline: 'Built for grocery stores, minimarkets and local retail',
      desc: 'All-in-one inventory and touch-POS system with real-time margin tracking, designed to operate seamlessly both online and offline.',
      tags: ['Point of Sale', 'Inventory Control', 'Retail & Grocery', 'Offline-First'],
      metrics: [
        { label: 'Uptime', value: '100% Offline Capable' },
        { label: 'Checkout speedup', value: '-45% Time' },
        { label: 'Expiry alerts', value: 'Automated' },
      ],
      features: [
        { title: 'High-speed touch POS', desc: 'Multi-payment processing (Cash, Mobile Money, Cards) in under 5 seconds.' },
        { title: 'Barcode stocktaking', desc: 'Instant item scanning via physical scanners or smartphone camera.' },
        { title: 'Margin & discrepancy tracking', desc: 'Automated net profit calculation and cash drawer audit logs.' },
        { title: 'Low-stock automated alerts', desc: 'Proactive warnings before stockouts or expiry dates are reached.' },
      ],
      techStack: ['React / Electron', 'Node.js', 'SQLite (Local)', 'PostgreSQL (Cloud)', 'WebSockets'],
      demoType: 'guided',
      mockupScreens: [
        {
          title: 'Express POS Checkout',
          description: 'Touch-optimized register layout built for high foot-traffic rush hours with quick items and thermal printing.',
          stat: '< 4s average transaction',
          badge: 'POS Terminal',
        },
        {
          title: 'Inventory & Stock Reordering',
          description: 'Full visibility over shop floor and back-store stock. Automated reorder calculation based on sales velocity.',
          stat: 'Zero avoidable stockouts',
          badge: 'Inventory Control',
        },
        {
          title: 'Executive Analytics Hub',
          description: 'Daily revenue, category margins, top performers, and cash reconciliation accessible remotely on mobile.',
          stat: 'Real-time multi-shop metrics',
          badge: 'Analytics Suite',
        },
      ],
    },
  },
  ticketia: {
    fr: {
      id: 'ticketia',
      name: 'Ticketia',
      tagline: 'Billetterie intelligente et contrôle d\'accès pour tous vos événements',
      desc: 'Plateforme haute performance de vente de billets avec QR-codes cryptés infalsifiables et scan hors-ligne pour concerts, conférences et festivals.',
      tags: ['Billetterie Électronique', 'Contrôle d\'Accès', 'Mobile Money', 'Anti-Fraude'],
      metrics: [
        { label: 'Vérification scan', value: '< 0.5s / QR Code' },
        { label: 'Taux de fraude', value: '0% (Clé cryptographique)' },
        { label: 'Modes de paiement', value: 'Orange Money, Moov, Wave' },
      ],
      features: [
        { title: 'QR Codes dynamiques cryptés', desc: 'Chaque billet possède une signature cryptographique à usage unique évitant les photocopies.' },
        { title: 'Scan d\'entrée hors-ligne', desc: 'Application mobile de contrôle fonctionnant même sans connexion internet dans les stades.' },
        { title: 'Paiement Mobile Money direct', desc: 'Achat instantané par Orange Money, Moov Money et Wave avec réception SMS/Email.' },
        { title: 'Rapports d’affluence en temps réel', desc: 'Jauge en direct, flux par porte et statistiques de billetterie heure par heure.' },
      ],
      techStack: ['Next.js', 'Golang Engine', 'Redis', 'PostgreSQL', 'Flutter Mobile Scanner'],
      demoType: 'live',
      mockupScreens: [
        {
          title: 'Scanner Mobile Contrôleur',
          description: 'Application Android/iOS pour agents de sécurité aux portes : validation visuelle et sonore ultra-rapide sans latence réseau.',
          stat: 'Jusqu’à 120 scans / minute',
          badge: 'App Contrôleur',
        },
        {
          title: 'Guichet de Vente en Ligne',
          description: 'Tunnel d’achat épuré optimisé pour smartphone : choix des catégories (VIP, Standard, Pass) et paiement immédiat.',
          stat: 'Taux de conversion > 85%',
          badge: 'Portail Public',
        },
        {
          title: 'Supervision & Jauge Live',
          description: 'Tableau de bord de sécurité affichant les entrées par porte, la vitesse de remplissage et les alertes de doublons.',
          stat: 'Synchronisation multi-portes en P2P',
          badge: 'Régie Événement',
        },
      ],
    },
    en: {
      id: 'ticketia',
      name: 'Ticketia',
      tagline: 'Smart ticketing and offline-ready access control for events',
      desc: 'High-performance ticketing engine featuring cryptographically signed QR-codes and offline gate scanning for stadium concerts, festivals, and summits.',
      tags: ['E-Ticketing', 'Access Control', 'Mobile Money', 'Anti-Fraud'],
      metrics: [
        { label: 'Scan validation', value: '< 0.5s / QR' },
        { label: 'Fraud rate', value: '0% (Signed Tokens)' },
        { label: 'Integrated payments', value: 'Orange Money, Moov, Wave' },
      ],
      features: [
        { title: 'Encrypted Dynamic QR Codes', desc: 'Single-use cryptographic signature preventing duplicate printouts or screenshots.' },
        { title: 'Offline mobile gate scan', desc: 'Scanner app functions continuously even in dense arenas with complete network blackout.' },
        { title: 'Mobile Money checkouts', desc: 'Instant local purchases via Orange Money, Moov Money, and Wave with SMS/PDF delivery.' },
        { title: 'Real-time occupancy analytics', desc: 'Live headcount by gate, throughput rate, and financial reconciliation reports.' },
      ],
      techStack: ['Next.js', 'Golang Engine', 'Redis', 'PostgreSQL', 'Flutter Mobile Scanner'],
      demoType: 'live',
      mockupScreens: [
        {
          title: 'Security Gate Scanner',
          description: 'Inspector app for stadium gates: instantaneous green/red validation with haptic feedback and offline sync.',
          stat: 'Up to 120 scans/min per gate',
          badge: 'Gate Scanner',
        },
        {
          title: 'Mobile Ticket Storefront',
          description: 'Frictionless purchasing flow: tier selection (VIP, Early Bird, General) with integrated 1-tap mobile payment.',
          stat: '> 85% checkout completion',
          badge: 'Buyer Portal',
        },
        {
          title: 'Event Operations Deck',
          description: 'Real-time commander screen monitoring ingress speed, gate congestion, and automatic fraud attempt flags.',
          stat: 'Zero-latency P2P mesh sync',
          badge: 'Control Tower',
        },
      ],
    },
  },
  immopilot: {
    fr: {
      id: 'immopilot',
      name: 'ImmoPilot',
      tagline: 'Pilotez votre portefeuille immobilier et sécurisez vos loyers',
      desc: 'Plateforme intégrée de gestion locative, quittances automatisées, suivi des baux et relances impayés pour agences immobilières et propriétaires.',
      tags: ['Gestion Locative', 'Relance Loyers', 'Comptabilité Immobilière', 'Portail Bailleurs'],
      metrics: [
        { label: 'Recouvrement', value: '+30% de ponctualité' },
        { label: 'Édition quittances', value: '100% Automatisée' },
        { label: 'Portefeuille', value: 'Multi-biens & Multi-bailleurs' },
      ],
      features: [
        { title: 'Génération automatique de quittances', desc: 'Envoi instantané par WhatsApp et Email dès validation du règlement.' },
        { title: 'Rapprochement bancaire & Mobile Money', desc: 'Identification immédiate du locataire émetteur et imputation comptable.' },
        { title: 'Espace propriétaire bailleur', desc: 'Portail transparent permettant aux propriétaires de suivre l\'occupation et les versements.' },
        { title: 'Gestion des travaux & sinistres', desc: 'Tickets d\'intervention pour prestataires (plomberie, électricité) avec devis et photos.' },
      ],
      techStack: ['React', 'TypeScript', 'Tailwind', 'PostgreSQL', 'WhatsApp Business API'],
      demoType: 'guided',
      mockupScreens: [
        {
          title: 'Suivi des Loyers & Échéancier',
          description: 'Tableau mensuel des loyers échus, payés et en retard avec relance WhatsApp en un clic.',
          stat: 'Diminution des impayés de 65%',
          badge: 'Recouvrement',
        },
        {
          title: 'Fiche Bien & Contrat de Bail',
          description: 'Historique complet des locataires, état des lieux numérisé, cautions et indexation des charges.',
          stat: 'Zéro papier égaré',
          badge: 'Patrimoine',
        },
        {
          title: 'Rapports Financiers Propriétaires',
          description: 'Relevé de gérance mensuel généré automatiquement avec déduction des commissions d’agence.',
          stat: 'Clôture comptable en 10 minutes',
          badge: 'Bilan Bailleurs',
        },
      ],
    },
    en: {
      id: 'immopilot',
      name: 'ImmoPilot',
      tagline: 'Complete property management and automated rent collection',
      desc: 'Unified tenancy and asset management platform featuring automated rent receipts, lease tracking, and multi-channel tenant reminders.',
      tags: ['Property Management', 'Rent Collection', 'Real Estate ERP', 'Owner Portal'],
      metrics: [
        { label: 'Collection rate', value: '+30% On-time rents' },
        { label: 'Receipt generation', value: '100% Automated' },
        { label: 'Multi-entity', value: 'Multi-property & landlord' },
      ],
      features: [
        { title: 'Instant digital receipts', desc: 'Automatic dispatch via WhatsApp and Email upon payment confirmation.' },
        { title: 'Mobile Money reconciliation', desc: 'Automated matching between payment reference and tenant lease ledger.' },
        { title: 'Landlord client portal', desc: 'Real-time occupancy status, net payout calculations, and maintenance audits.' },
        { title: 'Work orders & ticket triage', desc: 'Maintenance dispatch system with photo inspection logs and contractor quotes.' },
      ],
      techStack: ['React', 'TypeScript', 'Tailwind', 'PostgreSQL', 'WhatsApp Business API'],
      demoType: 'guided',
      mockupScreens: [
        {
          title: 'Rent Roll & Arrears Tracker',
          description: 'Color-coded monthly ledger identifying paid, pending, and overdue rents with 1-click WhatsApp alerts.',
          stat: '65% reduction in overdue rents',
          badge: 'Collections',
        },
        {
          title: 'Lease & Property Digital File',
          description: 'Digital tenant vault storing signed leases, photo condition reports, and deposit escrow records.',
          stat: '100% paperless audit trail',
          badge: 'Asset Records',
        },
        {
          title: 'Landlord Remittance Statement',
          description: 'Instant end-of-month statements calculating gross rent, agency commission, and net bank transfers.',
          stat: '10-minute monthly settlement',
          badge: 'Financials',
        },
      ],
    },
  },
  edumanager: {
    fr: {
      id: 'edumanager',
      name: 'EduManager',
      tagline: 'La gestion académique et administrative simplifiée pour écoles et universités',
      desc: 'Système complet de gestion des inscriptions, relevés de notes, emplois du temps et scolarités avec portail parents et communication SMS.',
      tags: ['Éducation', 'Gestion Scolaire', 'Bulletins de Notes', 'Portail Parents'],
      metrics: [
        { label: 'Bulletins', value: 'Calcul en 1 clic' },
        { label: 'Relances scolarité', value: 'Automatisées par SMS' },
        { label: 'Capacité', value: 'De la maternelle au supérieur' },
      ],
      features: [
        { title: 'Calcul des moyennes & bulletins', desc: 'Prise en compte des coefficients, appréciations et rangs selon les normes nationales.' },
        { title: 'Paiement des frais de scolarité', desc: 'Échéanciers personnalisés, reçus sécurisés et alertes de solde restant dues.' },
        { title: 'Portail & alertes parents', desc: 'Accès mobile pour suivre l\'assiduité, les notes et les devoirs en temps réel.' },
        { title: 'Emplois du temps & présences', desc: 'Feuille d\'appel numérique pour les enseignants avec signalement des absences.' },
      ],
      techStack: ['Next.js', 'FastAPI (Python)', 'PostgreSQL', 'Docker', 'SMS Gateway API'],
      demoType: 'guided',
      mockupScreens: [
        {
          title: 'Génération des Bulletins Trimestriels',
          description: 'Module d\'agrégation des notes avec calcul instantané des moyennes pondérées, des rangs et impression par lot.',
          stat: 'Gain de 40 heures par trimestre',
          badge: 'Pédagogie',
        },
        {
          title: 'Suivi de la Caisse & Scolarités',
          description: 'Tableau de bord financier retraçant les versements par tranche avec reçus horodatés infalsifiables.',
          stat: 'Recouvrement optimisé à 98%',
          badge: 'Comptabilité',
        },
        {
          title: 'Cahier de Texte & Présences',
          description: 'Interface simple pour le corps enseignant : pointage des absences en début de cours et devoirs à faire.',
          stat: 'Alerte SMS immédiate aux tuteurs',
          badge: 'Vie Scolaire',
        },
      ],
    },
    en: {
      id: 'edumanager',
      name: 'EduManager',
      tagline: 'Streamlined academic administration and tuition management',
      desc: 'Comprehensive school ERP managing admissions, grade calculation, timetables, and tuition fee collection with automated parent SMS alerts.',
      tags: ['EdTech', 'School ERP', 'Report Cards', 'Parent Portal'],
      metrics: [
        { label: 'Report generation', value: '1-Click Calculation' },
        { label: 'Tuition alerts', value: 'SMS Automated' },
        { label: 'Scalability', value: 'K-12 & Higher Education' },
      ],
      features: [
        { title: 'Instant grade reports', desc: 'Weighted GPA calculation, class ranking, and bulk transcript printing.' },
        { title: 'Tuition installment tracking', desc: 'Custom payment schedules, digitized stamped receipts, and ledger auditing.' },
        { title: 'Parent mobile portal & SMS', desc: 'Real-time attendance logs, exam schedules, and academic progress updates.' },
        { title: 'Digital attendance roll call', desc: 'Teacher portal for instant absent/tardy roll-call with automated parent notification.' },
      ],
      techStack: ['Next.js', 'FastAPI (Python)', 'PostgreSQL', 'Docker', 'SMS Gateway API'],
      demoType: 'guided',
      mockupScreens: [
        {
          title: 'Academic Grade Transcripts',
          description: 'Automated grade collation module calculating weighted rankings and generating standardized report cards.',
          stat: 'Saves 40 hours per grading cycle',
          badge: 'Academics',
        },
        {
          title: 'Tuition Cashier & Installments',
          description: 'Real-time bursary register tracking installment deadlines with cryptographic receipt verification.',
          stat: '98% tuition collection rate',
          badge: 'Bursar Office',
        },
        {
          title: 'Attendance & Class Logs',
          description: 'Teacher roll-call interface flagging unexcused absences and automatically sending SMS notifications to guardians.',
          stat: 'Instant SMS parent alerts',
          badge: 'Campus Life',
        },
      ],
    },
  },
};
