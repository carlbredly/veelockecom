-- ============================================================
-- VEE LOCS ORGANIC — Supabase Schema
-- Exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Profiles (liés à auth.users) ──────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name     TEXT,
  role     TEXT NOT NULL DEFAULT 'CLIENT' CHECK (role IN ('ADMIN', 'CLIENT')),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Créer le profil automatiquement à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT')
  );
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ── Products ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  short_description TEXT,
  description      TEXT,
  category         TEXT DEFAULT 'oil',
  ingredients      TEXT[] DEFAULT '{}',
  hair_types       TEXT[] DEFAULT '{}',
  images           TEXT[] DEFAULT '{}',
  is_active        BOOLEAN DEFAULT true,
  featured         BOOLEAN DEFAULT false,
  stock            INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (true);
CREATE POLICY "Only admins can insert products" ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Only admins can update products" ON products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Only admins can delete products" ON products FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ── Product Variants ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_variants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size       TEXT NOT NULL,
  price      NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Variants are publicly readable" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Only admins can manage variants" ON product_variants
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- ── Customers ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  address    TEXT,
  city       TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all customers" ON customers FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Anyone can insert a customer" ON customers FOR INSERT WITH CHECK (true);

-- ── Orders ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number   TEXT UNIQUE NOT NULL,
  customer_id    UUID REFERENCES customers(id),
  total          NUMERIC NOT NULL,
  status         TEXT NOT NULL DEFAULT 'PENDING'
                   CHECK (status IN ('PENDING','PAYMENT_RECEIVED','PROCESSING','SHIPPED','DELIVERED','CANCELLED')),
  notes          TEXT,
  payment_method TEXT,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Anyone can insert an order" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
-- Permettre la recherche par numéro de commande ou téléphone (sans auth)
CREATE POLICY "Public can read orders by number" ON orders FOR SELECT USING (true);

-- ── Order Items ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id),
  product_name  TEXT NOT NULL,
  variant_size  TEXT NOT NULL,
  variant_price NUMERIC NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 1
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order items publicly readable" ON order_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- ── Status History ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS status_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status     TEXT NOT NULL,
  note       TEXT,
  changed_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Status history publicly readable" ON status_history FOR SELECT USING (true);
CREATE POLICY "Anyone can insert status history" ON status_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update status history" ON status_history FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ── Testimonials ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  location   TEXT,
  comment    TEXT NOT NULL,
  rating     INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active testimonials publicly readable" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- updated_at automatique sur orders
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- SEED DATA — Produits initiaux
-- ============================================================
INSERT INTO products (name, short_description, description, category, ingredients, hair_types, images, is_active, featured, stock)
VALUES
(
  'Vee Locs Original Hair Oil',
  'The signature formula — pure nourishment for every hair type.',
  'Our flagship formula blends 8 premium African oils to deeply nourish, strengthen and add luminous shine to all hair types. Perfect as a daily treatment or pre-shampoo oil.',
  'oil',
  ARRAY['Argan Oil', 'Castor Oil', 'Coconut Oil', 'Vitamin E', 'Jojoba Oil', 'Rosemary Extract', 'Black Seed Oil', 'Avocado Oil'],
  ARRAY['Locs', 'Natural', 'Braids', 'Relaxed', 'All Types'],
  ARRAY['/oil.png'],
  true, true, 50
),
(
  'Vee Locs Growth Oil',
  'Supercharge hair growth with our potent botanical blend.',
  'Formulated with growth-stimulating botanicals and scalp-activating oils to visibly increase hair length in 4–6 weeks. Ideal for thin edges and slow-growing hair.',
  'growth',
  ARRAY['Peppermint Oil', 'Castor Oil', 'Black Seed Oil', 'Rosemary Oil', 'Biotin Complex', 'Vitamin E', 'Tea Tree Oil'],
  ARRAY['Natural', 'Locs', 'Braids', 'All Types'],
  ARRAY['/oil.png'],
  true, true, 35
),
(
  'Vee Locs Scalp Treatment',
  'Deep-cleansing scalp oil that balances and soothes.',
  'Targeted scalp care that clears build-up, soothes irritation and creates the optimal environment for healthy hair growth. Lightweight formula absorbs quickly.',
  'scalp',
  ARRAY['Tea Tree Oil', 'Peppermint Oil', 'Aloe Vera', 'Zinc', 'Salicylic Acid', 'Neem Oil', 'Lavender Oil'],
  ARRAY['Natural', 'Relaxed', 'Long', 'Straight'],
  ARRAY['/oil.png'],
  true, false, 28
),
(
  'Vee Locs Shine & Ends Oil',
  'Lightweight serum for glass-like shine and sealed ends.',
  'A feather-light finishing oil that seals split ends, eliminates frizz and delivers a mirror-like shine without greasiness. Your secret weapon for runway-ready hair.',
  'shine',
  ARRAY['Argan Oil', 'Grapeseed Oil', 'Jojoba Oil', 'Vitamin E', 'Silk Proteins', 'Sunflower Oil'],
  ARRAY['Long', 'Straight', 'Relaxed', 'Natural'],
  ARRAY['/oil.png'],
  true, true, 42
),
(
  'Vee Locs Complete Trio',
  'The full Vee Locs ritual — Original, Growth & Scalp in one bundle.',
  'Get the complete Vee Locs experience at a special bundle price. Includes our Original Hair Oil, Growth Oil and Scalp Treatment — everything you need for a transformative hair care routine.',
  'bundle',
  ARRAY['All ingredients from the three products combined'],
  ARRAY['All Types', 'Locs', 'Natural', 'Braids', 'Relaxed'],
  ARRAY['/oil.png'],
  true, true, 20
);

