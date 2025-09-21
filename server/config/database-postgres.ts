import { Pool, PoolClient, QueryResult } from 'pg';
import bcrypt from 'bcryptjs';

// Database connection pool
let pool: Pool;

// Database interface
export interface DbHelpers {
  // User operations
  createUser: (email: string, password: string, role: string) => Promise<any>;
  findUserByEmail: (email: string) => Promise<any>;
  findUserById: (id: string) => Promise<any>;
  
  // Sweet operations
  createSweet: (name: string, category: string, price: number, quantity: number, description?: string, imageUrl?: string) => Promise<any>;
  getAllSweets: () => Promise<any[]>;
  getSweetById: (id: string) => Promise<any>;
  updateSweet: (id: string, name: string, category: string, price: number, quantity: number, description?: string, imageUrl?: string) => Promise<any>;
  updateSweetQuantity: (id: string, quantity: number) => Promise<any>;
  deleteSweet: (id: string) => Promise<void>;
  searchSweets: (filters: any) => Promise<any[]>;
  
  // Purchase operations
  createPurchase: (userId: string, sweetId: string, quantity: number, pricePerUnit: number, totalAmount: number) => Promise<any>;
  getUserPurchases: (userId: string) => Promise<any[]>;
}

// Initialize PostgreSQL connection and return helpers
export async function initPostgresDatabase(): Promise<{ dbHelpers: DbHelpers }> {
  try {
    const databaseUrl = process.env.DATABASE_URL || 
      `postgresql://${process.env.DATABASE_USER || 'sweetshop_user'}:${process.env.DATABASE_PASSWORD || 'secure_password_2025'}@${process.env.DATABASE_HOST || 'localhost'}:${process.env.DATABASE_PORT || 5432}/${process.env.DATABASE_NAME || 'sweetshop'}`;
    
    pool = new Pool({
      connectionString: databaseUrl,
      max: 20, // Maximum connections in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Test connection
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    // Initialize database tables
    await initializeTables(client);
    
    client.release();

    console.log('Database initialized successfully');
    
    return { dbHelpers: getDbHelpers() };
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Initialize database tables
async function initializeTables(client: PoolClient): Promise<void> {
  try {
    console.log('Initializing database tables...');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sweets table
    await client.query(`
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
      )
    `);

    // Create purchases table
    await client.query(`
      CREATE TABLE IF NOT EXISTS purchases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        sweet_id UUID REFERENCES sweets(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        price_per_unit DECIMAL(10,2) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sweets_category ON sweets(category)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sweets_name ON sweets(name)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_purchases_sweet_id ON purchases(sweet_id)`);

    // Create updated_at trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    // Create triggers for updated_at
    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at 
          BEFORE UPDATE ON users 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_sweets_updated_at ON sweets;
      CREATE TRIGGER update_sweets_updated_at 
          BEFORE UPDATE ON sweets 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    // Insert default admin user (password: admin123)
    await client.query(`
      INSERT INTO users (email, password, role) VALUES 
        ('admin@sweetshop.com', '$2a$10$JEqcXbwFi4A3olazoMtyCeGV9i2bkg89ZOTu5euFPtUWxHdQAhtx6', 'admin')
      ON CONFLICT (email) DO NOTHING
    `);

    // Insert sample sweets data
    await client.query(`
      INSERT INTO sweets (name, category, price, quantity, description, image_url) VALUES
        ('Chocolate Chip Cookies', 'Cookies', 2.99, 50, 'Delicious homemade chocolate chip cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Red Velvet Cupcake', 'Cupcakes', 3.49, 30, 'Rich red velvet cupcake with cream cheese frosting', 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400'),
        ('Dark Chocolate Bar', 'Chocolate', 4.99, 25, 'Premium 70% dark chocolate bar', 'https://images.unsplash.com/photo-1506124728058-7b4d6dc8e94e?w=400'),
        ('Strawberry Gummy Bears', 'Gummies', 1.99, 75, 'Sweet and chewy strawberry flavored gummy bears', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400'),
        ('Vanilla Macarons', 'Macarons', 12.99, 20, 'Box of 6 delicate vanilla macarons', 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400'),
        ('Caramel Lollipops', 'Lollipops', 0.99, 100, 'Handcrafted caramel lollipops', 'https://images.unsplash.com/photo-1603893603637-80ac0bd48b64?w=400'),
        ('Mint Chocolate Truffles', 'Chocolate', 8.99, 15, 'Luxurious mint chocolate truffles', 'https://images.unsplash.com/photo-1549042256-0e9c4b0d9e3f?w=400'),
        ('Rainbow Sour Strips', 'Sour Candy', 2.49, 60, 'Tangy rainbow colored sour strips', 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400')
      ON CONFLICT DO NOTHING
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
}

// Initialize PostgreSQL connection (for backward compatibility)
export async function initDatabase(): Promise<void> {
  await initPostgresDatabase();
}

// Get database helpers
export function getDbHelpers(): DbHelpers {
  if (!pool) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }

  return {
    // User operations
    async createUser(email: string, password: string, role: string = 'customer') {
      const client = await pool.connect();
      try {
        const result = await client.query(
          'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
          [email, password, role]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },

    async findUserByEmail(email: string) {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
      } finally {
        client.release();
      }
    },

    async findUserById(id: string) {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT id, email, role, created_at FROM users WHERE id = $1', [id]);
        return result.rows[0];
      } finally {
        client.release();
      }
    },

    // Sweet operations
    async createSweet(name: string, category: string, price: number, quantity: number, description?: string, imageUrl?: string) {
      const client = await pool.connect();
      try {
        const result = await client.query(
          'INSERT INTO sweets (name, category, price, quantity, description, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [name, category, price, quantity, description, imageUrl]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },

    async getAllSweets() {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM sweets ORDER BY created_at DESC');
        return result.rows;
      } finally {
        client.release();
      }
    },

    async getSweetById(id: string) {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM sweets WHERE id = $1', [id]);
        return result.rows[0];
      } finally {
        client.release();
      }
    },

    async updateSweet(id: string, name: string, category: string, price: number, quantity: number, description?: string, imageUrl?: string) {
      const client = await pool.connect();
      try {
        const result = await client.query(
          'UPDATE sweets SET name = $2, category = $3, price = $4, quantity = $5, description = $6, image_url = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
          [id, name, category, price, quantity, description, imageUrl]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },

    async updateSweetQuantity(id: string, quantity: number) {
      const client = await pool.connect();
      try {
        const result = await client.query(
          'UPDATE sweets SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
          [quantity, id]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },

    async deleteSweet(id: string) {
      const client = await pool.connect();
      try {
        await client.query('DELETE FROM sweets WHERE id = $1', [id]);
      } finally {
        client.release();
      }
    },

    async searchSweets(filters: any) {
      const client = await pool.connect();
      try {
        let query = 'SELECT * FROM sweets WHERE 1=1';
        const params: any[] = [];
        let paramCount = 0;

        if (filters.name) {
          paramCount++;
          query += ` AND name ILIKE $${paramCount}`;
          params.push(`%${filters.name}%`);
        }

        if (filters.category) {
          paramCount++;
          query += ` AND category ILIKE $${paramCount}`;
          params.push(`%${filters.category}%`);
        }

        if (filters.minPrice !== undefined) {
          paramCount++;
          query += ` AND price >= $${paramCount}`;
          params.push(filters.minPrice);
        }

        if (filters.maxPrice !== undefined) {
          paramCount++;
          query += ` AND price <= $${paramCount}`;
          params.push(filters.maxPrice);
        }

        query += ' ORDER BY created_at DESC';

        const result = await client.query(query, params);
        return result.rows;
      } finally {
        client.release();
      }
    },

    // Purchase operations
    async createPurchase(userId: string, sweetId: string, quantity: number, pricePerUnit: number, totalAmount: number) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        
        // Create purchase record
        const purchaseResult = await client.query(
          'INSERT INTO purchases (user_id, sweet_id, quantity, price_per_unit, total_amount) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [userId, sweetId, quantity, pricePerUnit, totalAmount]
        );
        
        // Update sweet quantity
        await client.query(
          'UPDATE sweets SET quantity = quantity - $1 WHERE id = $2',
          [quantity, sweetId]
        );
        
        await client.query('COMMIT');
        return purchaseResult.rows[0];
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },

    async getUserPurchases(userId: string) {
      const client = await pool.connect();
      try {
        const result = await client.query(
          `SELECT p.*, s.name as sweet_name, s.category, s.image_url 
           FROM purchases p 
           JOIN sweets s ON p.sweet_id = s.id 
           WHERE p.user_id = $1 
           ORDER BY p.created_at DESC`,
          [userId]
        );
        return result.rows;
      } finally {
        client.release();
      }
    }
  };
}

// Export helpers property that can be accessed directly
export const dbHelpers = new Proxy({} as DbHelpers, {
  get(target, prop) {
    const helpers = getDbHelpers();
    return helpers[prop as keyof DbHelpers];
  }
});

// Graceful shutdown
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    console.log('Database connection pool closed');
  }
}
