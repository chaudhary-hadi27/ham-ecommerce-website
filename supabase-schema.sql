-- HAM E-commerce Database Schema
-- Ladies Bags Sample Data with PKR Support
-- Copy and paste this entire file into Supabase SQL Editor

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Products Table (PKR Currency)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discounted_price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id),
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  reviews INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'PKR',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Orders Table (PKR Currency)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'PKR',
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'cod',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_title TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Admin Users Table (Separate from auth.users - No permission issues!)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  user_id UUID,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user's email exists in admin_users table
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies for Categories
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert categories" ON categories;
CREATE POLICY "Only admins can insert categories" ON categories
  FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update categories" ON categories;
CREATE POLICY "Only admins can update categories" ON categories
  FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;
CREATE POLICY "Only admins can delete categories" ON categories
  FOR DELETE USING (is_admin());

-- 9. RLS Policies for Products
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert products" ON products;
CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update products" ON products;
CREATE POLICY "Only admins can update products" ON products
  FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Only admins can delete products" ON products;
CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (is_admin());

-- 10. RLS Policies for Orders
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
CREATE POLICY "Anyone can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own orders or admins can view all" ON orders;
CREATE POLICY "Users can view their own orders or admins can view all" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR is_admin() OR user_id IS NULL
  );

DROP POLICY IF EXISTS "Only admins can update orders" ON orders;
CREATE POLICY "Only admins can update orders" ON orders
  FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Only admins can delete orders" ON orders;
CREATE POLICY "Only admins can delete orders" ON orders
  FOR DELETE USING (is_admin());

-- 11. RLS Policies for Order Items
DROP POLICY IF EXISTS "Anyone can view order items" ON order_items;
CREATE POLICY "Anyone can view order items" ON order_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;
CREATE POLICY "Anyone can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can update order items" ON order_items;
CREATE POLICY "Only admins can update order items" ON order_items
  FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Only admins can delete order items" ON order_items;
CREATE POLICY "Only admins can delete order items" ON order_items
  FOR DELETE USING (is_admin());

-- 12. RLS Policies for Admin Users
DROP POLICY IF EXISTS "Only admins can view admin users" ON admin_users;
CREATE POLICY "Only admins can view admin users" ON admin_users
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Only admins can insert admin users" ON admin_users;
CREATE POLICY "Only admins can insert admin users" ON admin_users
  FOR INSERT WITH CHECK (is_admin());

