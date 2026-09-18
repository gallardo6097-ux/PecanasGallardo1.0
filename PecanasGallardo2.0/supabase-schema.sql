-- =============================================
-- PECANAS GALLARDO - Supabase Schema
-- =============================================
-- Copia y pega este script completo en el
-- SQL Editor de tu panel de Supabase y ejecútalo.
-- =============================================

-- 1. TABLA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT 'fa-solid fa-tag',
  display_order INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLA DE PRODUCTOS
CREATE TABLE IF NOT EXISTS products (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  origin          TEXT NOT NULL DEFAULT 'Ica, Perú',
  image_url       TEXT NOT NULL DEFAULT '',
  prices          JSONB NOT NULL DEFAULT '{}',
  default_variant TEXT,
  specs           JSONB NOT NULL DEFAULT '[]',
  display_order   INTEGER NOT NULL DEFAULT 0,
  active          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 3. INDEX para búsquedas rápidas por categoría
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active   ON products(active);
CREATE INDEX IF NOT EXISTS idx_categories_slug   ON categories(slug);

-- 4. ROW LEVEL SECURITY (RLS) - Lectura pública
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;

-- Permitir lectura anónima (la tienda pública solo lee)
CREATE POLICY "Allow public read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read products"
  ON products FOR SELECT
  USING (true);

-- Permitir escritura solo a usuarios autenticados (admin)
CREATE POLICY "Allow authenticated insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update categories"
  ON categories FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete categories"
  ON categories FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

-- 5. DATOS DE EJEMPLO (seed)
INSERT INTO categories (slug, name, icon, display_order) VALUES
  ('frutos-secos',          'Frutos Secos',          'fa-solid fa-seedling',          1),
  ('menestras',             'Menestras',             'fa-solid fa-bowl-food',         2),
  ('frutos-deshidratados',  'Frutos Deshidratados',  'fa-solid fa-apple-whole',       3),
  ('aceites',               'Aceites',               'fa-solid fa-bottle-droplet',    4),
  ('lacteos',               'Lácteos',               'fa-solid fa-cheese',            5),
  ('galletas',              'Galletas',              'fa-solid fa-cookie',            6)
ON CONFLICT (slug) DO NOTHING;

-- Productos de ejemplo: Frutos Secos
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'frutos-secos';

  INSERT INTO products (category_id, name, origin, image_url, prices, default_variant, specs, display_order) VALUES
    (cat_id, 'Pecana Pelada Premium', 'Ica, Perú', 'https://placehold.co/600x400/8B6914/FFFFFF?text=Pecana+Pelada',
     '{"250g":28,"500g":55,"1kg":100}', '500g',
     '[["Nombre científico","Carya illinoinensis"],["Presentaciones","250 g · 500 g · 1 kg"],["Vida útil","6 meses en envase cerrado"],["Sin conservantes ni aditivos",""]]', 1),

    (cat_id, 'Pecana en Cáscara Artesanal', 'Ica, Perú', 'https://placehold.co/600x400/6B4E1F/FFFFFF?text=Pecana+Cáscara',
     '{"250g":32,"500g":60,"1kg":110}', '500g',
     '[["Nombre científico","Carya illinoinensis"],["Presentaciones","250 g · 500 g · 1 kg"],["Vida útil","8 meses en envase cerrado"],["Sin conservantes ni aditivos",""]]', 2),

    (cat_id, 'Pecana Jumbo Exportación', 'Ica, Perú', 'https://placehold.co/600x400/4A2E1B/FFFFFF?text=Pecana+Jumbo',
     '{"250g":40,"500g":70,"1kg":130}', '500g',
     '[["Nombre científico","Carya illinoinensis"],["Presentaciones","250 g · 500 g · 1 kg"],["Vida útil","8 meses en envase cerrado"],["Sin conservantes ni aditivos",""]]', 3),

    (cat_id, 'Almendras Tostadas sin Sal', 'Ica, Perú', 'https://placehold.co/600x400/A67C52/FFFFFF?text=Almendras',
     '{"250g":25,"500g":45,"1kg":85}', '500g',
     '[["Nombre científico","Prunus dulcis"],["Presentaciones","250 g · 500 g · 1 kg"],["Vida útil","6 meses en envase cerrado"],["Sin conservantes ni aditivos",""]]', 4),

    (cat_id, 'Nueces peruanas Premium', 'Ica, Perú', 'https://placehold.co/600x400/5C4033/FFFFFF?text=Nueces',
     '{"250g":28,"500g":50,"1kg":95}', '500g',
     '[["Nombre científico","Juglans regia"],["Presentaciones","250 g · 500 g · 1 kg"],["Vida útil","6 meses en envase cerrado"],["Sin conservantes ni aditivos",""]]', 5),

    (cat_id, 'Mix Tropical Premium', 'Ica, Perú', 'https://placehold.co/600x400/2E6F40/FFFFFF?text=Mix+Tropical',
     '{"250g":35,"500g":65,"1kg":120}', '500g',
     '[["Contenido","Pecanas, almendras, nueces, marañón"],["Presentaciones","250 g · 500 g · 1 kg"],["Vida útil","6 meses en envase cerrado"],["Sin conservantes ni aditivos",""]]', 6);
END $$;

-- Productos de ejemplo: Menestras
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'menestras';

  INSERT INTO products (category_id, name, origin, image_url, prices, default_variant, specs, display_order) VALUES
    (cat_id, 'Garbanzos Selectos', 'Ica, Perú', 'https://placehold.co/600x400/C4A35A/FFFFFF?text=Garbanzos',
     '{"250g":12,"500g":22,"1kg":40}', '500g',
     '[["Tipo","Garbanzo"],["Origen","Valle de Ica"],["Presentaciones","250 g · 500 g · 1 kg"],["Sin aditivos",""]]', 1),

    (cat_id, 'Lentejas Pilco', 'Ica, Perú', 'https://placehold.co/600x400/8B6508/FFFFFF?text=Lentejas',
     '{"250g":10,"500g":18,"1kg":32}', '500g',
     '[["Tipo","Lenteja roja"],["Origen","Valle de Ica"],["Presentaciones","250 g · 500 g · 1 kg"],["Sin aditivos",""]]', 2),

    (cat_id, 'Frejoles Canarios', 'Ica, Perú', 'https://placehold.co/600x400/D4A017/FFFFFF?text=Frejoles',
     '{"250g":11,"500g":20,"1kg":36}', '500g',
     '[["Tipo","Frejol canario"],["Origen","Valle de Ica"],["Presentaciones","250 g · 500 g · 1 kg"],["Sin aditivos",""]]', 3),

    (cat_id, 'Caraotas Negras', 'Ica, Perú', 'https://placehold.co/600x400/2C2C2C/FFFFFF?text=Caraotas',
     '{"250g":10,"500g":18,"1kg":33}', '500g',
     '[["Tipo","Caraota negra"],["Origen","Valle de Ica"],["Presentaciones","250 g · 500 g · 1 kg"],["Sin aditivos",""]]', 4);
END $$;

-- Productos de ejemplo: Frutos Deshidratados
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'frutos-deshidratados';

  INSERT INTO products (category_id, name, origin, image_url, prices, default_variant, specs, display_order) VALUES
    (cat_id, 'Pasas sin Semilla', 'Ica, Perú', 'https://placehold.co/600x400/8B4513/FFFFFF?text=Pasas',
     '{"250g":18,"500g":33,"1kg":60}', '500g',
     '[["Tipo","Uva pasas blanca"],["Proceso","Deshidratado solar"],["Presentaciones","250 g · 500 g · 1 kg"],["Sin azúcar añadida",""]]', 1),

    (cat_id, 'Durazno Deshidratado', 'Ica, Perú', 'https://placehold.co/600x400/FF8C00/FFFFFF?text=Durazno',
     '{"250g":20,"500g":38,"1kg":70}', '500g',
     '[["Tipo","Durazno natural"],["Proceso","Deshidratado"],["Presentaciones","250 g · 500 g · 1 kg"],["Sin conservantes",""]]', 2),

    (cat_id, 'Choclo Deshidratado', 'Ica, Perú', 'https://placehold.co/600x400/DAA520/FFFFFF?text=Choclo',
     '{"250g":15,"500g":28,"1kg":50}', '500g',
     '[["Tipo","Choclo cancha"],["Proceso","Deshidratado"],["Presentaciones","250 g · 500 g · 1 kg"],["Sin conservantes",""]]', 3),

    (cat_id, 'Manzana Deshidratada', 'Ica, Perú', 'https://placehold.co/600x400/DC143C/FFFFFF?text=Manzana',
     '{"250g":22,"500g":42,"1kg":78}', '500g',
     '[["Tipo","Manzana roja"],["Proceso","Deshidratada al horno"],["Presentaciones","250 g · 500 g · 1 kg"],["Sin azúcar",""]]', 4);
END $$;

-- Productos de ejemplo: Aceites
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'aceites';

  INSERT INTO products (category_id, name, origin, image_url, prices, default_variant, specs, display_order) VALUES
    (cat_id, 'Aceite de Oliva Extra Virgen', 'Ica, Perú', 'https://placehold.co/600x400/556B2F/FFFFFF?text=Aceite+Oliva',
     '{"250ml":35,"500ml":65,"1L":120}', '500ml',
     '[["Tipo","Extra virgen"],["Proceso","Primera prensada en frío"],["Presentaciones","250 ml · 500 ml · 1 L"],["100% natural",""]]', 1),

    (cat_id, 'Aceite de Aguacate', 'Ica, Perú', 'https://placehold.co/600x400/228B22/FFFFFF?text=Aceite+Aguacate',
     '{"250ml":40,"500ml":75,"1L":140}', '500ml',
     '[["Tipo","Extra virgen"],["Proceso","Prensado en frío"],["Presentaciones","250 ml · 500 ml · 1 L"],["Sin refinar",""]]', 2),

    (cat_id, 'Aceite de Linaza', 'Ica, Perú', 'https://placehold.co/600x400/B8860B/FFFFFF?text=Aceite+Linaza',
     '{"250ml":30,"500ml":55,"1L":100}', '500ml',
     '[["Tipo","Virgen"],["Rico en Omega 3",""],["Presentaciones","250 ml · 500 ml · 1 L"],["Sin aditivos",""]]', 3);
END $$;

-- Productos de ejemplo: Lácteos
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'lacteos';

  INSERT INTO products (category_id, name, origin, image_url, prices, default_variant, specs, display_order) VALUES
    (cat_id, 'Queso Fresco Campesino', 'Ica, Perú', 'https://placehold.co/600x400/FFFDD0/333333?text=Queso+Fresco',
     '{"250g":15,"500g":28,"1kg":52}', '500g',
     '[["Tipo","Queso fresco"],["Elaboración","Artesanal, leche de vaca"],["Presentaciones","250 g · 500 g · 1 kg"],["Refrigerar",""]]', 1),

    (cat_id, 'Mantequilla Natural', 'Ica, Perú', 'https://placehold.co/600x400/FFFACD/333333?text=Mantequilla',
     '{"250g":18,"500g":34,"1kg":62}', '500g',
     '[["Tipo","Mantequilla sin sal"],["Elaboración","Artesanal"],["Presentaciones","250 g · 500 g · 1 kg"],["Sin preservantes",""]]', 2),

    (cat_id, 'Yogur Natural de Vaca', 'Ica, Perú', 'https://placehold.co/600x400/F0F8FF/333333?text=Yogur',
     '{"250g":8,"500g":15,"1L":28}', '500g',
     '[["Tipo","Yogur natural"],["Elaboración","Con cultivos vivos"],["Presentaciones","250 g · 500 g · 1 L"],["Sin conservantes",""]]', 3);
END $$;

-- Productos de ejemplo: Galletas
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'galletas';

  INSERT INTO products (category_id, name, origin, image_url, prices, default_variant, specs, display_order) VALUES
    (cat_id, 'Galletas de Avena con Miel', 'Ica, Perú', 'https://placehold.co/600x400/DEB887/333333?text=Galletas+Avena',
     '{"250g":12,"500g":22,"1kg":40}', '500g',
     '[["Tipo","Galleta artesanal"],["Ingredientes","Avena, miel, mantequilla"],["Presentaciones","250 g · 500 g · 1 kg"],["Sin conservantes",""]]', 1),

    (cat_id, 'Galletas de Pecana', 'Ica, Perú', 'https://placehold.co/600x400/8B6914/FFFFFF?text=Galletas+Pecana',
     '{"250g":15,"500g":28,"1kg":52}', '500g',
     '[["Tipo","Galleta premium"],["Ingredientes","Pecana, harina, huevo"],["Presentaciones","250 g · 500 g · 1 kg"],["Artesanales",""]]', 2),

    (cat_id, 'Galletas Integrales de Centeno', 'Ica, Perú', 'https://placehold.co/600x400/A0522D/FFFFFF?text=Centeno',
     '{"250g":11,"500g":20,"1kg":36}', '500g',
     '[["Tipo","Galleta integral"],["Ingredientes","Centeno, avena, semillas"],["Presentaciones","250 g · 500 g · 1 kg"],["Baja en azúcar",""]]', 3);
END $$;
