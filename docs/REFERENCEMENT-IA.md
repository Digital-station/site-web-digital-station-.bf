# Être trouvé par Google et par les assistants IA

Objectif : quand quelqu'un demande à Google, ChatGPT, Gemini, Claude ou Perplexity
« meilleure agence pour un site web à Ouagadougou », « implémentation Odoo au
Burkina Faso » ou « affiches publicitaires Ouagadougou », Digital Station doit
faire partie des réponses.

Les assistants IA ne « référencent » pas un site comme Google : ils citent les
sources qu'ils trouvent (recherche web en direct) ou qu'ils ont lues pendant
leur entraînement. Dans les deux cas, trois choses comptent : être **lisible**
(crawl autorisé, texte clair), être **explicite** (qui, où, quoi, pour qui,
écrit comme on pose la question), et être **confirmé ailleurs** (mêmes
informations sur des sites tiers de confiance).

## 1. Ce que le site fait déjà (dans ce dépôt)

| Levier | Où |
| --- | --- |
| Crawlers IA autorisés explicitement (GPTBot, ClaudeBot, Google-Extended, PerplexityBot, Bingbot…) | `app/robots.ts` |
| Fiche entreprise lisible par les modèles (`llms.txt`) | `public/llms.txt` → https://digitalstation.bf/llms.txt |
| FAQ formulée comme les requêtes (« Quelle agence pour créer un site web à Ouagadougou ? », « Qui peut implémenter Odoo au Burkina Faso ? », affiches publicitaires…) + balisage `FAQPage` | `components/sections/home/HomeFaq.tsx`, `messages/*.json` → `home.faq` |
| Données structurées `Organization` / `ProfessionalService` enrichies : `alternateName`, `slogan`, `areaServed` (Ouagadougou, Bobo-Dioulasso, Burkina Faso, Afrique de l'Ouest), `knowsAbout` en FR + EN | `lib/schema.ts` |
| `Service` + `BreadcrumbList` par service, `ItemList` pour les solutions, `ContactPage` + `FAQPage` | pages `app/[locale]/**` |
| Titres et descriptions uniques, canonical, hreflang FR/EN, sitemap avec dates réelles | `lib/seo.ts`, `app/sitemap.ts` |
| « Implémentation Odoo » nommée dans le service Intégration et dans la FAQ | `messages/*.json` |

## 2. À faire hors du code (par ordre d'impact)

1. **Google Business Profile** (gratuit, le plus important pour « agence … Ouagadougou »)
   - Créer / revendiquer la fiche « Digital Station » à l'adresse Rue 28 269, Ouagadougou.
   - Catégorie principale : *Société de services informatiques* ; secondaires : *Agence de création de sites web*, *Éditeur de logiciels*, *Agence de marketing*.
   - Mêmes nom, adresse, téléphone (+226 50 22 28 94) et horaires que le site, mot pour mot.
   - Ajouter les 11 services, le logo, des photos des locaux et de l'équipe.
   - Demander un avis Google à chaque client livré (lien court à envoyer par WhatsApp). Les avis sont la première source des réponses IA sur « meilleure agence ».
2. **Google Search Console + Bing Webmaster Tools** : propriété *Domaine* `digitalstation.bf`, soumettre `https://digitalstation.bf/sitemap.xml`. Bing alimente ChatGPT et Copilot.
3. **Page LinkedIn entreprise** (puis remettre l'URL dans `config/site.config.ts` → `socials.linkedin`), avec la même description que `llms.txt`. Publier 2 à 4 fois par mois (projets livrés, conseils Odoo, visuels réalisés).
4. **Annuaires et sources que les modèles lisent** : Wikidata (entité « Digital Station SARL », siège, site, date de création), Crunchbase, Clutch / GoodFirms / Sortlist (catégories « Web development Burkina Faso », « Odoo partner »), pages jaunes burkinabè (Annuaire des entreprises du Burkina, Kiosque Afrique, Go Africa Online), Facebook (déjà en place) avec les mêmes informations.
5. **Partenariat Odoo** : s'inscrire au programme partenaires Odoo (Learning Partner / Ready Partner). La fiche sur odoo.com/partners est ce que les assistants citent pour « intégrateur Odoo au Burkina Faso ».
6. **Contenu qui répond aux questions** (1 article par mois suffit) : « Combien coûte un site web au Burkina Faso en 2026 », « Odoo vs ERP sur mesure pour une PME burkinabè », « Checklist conformité CIL ». Chaque article doit répondre dans ses deux premières phrases, puis détailler.
7. **Preuves** : dès qu'un client accepte d'être cité, activer la section références (voir README) et publier une étude de cas courte (problème → solution → résultat chiffré). Les modèles privilégient les sources avec des exemples concrets.
8. **Liens entrants** : presse locale (Burkina24, Lefaso.net), interventions dans des événements tech, partenariats (chambre de commerce, incubateurs). Un lien = une confirmation.

## 3. Vérifier

- `https://digitalstation.bf/robots.txt` liste les crawlers IA ; `https://digitalstation.bf/llms.txt` répond en 200.
- Test des résultats enrichis Google (Rich Results Test) sur `/fr` et `/fr/contact` : `FAQPage` et `Organization` détectés sans erreur.
- Tous les 2 mois, poser les questions cibles à ChatGPT, Gemini, Claude et Perplexity et noter si Digital Station est citée ; ajuster la FAQ et les articles selon les formulations qui reviennent.
