/* ==========================================================================
   CATALOGUE PEARL VIBES
   - Chaque produit a une photo : public/img/<id>.webp (portrait 4:5 conseillé)
   - cat : "collier" | "bracelet" | "baya"
   - sub : sous-catégorie (voir SUBS plus bas)
   - stock <= 3 affiche « Plus que X en stock » et classe la pièce en « Séries limitées »
   - feat : true = affiché dans les coups de cœur de la page d'accueil
   ========================================================================== */

export const CATS = {
  collier:  { slug: "colliers",  label: "Colliers",  single: "Collier",  cover: ["col-duo-noir", "col-noeud-perle", "col-duo-coquille"],
              intro: "Perles nacrées, rocailles à initiale, coquillages et parures. Du ras-du-cou discret au collier qui se remarque." },
  bracelet: { slug: "bracelets", label: "Bracelets", single: "Bracelet", cover: ["br-trio-oeil-tigre", "br-trio-malachite", "br-sept-pierres"],
              intro: "Pierres naturelles, sets pour lui et bracelets à charms colorés. À porter seul ou à accumuler au poignet." },
  baya:     { slug: "bayas",     label: "Bayas",     single: "Baya",     cover: ["baya-soleil-coeurs", "baya-nuit-trefles", "baya-rose-poudre"],
              intro: "Sets de bayas en cristal, trèfles et perles nacrées, ajustés à votre tour de taille. Faites-y écrire un prénom ou un message." }
};

export const SUBS = {
  collier:  [["perle", "Perles nacrées"], ["rocaille", "Rocailles & initiales"], ["ocean", "Coquillages & mer"], ["parure", "Parures"]],
  bracelet: [["pierre", "Pierres naturelles"], ["homme", "Pour lui"], ["charms", "Charms & couleurs"]],
  baya:     [["prenom", "Prénom & message"], ["trefle", "Trèfles & charms"]]
};

/* Options proposées par défaut selon la catégorie (modifiables produit par produit avec "opts") */
export const DEFAULT_OPTS = {
  collier:  { longueur: ["42 cm", "45 cm", "50 cm"] },
  bracelet: { taille: ["S", "M", "L"] },
  baya:     { fermoir: ["Nouage traditionnel", "Fermoir amovible"], taille: ["Sur mesure"] }
};