-- Ajouter les variantes pour chaque produit
DO $$
DECLARE
  p_id UUID;
BEGIN
  -- Original Oil
  SELECT id INTO p_id FROM products WHERE name = 'Vee Locs Original Hair Oil';
  INSERT INTO product_variants (product_id, size, price) VALUES
    (p_id, '50ml', 5000), (p_id, '100ml', 8500), (p_id, '200ml', 14000);

  -- Growth Oil
  SELECT id INTO p_id FROM products WHERE name = 'Vee Locs Growth Oil';
  INSERT INTO product_variants (product_id, size, price) VALUES
    (p_id, '50ml', 6000), (p_id, '100ml', 10000), (p_id, '200ml', 17000);

  -- Scalp Treatment
  SELECT id INTO p_id FROM products WHERE name = 'Vee Locs Scalp Treatment';
  INSERT INTO product_variants (product_id, size, price) VALUES
    (p_id, '100ml', 9500), (p_id, '200ml', 16000);

  -- Shine & Ends
  SELECT id INTO p_id FROM products WHERE name = 'Vee Locs Shine & Ends Oil';
  INSERT INTO product_variants (product_id, size, price) VALUES
    (p_id, '50ml', 5500), (p_id, '100ml', 9000);

  -- Bundle
  SELECT id INTO p_id FROM products WHERE name = 'Vee Locs Complete Trio';
  INSERT INTO product_variants (product_id, size, price) VALUES
    (p_id, 'Trio 3 × 100ml', 25000);
END $$;

-- Témoignages initiaux
INSERT INTO testimonials (name, location, comment, rating, is_active) VALUES
  ('Aminata K.', 'Abidjan, CI', 'My locs have never been this moisturized! After just 2 weeks of using the Original Oil, I noticed a huge difference in softness and shine.', 5, true),
  ('Fatou D.', 'Dakar, SN', 'I was skeptical at first but the Growth Oil truly works. My edges are filling in and my hair has grown noticeably in 6 weeks.', 5, true),
  ('Chantal M.', 'Douala, CM', 'The Scalp Treatment is a game changer for my dry scalp. The itching stopped after the first use and my hair feels clean without being stripped.', 5, true),
  ('Awa T.', 'Bamako, ML', 'Worth every franc! The whole trio transformed my hair routine. I finally found a brand that actually understands afro hair.', 5, true);
