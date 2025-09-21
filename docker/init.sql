-- Initialize Sweet Shop Database
-- This script sets up the production PostgreSQL database

-- Create database if not exists (handled by Docker)
-- CREATE DATABASE sweetshop;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sweets table
CREATE TABLE IF NOT EXISTS sweets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create purchases table for order history
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sweet_id UUID REFERENCES sweets(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sweets_category ON sweets(category);
CREATE INDEX IF NOT EXISTS idx_sweets_name ON sweets(name);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_sweet_id ON purchases(sweet_id);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sweets_updated_at ON sweets;
CREATE TRIGGER update_sweets_updated_at 
    BEFORE UPDATE ON sweets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, role) VALUES 
    ('admin@sweetshop.com', '$2a$10$8Wsa.vLhQV8gXl8xhz.Bh.2y1xMJkmBRZQK9cZn.KQ7vgXjN7zY7i', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample sweets data
INSERT INTO sweets (name, category, price, quantity, description, image_url) VALUES
    ('Chocolate Chip Cookies', 'Cookies', 2.99, 50, 'Delicious homemade chocolate chip cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
    ('Red Velvet Cupcake', 'Cupcakes', 3.49, 30, 'Rich red velvet cupcake with cream cheese frosting', 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400'),
    ('Dark Chocolate Bar', 'Chocolate', 4.99, 25, 'Premium 70% dark chocolate bar', 'https://images.unsplash.com/photo-1506124728058-7b4d6dc8e94e?w=400'),
    ('Strawberry Gummy Bears', 'Gummies', 1.99, 75, 'Sweet and chewy strawberry flavored gummy bears', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400'),
    ('Vanilla Macarons', 'Macarons', 12.99, 20, 'Box of 6 delicate vanilla macarons', 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400'),
    ('Caramel Lollipops', 'Lollipops', 0.99, 100, 'Handcrafted caramel lollipops', 'https://images.unsplash.com/photo-1603893603637-80ac0bd48b64?w=400'),
    ('Mint Chocolate Truffles', 'Chocolate', 8.99, 15, 'Luxurious mint chocolate truffles', 'https://images.unsplash.com/photo-1549042256-0e9c4b0d9e3f?w=400'),
    ('Rainbow Sour Strips', 'Sour Candy', 2.49, 60, 'Tangy rainbow colored sour strips', 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400')
ON CONFLICT DO NOTHING;