const RAW = [
  /* ---------------- COLLIERS ---------------- */
  { id: "col-duo-noir", name: "Duo Noir Cœur & Perle", cat: "collier", sub: "rocaille", price: 9500, stock: 8, feat: true, isNew: 3, badges: ["Lot de 2", "Nouveau"],
    mat: "Rocailles noires, perles dorées, cœur doré, perle d'eau douce", colors: ["#141418", "#d8ae55", "#f3ede2"], opts: { longueur: ["38 + 42 cm", "40 + 45 cm"] },
    desc: "Deux ras-du-cou en rocailles noires : l'un ponctué de perles dorées et d'un petit cœur, l'autre d'une perle d'eau douce." },
  { id: "col-initiale", name: "Collier Initiale", cat: "collier", sub: "rocaille", price: 5000, stock: 15, feat: true, perso: true, badges: ["Personnalisable"],
    mat: "Rocailles, perle lettre", colors: ["#f2ead8", "#141418"], opts: { couleur: ["Ivoire", "Noir", "Duo ivoire + noir"], longueur: ["38 cm", "40 cm", "42 cm"] },
    desc: "Un fil de rocailles ivoire ou noir et la lettre de votre choix. À offrir en duo à sa sœur, sa moitié ou sa meilleure amie." },
  { id: "col-noeud-perle", name: "Collier Nœud & Goutte de Perle", cat: "collier", sub: "perle", price: 12500, stock: 6, feat: true, badges: ["Best-seller"],
    mat: "Perles nacrées, chaîne et nœud dorés", colors: ["#f3ede2", "#d8ae55"], opts: { longueur: ["40 cm", "45 cm"] },
    desc: "Une chaîne de petites perles, un nœud doré et une goutte de perle qui descend sur le décolleté." },
  { id: "col-perles-papillon-or", name: "Collier Perles & Papillon d'Or", cat: "collier", sub: "perle", price: 11000, stock: 6, badges: [],
    mat: "Perles nacrées, papillon doré serti de strass", colors: ["#f3ede2", "#d8ae55"],
    desc: "Un rang de perles nacrées fermé par un papillon doré ajouré, serti de strass." },
  { id: "col-perles-riz-papillon", name: "Collier Perles de Riz & Papillon", cat: "collier", sub: "perle", price: 9500, stock: 7, isNew: 2, badges: [],
    mat: "Perles de riz nacrées, papillon en nacre", colors: ["#f3ede2"],
    desc: "Petites perles de riz et un papillon en nacre blanche. Doux et lumineux." },
  { id: "col-perle-coeur", name: "Ras-du-cou Perle & Cœur", cat: "collier", sub: "perle", price: 8500, stock: 10, badges: [],
    mat: "Perles nacrées, cœur doré", colors: ["#f3ede2", "#d8ae55"], opts: { longueur: ["36 cm", "38 cm", "40 cm"] },
    desc: "Un ras-du-cou de perles régulières et un tout petit cœur doré au centre. Parfait avec une chemise." },
  { id: "col-perles-classiques", name: "Collier Perles Classiques 10 mm", cat: "collier", sub: "perle", price: 10000, stock: 8, badges: [],
    mat: "Perles nacrées 10 mm, fermoir et chaînette argentés", colors: ["#f3ede2", "#cfd2d6"], opts: { longueur: ["42 cm", "45 cm", "50 cm"] },
    desc: "Le grand classique : un rang de grosses perles nacrées avec chaînette d'ajustement." },
  { id: "col-duo-coquille", name: "Duo Étoile & Coquille Nacrée", cat: "collier", sub: "ocean", price: 12000, stock: 5, feat: true, isNew: 2, badges: ["Lot de 2"],
    mat: "Rocailles blanches, perles d'eau douce, étoile de mer, coquille", colors: ["#f4f1ea", "#e8e2d6"],
    desc: "Un ras-du-cou en rocailles avec une petite étoile de mer, et un rang de perles avec sa coquille nacrée." },
  { id: "col-galets-etoile", name: "Collier Galets Blancs & Étoile d'Or", cat: "collier", sub: "ocean", price: 8500, stock: 7, badges: [],
    mat: "Éclats de pierre blanche, perles dorées, étoile de mer dorée", colors: ["#f4f1ea", "#d8ae55"],
    desc: "Éclats de pierre blanche, perles dorées et une étoile de mer en pendentif. L'été toute l'année." },
  { id: "col-duo-rose-cauri", name: "Duo Rose Lagon & Cauri", cat: "collier", sub: "ocean", price: 11000, stock: 4, badges: ["Lot de 2"],
    mat: "Cristal rose, perles nacrées, coquillages, cauri", colors: ["#f0a8c0", "#f3ede2", "#c9a07a"],
    desc: "Deux colliers rose et nacre : l'un semé de petits coquillages, l'autre terminé par un cauri." },
  { id: "col-parure-papillon", name: "Parure Papillon Noir", cat: "collier", sub: "parure", price: 15000, stock: 3, badges: ["5 pièces"],
    mat: "Perles nacrées, papillons émaillés noirs", colors: ["#f3ede2", "#2a2a35"], opts: { longueur: ["42 cm", "45 cm"] },
    desc: "Collier, deux bracelets, bague et boucles d'oreilles, tous ornés d'un papillon noir. La parure complète à offrir." },

  /* ---------------- BRACELETS ---------------- */
  { id: "br-trio-oeil-tigre", name: "Trio Œil-de-Tigre Doré", cat: "bracelet", sub: "pierre", price: 15000, stock: 4, feat: true, isNew: 3, badges: ["Lot de 3", "Nouveau"],
    mat: "Œil-de-tigre, pierre de lune, hématite dorée, perle zirconée", colors: ["#a87a2e", "#e8eef2", "#d8ae55"],
    desc: "Trois bracelets à superposer : œil-de-tigre, pierre de lune et hématite dorée, avec une perle pavée de zircons." },
  { id: "br-trio-malachite", name: "Trio Malachite", cat: "bracelet", sub: "pierre", price: 15000, stock: 3, feat: true, badges: ["Lot de 3"],
    mat: "Malachite, hématite, barrette zirconée argentée", colors: ["#1f8a6a", "#4a4d57", "#cfd2d6"],
    desc: "Malachite vert profond, hématite et une barrette pavée de zircons. Un trio qui se remarque." },
  { id: "br-sept-pierres", name: "Les Sept Pierres", cat: "bracelet", sub: "pierre", price: 6500, stock: 12, feat: true, badges: ["7 pierres au choix"],
    mat: "Pierres naturelles 8 mm, élastique renforcé", colors: ["#6b6b6b", "#7fc49a", "#a87a2e", "#1f8a6a", "#16161c"],
    opts: { pierre: ["Pyrite", "Aventurine", "Œil-de-tigre & croix", "Pierre de lave", "Malachite", "Œil-de-tigre", "Onyx"], taille: ["S", "M", "L", "XL"] },
    desc: "Pyrite, aventurine, lave, malachite, œil-de-tigre ou onyx : choisissez votre pierre, ou prenez les sept." },
  { id: "br-eclats-pierres", name: "Bracelet Éclats de Pierres", cat: "bracelet", sub: "pierre", price: 3500, stock: 20, badges: ["12 coloris"],
    mat: "Éclats de pierres naturelles, élastique", colors: ["#a87a2e", "#e6a0b4", "#3f8f6a", "#2c4fa0", "#e0368a"],
    opts: { pierre: ["Œil-de-tigre", "Rhodonite", "Jaspe vert", "Agate rose", "Unakite", "Sodalite", "Jaspe rouge", "Turquoise", "Malachite", "Agate fuchsia"], taille: ["Unique (élastique)"] },
    desc: "Des éclats de pierres naturelles, légers et colorés. On en porte un, on en porte dix." },
  { id: "br-duo-tigre-onyx", name: "Duo Œil-de-Tigre & Onyx", cat: "bracelet", sub: "homme", price: 9000, stock: 8, badges: ["Lot de 2"],
    mat: "Œil-de-tigre, onyx mat 10 mm", colors: ["#7a5a2e", "#16161c"], opts: { taille: ["M", "L", "XL"] },
    desc: "Deux bracelets en grosses perles d'œil-de-tigre et d'onyx. Le cadeau idéal pour lui." },
  { id: "br-duo-onyx-turquoise", name: "Duo Onyx & Turquoise Griffes", cat: "bracelet", sub: "homme", price: 10000, stock: 6, badges: ["Lot de 2"],
    mat: "Onyx mat, howlite turquoise, fermoirs griffes zirconés", colors: ["#16161c", "#3fb8c4", "#d8ae55"], opts: { taille: ["M", "L", "XL"] },
    desc: "Onyx mat et turquoise, chacun orné d'un motif griffe pavé de zircons, doré ou noir." },
  { id: "br-stack-jaspe-onyx", name: "Stack Jaspe & Onyx", cat: "bracelet", sub: "homme", price: 7500, stock: 10, badges: ["À l'unité ou en lot"],
    mat: "Jaspe paysage, onyx mat, hématite, lave", colors: ["#c9902e", "#16161c", "#4a4d57"],
    opts: { quantité: ["1 bracelet", "Lot de 3", "Lot de 7"], taille: ["M", "L", "XL"] },
    desc: "Jaspe paysage, onyx mat et hématite dorée. Sept modèles qui s'empilent, à l'unité ou en lot." },
  { id: "br-stack-lave-hematite", name: "Stack Lave & Hématite", cat: "bracelet", sub: "homme", price: 7000, stock: 10, badges: ["À l'unité ou en lot"],
    mat: "Pierre de lave, hématite, onyx, agate orange, quartz irisé", colors: ["#2a2a30", "#4a4d57", "#e0892e"],
    opts: { quantité: ["1 bracelet", "Lot de 3", "Lot de 7"], taille: ["M", "L", "XL"] },
    desc: "Lave, hématite et onyx, réveillés par une touche d'agate orange ou de quartz irisé." },
  { id: "br-set-lagon", name: "Set Bleu Lagon & Charms", cat: "bracelet", sub: "charms", price: 6500, stock: 8, isNew: 2, badges: ["Lot de 4"],
    mat: "Perles de verre, charms, strass", colors: ["#1aa0d8", "#bfe6f7"],
    desc: "Quatre bracelets bleu lagon avec leurs charms : bonbon, bulle à paillettes et pampille." },
  { id: "br-set-pastel", name: "Set Marbre Pastel & Marguerite", cat: "bracelet", sub: "charms", price: 6500, stock: 8, badges: ["Lot de 4"],
    mat: "Perles de verre marbrées, charms fleur et bulle", colors: ["#c9a6d8", "#f0b6c6", "#9fb8e8"],
    desc: "Perles marbrées rose et lavande, une marguerite et une petite bulle de perles. Tout doux." },
  { id: "br-set-lilas", name: "Set Lilas & Cœur", cat: "bracelet", sub: "charms", price: 6500, stock: 8, badges: ["Lot de 4"],
    mat: "Perles acryliques lilas, charms cœur et fiole", colors: ["#b9a3e8"],
    desc: "Quatre bracelets lilas, un cœur, une mini-fiole et une pampille. Existe aussi en rose, jaune et menthe." },

  /* ---------------- BAYAS ---------------- */
  /* perso: true = la cliente peut faire écrire un prénom ou un message en lettres */
  { id: "baya-nuit-trefles", name: "Set Nuit & Trèfles Noirs", cat: "baya", sub: "trefle", price: 16000, stock: 5, feat: true, isNew: 3, perso: true, badges: ["4 rangs"],
    mat: "Cristal noir facetté, trèfles émaillés, perles dorées", colors: ["#141418", "#d8ae55"],
    desc: "Quatre rangs : cristal noir, chaîne de trèfles noirs cerclés d'or et deux rangs à votre prénom ou message." },
  { id: "baya-soleil-coeurs", name: "Set Soleil & Cœurs Nacrés", cat: "baya", sub: "trefle", price: 14500, stock: 4, feat: true, isNew: 2, badges: ["3 rangs", "Best-seller"],
    mat: "Cristal doré, cœurs nacrés, trèfles noirs et blancs", colors: ["#e8c64a", "#f4f1ea", "#141418"],
    desc: "Cristaux dorés, une chaîne de trèfles noirs et blancs et un rang de cœurs nacrés. Lumineux sur peau foncée." },
  { id: "baya-papillons-trefles", name: "Set Papillons & Trèfles", cat: "baya", sub: "trefle", price: 14500, stock: 3, perso: true, badges: ["3 rangs"],
    mat: "Cristal doré, papillons fumés, trèfles, lettres", colors: ["#e8c64a", "#3a3a48", "#f4f1ea"],
    desc: "Une chaîne de trèfles dorés et deux rangs de papillons fumés portant le message de votre choix." },
  { id: "baya-fuchsia-trefles", name: "Set Fuchsia & Trèfles d'Or", cat: "baya", sub: "trefle", price: 13500, stock: 6, perso: true, badges: ["3 rangs"],
    mat: "Cristal fuchsia, perles dorées, trèfles dorés", colors: ["#d6248a", "#d8ae55"],
    desc: "Cristal fuchsia et or : un rang à votre prénom, un rang doré et une chaîne de trèfles dorés." },
  { id: "baya-rubis-trefles", name: "Set Rubis & Trèfles Rouges", cat: "baya", sub: "trefle", price: 13500, stock: 5, perso: true, badges: ["3 rangs"],
    mat: "Cristal rubis, perles dorées, trèfles émaillés rouges", colors: ["#c8283c", "#d8ae55"],
    desc: "Cristal rouge rubis, perles dorées et chaîne de trèfles rouges. Un rang porte le prénom de votre choix." },
  { id: "baya-lavande", name: "Set Lavande & Papillons", cat: "baya", sub: "prenom", price: 15000, stock: 4, isNew: 2, perso: true, badges: ["4 rangs"],
    mat: "Cristal lavande, papillons, perles nacrées, lettres", colors: ["#8fa3e0", "#f4f1ea", "#e0b07a"],
    desc: "Quatre rangs bleu lavande et cristal, papillons et deux rangs à message, comme « For your eyes only »." },
  { id: "baya-onyx-or", name: "Set Onyx & Or", cat: "baya", sub: "prenom", price: 12500, stock: 6, perso: true, badges: ["3 rangs"],
    mat: "Cristal noir, perles dorées, lettres", colors: ["#141418", "#d8ae55"],
    desc: "Trois rangs noir et or, chacun avec son prénom ou son message. Le set le plus demandé en cadeau." },
  { id: "baya-roses-blanches", name: "Set Roses Blanches", cat: "baya", sub: "prenom", price: 12500, stock: 5, perso: true, badges: ["3 rangs"],
    mat: "Cristal noir et doré, roses blanches, cœurs nacrés", colors: ["#141418", "#e8c64a", "#f4f1ea"],
    desc: "Cristal noir et doré, petites roses blanches et cœurs nacrés, avec un prénom au centre." },
  { id: "baya-azur-coeurs", name: "Set Azur & Cœurs", cat: "baya", sub: "prenom", price: 12000, stock: 6, perso: true, badges: ["3 rangs"],
    mat: "Cristal bleu ciel, cœurs nacrés, lettres", colors: ["#6fb8e8", "#f4f1ea", "#d8ae55"],
    desc: "Deux rangs bleu ciel à message et un rang de cœurs nacrés. Frais et tendre." },
  { id: "baya-rose-poudre", name: "Set Rose Poudré", cat: "baya", sub: "prenom", price: 12000, stock: 7, perso: true, badges: ["3 rangs"],
    mat: "Cristal rose, fleurs roses, étoiles, lettres", colors: ["#f0a8c8", "#d8ae55"],
    desc: "Cristal rose poudré, petites fleurs et étoiles, et votre prénom ou un message comme « I choose me »." },
  { id: "baya-cristal-papillons", name: "Set Cristal & Papillons", cat: "baya", sub: "prenom", price: 12000, stock: 3, perso: true, badges: ["3 rangs"],
    mat: "Cristal irisé, papillons nacrés, lettres", colors: ["#eef2f8", "#c9d8f0"],
    desc: "Trois rangs de cristal irisé qui scintillent, papillons nacrés et un message d'amour au centre." }
];

export const P = RAW.map((p, i) => ({ isNew: 0, badges: [], rank: i + 1, ...p, opts: p.opts || DEFAULT_OPTS[p.cat] }));