-- 13. Insert Sample Categories (Ladies Bags)
INSERT INTO categories (title, slug, image) VALUES
('Handbags', 'handbags', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d'),
('Shoulder Bags', 'shoulder-bags', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7'),
('Clutches', 'clutches', 'https://images.unsplash.com/photo-1564422167509-87f8e4c0c9c0'),
('Tote Bags', 'tote-bags', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa'),
('Crossbody Bags', 'crossbody-bags', 'https://images.unsplash.com/photo-1591561954557-26941169b49e'),
('Backpacks', 'backpacks', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62')
ON CONFLICT (slug) DO NOTHING;

-- 14. Insert Sample Products (Ladies Bags Only - PKR Prices)
INSERT INTO products (title, slug, description, price, discounted_price, category_id, category, images, stock, is_featured, reviews, currency) 
SELECT 
  'Elegant Leather Handbag',
  'elegant-leather-handbag',
  'Premium quality leather handbag with spacious interior. Perfect for daily use and special occasions. Features multiple compartments and adjustable strap.',
  8500.00,
  6999.00,
  id,
  'Handbags',
  ARRAY['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3'],
  25,
  true,
  42,
  'PKR'
FROM categories WHERE slug = 'handbags'
UNION ALL
SELECT 
  'Classic Black Handbag',
  'classic-black-handbag',
  'Timeless black handbag made from genuine leather. Ideal for office and formal events. Includes dust bag.',
  7500.00,
  5999.00,
  id,
  'Handbags',
  ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1'],
  30,
  true,
  35,
  'PKR'
FROM categories WHERE slug = 'handbags'
UNION ALL
SELECT 
  'Stylish Shoulder Bag',
  'stylish-shoulder-bag',
  'Modern shoulder bag with chain strap. Lightweight and perfect for evening outings. Available in multiple colors.',
  5500.00,
  4499.00,
  id,
  'Shoulder Bags',
  ARRAY['https://images.unsplash.com/photo-1590874103328-eac38a683ce7'],
  40,
  true,
  56,
  'PKR'
FROM categories WHERE slug = 'shoulder-bags'
UNION ALL
SELECT 
  'Designer Shoulder Bag',
  'designer-shoulder-bag',
  'Premium designer shoulder bag with gold hardware. Features quilted pattern and magnetic closure.',
  9500.00,
  7999.00,
  id,
  'Shoulder Bags',
  ARRAY['https://images.unsplash.com/photo-1591561954557-26941169b49e'],
  20,
  false,
  28,
  'PKR'
FROM categories WHERE slug = 'shoulder-bags'
UNION ALL
SELECT 
  'Party Clutch Gold',
  'party-clutch-gold',
  'Glamorous gold clutch perfect for weddings and parties. Comes with detachable chain strap.',
  3500.00,
  2799.00,
  id,
  'Clutches',
  ARRAY['https://images.unsplash.com/photo-1564422167509-87f8e4c0c9c0'],
  50,
  true,
  67,
  'PKR'
FROM categories WHERE slug = 'clutches'
UNION ALL
SELECT 
  'Evening Clutch Silver',
  'evening-clutch-silver',
  'Elegant silver clutch with crystal embellishments. Perfect for formal events.',
  4000.00,
  3199.00,
  id,
  'Clutches',
  ARRAY['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d'],
  35,
  false,
  45,
  'PKR'
FROM categories WHERE slug = 'clutches'
UNION ALL
SELECT 
  'Canvas Tote Bag',
  'canvas-tote-bag',
  'Spacious canvas tote bag perfect for shopping and daily errands. Eco-friendly and durable.',
  2500.00,
  1999.00,
  id,
  'Tote Bags',
  ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa'],
  60,
  true,
  89,
  'PKR'
FROM categories WHERE slug = 'tote-bags'
UNION ALL
SELECT 
  'Leather Tote Bag',
  'leather-tote-bag',
  'Premium leather tote with laptop compartment. Ideal for working women.',
  6500.00,
  5299.00,
  id,
  'Tote Bags',
  ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1'],
  28,
  false,
  52,
  'PKR'
FROM categories WHERE slug = 'tote-bags'
UNION ALL
SELECT 
  'Mini Crossbody Bag',
  'mini-crossbody-bag',
  'Compact crossbody bag perfect for casual outings. Features adjustable strap and zip closure.',
  3500.00,
  2899.00,
  id,
  'Crossbody Bags',
  ARRAY['https://images.unsplash.com/photo-1591561954557-26941169b49e'],
  45,
  true,
  73,
  'PKR'
FROM categories WHERE slug = 'crossbody-bags'
UNION ALL
SELECT 
  'Vintage Crossbody Bag',
  'vintage-crossbody-bag',
  'Stylish vintage-inspired crossbody with tassel details. Perfect for everyday use.',
  4500.00,
  3699.00,
  id,
  'Crossbody Bags',
  ARRAY['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d'],
  33,
  false,
  41,
  'PKR'
FROM categories WHERE slug = 'crossbody-bags'
UNION ALL
SELECT 
  'Ladies Fashion Backpack',
  'ladies-fashion-backpack',
  'Trendy mini backpack perfect for college and casual wear. Multiple pockets and comfortable straps.',
  4000.00,
  3299.00,
  id,
  'Backpacks',
  ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62'],
  38,
  true,
  61,
  'PKR'
FROM categories WHERE slug = 'backpacks'
UNION ALL
SELECT 
  'Leather Backpack Premium',
  'leather-backpack-premium',
  'High-quality leather backpack with laptop sleeve. Professional and stylish.',
  7000.00,
  5799.00,
  id,
  'Backpacks',
  ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa'],
  22,
  false,
  38,
  'PKR'
FROM categories WHERE slug = 'backpacks'
ON CONFLICT (slug) DO NOTHING;

-- 15. Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'HAM-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 16. Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- 17. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 18. Add updated_at triggers
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ✅ DATABASE SETUP COMPLETE!
-- 
-- 🇵🇰 PKR Currency Support: All prices in Pakistani Rupees
-- 
-- What's included:
-- ✅ 6 Categories (Ladies Bags)
-- ✅ 12 Sample Products (PKR Prices: Rs. 1,999 - Rs. 7,999)
-- ✅ Full Admin Control via admin_users table (No auth.users permission issues!)
-- ✅ Auto-generated order numbers (HAM-20250131-1234)
-- ✅ Currency field (PKR by default, can add USD/EUR later)
--
-- 🔐 IMPORTANT - Create Your Admin Account:
-- After creating a user in Supabase Authentication, run this:
--
-- INSERT INTO admin_users (email, user_id) VALUES ('your-email@example.com', 'user-uuid-from-auth');
-- 
-- Or just use email:
-- INSERT INTO admin_users (email) VALUES ('admin@ham.com');
--
-- This will give admin access! 🚀
