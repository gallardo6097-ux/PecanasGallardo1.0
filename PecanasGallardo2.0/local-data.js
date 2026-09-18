// =============================================
// PECANAS GALLARDO - Local Fallback Data
// =============================================
// Estos datos se usan SOLO cuando Supabase no
// está configurado o no responde. Para agregar
// o quitar productos, usa el panel de Supabase.
// =============================================

var LOCAL_CATEGORIES = [
  { slug: 'frutos-secos',          name: 'Frutos Secos',          icon: 'fa-solid fa-seedling',        display_order: 1 },
  { slug: 'menestras',             name: 'Menestras',             icon: 'fa-solid fa-bowl-food',       display_order: 2 },
  { slug: 'frutos-deshidratados',  name: 'Frutos Deshidratados',  icon: 'fa-solid fa-apple-whole',     display_order: 3 },
  { slug: 'aceites',               name: 'Aceites',               icon: 'fa-solid fa-bottle-droplet',  display_order: 4 },
  { slug: 'lacteos',               name: 'Lácteos',               icon: 'fa-solid fa-cheese',          display_order: 5 },
  { slug: 'galletas',              name: 'Galletas',              icon: 'fa-solid fa-cookie',          display_order: 6 }
];

var LOCAL_PRODUCTS = {
  'frutos-secos': [
    { name: 'Pecana Pelada Premium', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/8B6914/FFFFFF?text=Pecana+Pelada', prices: { '250g': 28, '500g': 55, '1kg': 100 }, defaultVariant: '500g', specs: [['Nombre científico','Carya illinoinensis'],['Presentaciones','250 g · 500 g · 1 kg'],['Vida útil','6 meses en envase cerrado'],['Sin conservantes ni aditivos','']] },
    { name: 'Pecana en Cáscara Artesanal', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/6B4E1F/FFFFFF?text=Pecana+Cáscara', prices: { '250g': 32, '500g': 60, '1kg': 110 }, defaultVariant: '500g', specs: [['Nombre científico','Carya illinoinensis'],['Presentaciones','250 g · 500 g · 1 kg'],['Vida útil','8 meses en envase cerrado'],['Sin conservantes ni aditivos','']] },
    { name: 'Pecana Jumbo Exportación', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/4A2E1B/FFFFFF?text=Pecana+Jumbo', prices: { '250g': 40, '500g': 70, '1kg': 130 }, defaultVariant: '500g', specs: [['Nombre científico','Carya illinoinensis'],['Presentaciones','250 g · 500 g · 1 kg'],['Vida útil','8 meses en envase cerrado'],['Sin conservantes ni aditivos','']] },
    { name: 'Almendras Tostadas sin Sal', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/A67C52/FFFFFF?text=Almendras', prices: { '250g': 25, '500g': 45, '1kg': 85 }, defaultVariant: '500g', specs: [['Nombre científico','Prunus dulcis'],['Presentaciones','250 g · 500 g · 1 kg'],['Vida útil','6 meses en envase cerrado'],['Sin conservantes ni aditivos','']] },
    { name: 'Nueces peruanas Premium', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/5C4033/FFFFFF?text=Nueces', prices: { '250g': 28, '500g': 50, '1kg': 95 }, defaultVariant: '500g', specs: [['Nombre científico','Juglans regia'],['Presentaciones','250 g · 500 g · 1 kg'],['Vida útil','6 meses en envase cerrado'],['Sin conservantes ni aditivos','']] },
    { name: 'Mix Tropical Premium', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/2E6F40/FFFFFF?text=Mix+Tropical', prices: { '250g': 35, '500g': 65, '1kg': 120 }, defaultVariant: '500g', specs: [['Contenido','Pecanas, almendras, nueces, marañón'],['Presentaciones','250 g · 500 g · 1 kg'],['Vida útil','6 meses en envase cerrado'],['Sin conservantes ni aditivos','']] }
  ],
  'menestras': [
    { name: 'Garbanzos Selectos', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/C4A35A/FFFFFF?text=Garbanzos', prices: { '250g': 12, '500g': 22, '1kg': 40 }, defaultVariant: '500g', specs: [['Tipo','Garbanzo'],['Origen','Valle de Ica'],['Presentaciones','250 g · 500 g · 1 kg'],['Sin aditivos','']] },
    { name: 'Lentejas Pilco', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/8B6508/FFFFFF?text=Lentejas', prices: { '250g': 10, '500g': 18, '1kg': 32 }, defaultVariant: '500g', specs: [['Tipo','Lenteja roja'],['Origen','Valle de Ica'],['Presentaciones','250 g · 500 g · 1 kg'],['Sin aditivos','']] },
    { name: 'Frejoles Canarios', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/D4A017/FFFFFF?text=Frejoles', prices: { '250g': 11, '500g': 20, '1kg': 36 }, defaultVariant: '500g', specs: [['Tipo','Frejol canario'],['Origen','Valle de Ica'],['Presentaciones','250 g · 500 g · 1 kg'],['Sin aditivos','']] },
    { name: 'Caraotas Negras', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/2C2C2C/FFFFFF?text=Caraotas', prices: { '250g': 10, '500g': 18, '1kg': 33 }, defaultVariant: '500g', specs: [['Tipo','Caraota negra'],['Origen','Valle de Ica'],['Presentaciones','250 g · 500 g · 1 kg'],['Sin aditivos','']] }
  ],
  'frutos-deshidratados': [
    { name: 'Pasas sin Semilla', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/8B4513/FFFFFF?text=Pasas', prices: { '250g': 18, '500g': 33, '1kg': 60 }, defaultVariant: '500g', specs: [['Tipo','Uva pasas blanca'],['Proceso','Deshidratado solar'],['Presentaciones','250 g · 500 g · 1 kg'],['Sin azúcar añadida','']] },
    { name: 'Durazno Deshidratado', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/FF8C00/FFFFFF?text=Durazno', prices: { '250g': 20, '500g': 38, '1kg': 70 }, defaultVariant: '500g', specs: [['Tipo','Durazno natural'],['Proceso','Deshidratado'],['Presentaciones','250 g · 500 g · 1 kg'],['Sin conservantes','']] },
    { name: 'Choclo Deshidratado', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/DAA520/FFFFFF?text=Choclo', prices: { '250g': 15, '500g': 28, '1kg': 50 }, defaultVariant: '500g', specs: [['Tipo','Choclo cancha'],['Proceso','Deshidratado'],['Presentaciones','250 g · 500 g · 1 kg'],['Sin conservantes','']] },
    { name: 'Manzana Deshidratada', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/DC143C/FFFFFF?text=Manzana', prices: { '250g': 22, '500g': 42, '1kg': 78 }, defaultVariant: '500g', specs: [['Tipo','Manzana roja'],['Proceso','Deshidratada al horno'],['Presentaciones','250 g · 500 g · 1 kg'],['Sin azúcar','']] }
  ],
  'aceites': [
    { name: 'Aceite de Oliva Extra Virgen', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/556B2F/FFFFFF?text=Aceite+Oliva', prices: { '250ml': 35, '500ml': 65, '1L': 120 }, defaultVariant: '500ml', specs: [['Tipo','Extra virgen'],['Proceso','Primera prensada en frío'],['Presentaciones','250 ml · 500 ml · 1 L'],['100% natural','']] },
    { name: 'Aceite de Aguacate', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/228B22/FFFFFF?text=Aceite+Aguacate', prices: { '250ml': 40, '500ml': 75, '1L': 140 }, defaultVariant: '500ml', specs: [['Tipo','Extra virgen'],['Proceso','Prensado en frío'],['Presentaciones','250 ml · 500 ml · 1 L'],['Sin refinar','']] },
    { name: 'Aceite de Linaza', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/B8860B/FFFFFF?text=Aceite+Linaza', prices: { '250ml': 30, '500ml': 55, '1L': 100 }, defaultVariant: '500ml', specs: [['Tipo','Virgen'],['Rico en Omega 3',''],['Presentaciones','250 ml · 500 ml · 1 L'],['Sin aditivos','']] }
  ],
  'lacteos': [
    { name: 'Queso Fresco Campesino', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/FFFDD0/333333?text=Queso+Fresco', prices: { '250g': 15, '500g': 28, '1kg': 52 }, defaultVariant: '500g', specs: [['Tipo','Queso fresco'],['Elaboración','Artesanal, leche de vaca'],['Presentaciones','250 g · 500 g · 1 kg'],['Refrigerar','']] },
    { name: 'Mantequilla Natural', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/FFFACD/333333?text=Mantequilla', prices: { '250g': 18, '500g': 34, '1kg': 62 }, defaultVariant: '500g', specs: [['Tipo','Mantequilla sin sal'],['Elaboración','Artesanal'],['Presentaciones','250 g · 500 g · 1 kg'],['Sin preservantes','']] },
    { name: 'Yogur Natural de Vaca', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/F0F8FF/333333?text=Yogur', prices: { '250g': 8, '500g': 15, '1L': 28 }, defaultVariant: '500g', specs: [['Tipo','Yogur natural'],['Elaboración','Con cultivos vivos'],['Presentaciones','250 g · 500 g · 1 L'],['Sin conservantes','']] }
  ],
  'galletas': [
    { name: 'Galletas de Avena con Miel', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/DEB887/333333?text=Galletas+Avena', prices: { '250g': 12, '500g': 22, '1kg': 40 }, defaultVariant: '500g', specs: [['Tipo','Galleta artesanal'],['Ingredientes','Avena, miel, mantequilla'],['Presentaciones','250 g · 500 g · 1 kg'],['Sin conservantes','']] },
    { name: 'Galletas de Pecana', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/8B6914/FFFFFF?text=Galletas+Pecana', prices: { '250g': 15, '500g': 28, '1kg': 52 }, defaultVariant: '500g', specs: [['Tipo','Galleta premium'],['Ingredientes','Pecana, harina, huevo'],['Presentaciones','250 g · 500 g · 1 kg'],['Artesanales','']] },
    { name: 'Galletas Integrales de Centeno', origin: 'Ica, Perú', img: 'https://placehold.co/600x400/A0522D/FFFFFF?text=Centeno', prices: { '250g': 11, '500g': 20, '1kg': 36 }, defaultVariant: '500g', specs: [['Tipo','Galleta integral'],['Ingredientes','Centeno, avena, semillas'],['Presentaciones','250 g · 500 g · 1 kg'],['Baja en azúcar','']] }
  ]
};
