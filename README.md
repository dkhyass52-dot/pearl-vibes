# Pearl Vibes — boutique en ligne

Site e-commerce d'accessoires en perles (colliers, bracelets, bayas). La cliente remplit son panier sur le site, puis sa commande s'écrit automatiquement dans un message WhatsApp envoyé à la boutique.

**Technologies** : [Vite](https://vitejs.dev) · JavaScript (modules ES) · CSS · aucune base de données. Le panier et les favoris sont gardés dans le navigateur de la cliente (localStorage).

## Démarrer

```bash
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:5173 et se recharge à chaque sauvegarde.

## Structure

```
pearl-vibes/
├── index.html              Structure de la page (hero, sections, panier, modale)
├── public/
│   ├── favicon.png
│   └── img/                Photos des produits, logo, image de partage
└── src/
    ├── config.js           ← Numéro WhatsApp, zones et frais de livraison, écrin cadeau
    ├── data/
    │   ├── products.js     ← Catalogue : catégories (CATS), sous-catégories (SUBS), produits
    │   └── atelier.js      ← Perles et prix de l'Atelier sur mesure
    ├── styles/main.css     Design (couleurs en haut du fichier, thèmes clair/sombre)
    └── main.js             Logique : catalogue, panier, message WhatsApp, atelier
```

## Modifications courantes

**Numéro WhatsApp** — dans `src/config.js` :
```js
whatsapp: "22901XXXXXXXX",           // format international, sans + ni espaces
whatsappDisplay: "+229 01 XX XX XX XX",
```

**Pages catégories** — le site a trois pages : `/#colliers`, `/#bracelets`, `/#bayas`. Chacune a ses sous-catégories (définies dans `SUBS`), un filtre de prix, une recherche et un tri. Pour ajouter une sous-catégorie, ajoutez une ligne dans `SUBS` puis utilisez sa clé dans le champ `sub` des produits.

**Ajouter un produit** — dans `src/data/products.js`, copier une entrée et changer l'`id`, la catégorie (`cat`) et la sous-catégorie (`sub`). Mettre `feat: true` pour l'afficher dans les coups de cœur de l'accueil. Puis déposer la photo dans `public/img/` avec le même nom : `id: "collier-or"` → `public/img/collier-or.webp` (format portrait 4:5 conseillé, 900 × 1125 px).

**Couleurs** — en haut de `src/styles/main.css`, bloc `:root` (thème sombre) et bloc `[data-theme="light"]` (thème clair).

**Livraison** — `freeShipping` (seuil de livraison offerte) et `zones` dans `src/config.js`. Une zone avec `fee: null` affiche « sur devis ».

## Mettre en ligne sur Vercel

1. Pousser le dossier sur GitHub.
2. Sur vercel.com : **Add New → Project**, importer le dépôt.
3. Vercel détecte Vite automatiquement (build : `npm run build`, dossier : `dist`). Cliquer sur **Deploy**.

Ou en ligne de commande : `npm i -g vercel` puis `vercel` dans le dossier.

Après le premier déploiement, remplacer dans `index.html` la ligne `og:image` par l'adresse complète (`https://votre-domaine.vercel.app/img/og-image.jpg`) pour que l'aperçu s'affiche bien quand le lien est partagé sur WhatsApp ou Facebook.

## À remplacer avant la mise en ligne

- Le numéro WhatsApp (fictif pour l'instant).
- Les photos de `public/img/` : ce sont des visuels de démonstration récupérés sur des projets publics, à remplacer par les photos des vrais produits du client.
- Prix, stocks, avis clients et textes à valider avec le client.
