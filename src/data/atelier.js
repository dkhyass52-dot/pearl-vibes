/* Perles et types de pièces proposés dans l'Atelier sur mesure. */
export const BEADS=[
  {id:"perle",name:"Perle nacrée",c:"#efe8da",hi:"#ffffff",type:"nacre",p:400},
  {id:"champagne",name:"Perle champagne",c:"#e3cfa6",hi:"#fff6df",type:"nacre",p:400},
  {id:"rosee",name:"Perle rosée",c:"#efc9c4",hi:"#fff1ef",type:"nacre",p:400},
  {id:"or",name:"Bille d'or",c:"#d4a440",hi:"#fff1be",type:"metal",p:350},
  {id:"corail",name:"Corail",c:"#c8402a",hi:"#ff9b80",type:"pierre",p:500},
  {id:"cornaline",name:"Cornaline",c:"#d9702f",hi:"#ffc08a",type:"verre",p:350},
  {id:"jade",name:"Jade",c:"#4f8a5e",hi:"#bdf0cb",type:"pierre",p:350},
  {id:"lagon",name:"Lagon",c:"#1f8fa8",hi:"#a9ecf7",type:"verre",p:300},
  {id:"amethyste",name:"Améthyste",c:"#7b4fa6",hi:"#e1c6ff",type:"pierre",p:450},
  {id:"onyx",name:"Onyx",c:"#16161c",hi:"#8a8aa0",type:"pierre",p:350}
];
export const KIND={bracelet:{min:14,max:22,step:.5,def:17,base:2000,hint:"tour de poignet",label:"Bracelet sur mesure"},baya:{min:55,max:130,step:1,def:80,base:1500,hint:"tour de taille ou de hanches",label:"Baya sur mesure"},collier:{min:38,max:60,step:1,def:45,base:3000,hint:"longueur du collier",label:"Collier sur mesure"}};
