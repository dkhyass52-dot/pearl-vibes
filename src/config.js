/* Réglages de la boutique : numéro WhatsApp, livraison, écrin cadeau. */
export const SHOP = {
  name: "Pearl Vibes",
  whatsapp: "2290194758004",          // ← numéro WhatsApp de la boutique (format international, sans + ni espaces)
  whatsappDisplay: "+229 01 94 75 80 04",
  freeShipping: 50000,
  giftWrap: 2000,
  zones: [
    {id:"cotonou", label:"Cotonou", fee:1000},
    {id:"calavi", label:"Abomey-Calavi", fee:1500},
    {id:"porto", label:"Porto-Novo / Sèmè", fee:2000},
    {id:"benin", label:"Autre ville du Bénin", fee:3000},
    {id:"retrait", label:"Retrait au showroom", fee:0},
    {id:"inter", label:"Hors Bénin (sur devis)", fee:null}
  ]
};
