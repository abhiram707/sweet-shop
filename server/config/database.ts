import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we're in production (Heroku, Render, or other PostgreSQL environments)
const isProduction = !!process.env.DATABASE_URL && 
  (process.env.DATABASE_URL.includes('postgres') || 
   process.env.RENDER_SERVICE_ID || 
   process.env.NODE_ENV === 'production');

let db: any;
let _dbHelpers: any = null;

export { db };

// Database helpers - will be initialized after database setup

// Initialize database tables
export async function initDatabase() {
  try {
    const isProduction = !!process.env.DATABASE_URL && 
      (process.env.DATABASE_URL.includes('postgres') || 
       process.env.RENDER_SERVICE_ID || 
       process.env.NODE_ENV === 'production');
    
    if (isProduction) {
      // Use PostgreSQL for production environments (Heroku, Render, etc.)
      console.log('Using PostgreSQL database for production deployment');
      const { initPostgresDatabase } = await import('./database-postgres.js');
      const result = await initPostgresDatabase();
      // For PostgreSQL, we'll use the helpers from the postgres module
      _dbHelpers = result.dbHelpers;
    } else {
      // Use SQLite for development - initialize database connection
      try {
        if (!db) {
          console.log('Initializing SQLite database for development');
          try {
            // Use dynamic import with string to avoid TypeScript compile-time resolution
            const betterSqlite3Module = await import('better-sqlite3' as string);
            const Database = betterSqlite3Module.default;
            const dbPath = path.join(__dirname, '../../database.sqlite');
            db = Database(dbPath);
            
            // Enable foreign keys
            db.pragma('foreign_keys = ON');
          } catch (importError) {
            console.log('better-sqlite3 not available, falling back to PostgreSQL');
            const { initPostgresDatabase } = await import('./database-postgres.js');
            const result = await initPostgresDatabase();
            _dbHelpers = result.dbHelpers;
            return;
          }
        }

        // Create users table
        db.exec(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create sweets table
        db.exec(`
          CREATE TABLE IF NOT EXISTS sweets (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
            quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
            description TEXT,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Initialize helpers after tables are created
        _dbHelpers = createDbHelpers();
      } catch (error) {
        console.error('SQLite not available, falling back to PostgreSQL:', error instanceof Error ? error.message : String(error));
        // Fallback to PostgreSQL if SQLite fails
        const { initPostgresDatabase } = await import('./database-postgres.js');
        const result = await initPostgresDatabase();
        _dbHelpers = result.dbHelpers;
      }
    }

    // Insert default admin user for both SQLite and PostgreSQL
    if (!isProduction) {
      // SQLite admin user setup
      const adminExists = await (typeof _dbHelpers.findUserByEmail === 'function' 
        ? _dbHelpers.findUserByEmail('admin@sweetshop.com')
        : _dbHelpers.findUserByEmail.get('admin@sweetshop.com'));
      
      if (!adminExists) {
        // Password hash for "admin123"
        const bcryptModule = await import('bcryptjs');
        const bcrypt = bcryptModule.default || bcryptModule;
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        if (typeof _dbHelpers.createUser === 'function') {
          // PostgreSQL
          await _dbHelpers.createUser('admin@sweetshop.com', hashedPassword, 'admin');
        } else {
          // SQLite
          db.prepare(`
            INSERT INTO users (email, password, role)
            VALUES (?, ?, 'admin')
          `).run('admin@sweetshop.com', hashedPassword);
        }
      }

      // Insert sample sweets data for SQLite
      const sweetCount = db.prepare('SELECT COUNT(*) as count FROM sweets').get() as { count: number };
      if (sweetCount.count === 0) {
        const insertSweet = db.prepare(`
          INSERT INTO sweets (name, category, price, quantity, description, image_url)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        const sampleSweets = [
          ['Chocolate Chip Cookies', 'Cookies', 2.99, 50, 'Delicious homemade chocolate chip cookies', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&auto=format&fit=crop'],
          ['Red Velvet Cupcake', 'Cupcakes', 3.49, 30, 'Rich red velvet cupcake with cream cheese frosting', 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&auto=format&fit=crop'],
          ['Dark Chocolate Bar', 'Chocolate', 4.99, 25, 'Premium 70% dark chocolate bar', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&auto=format&fit=crop'],
          ['Strawberry Gummy Bears', 'Gummies', 1.99, 75, 'Sweet and chewy strawberry flavored gummy bears', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop'],
          ['Vanilla Macarons', 'Macarons', 12.99, 20, 'Box of 6 delicate vanilla macarons', 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&auto=format&fit=crop'],
          ['Caramel Lollipops', 'Lollipops', 0.99, 100, 'Handcrafted caramel lollipops', 'https://images.unsplash.com/photo-1603893603637-80ac0bd48b64?w=400&auto=format&fit=crop'],
          ['Mint Chocolate Truffles', 'Chocolate', 8.99, 15, 'Luxurious mint chocolate truffles', 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&auto=format&fit=crop'],
          ['Rainbow Sour Strips', 'Sour Candy', 2.49, 60, 'Tangy rainbow colored sour strips', 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400&auto=format&fit=crop']
        ];

        sampleSweets.forEach(sweet => {
          insertSweet.run(...sweet);
        });
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Initialize prepared statements after database is set up
export function createDbHelpers() {
  return {
    // User operations
    createUser: db.prepare(`
      INSERT INTO users (email, password, role)
      VALUES (?, ?, ?)
      RETURNING id, email, role, created_at
    `),
    
    findUserByEmail: db.prepare(`
      SELECT * FROM users WHERE email = ?
    `),
    
    findUserById: db.prepare(`
      SELECT id, email, role, created_at FROM users WHERE id = ?
    `),

    // Sweet operations
    createSweet: db.prepare(`
      INSERT INTO sweets (name, category, price, quantity, description, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `),
    
    getAllSweets: db.prepare(`
      SELECT * FROM sweets ORDER BY created_at DESC
    `),
    
    getSweetById: db.prepare(`
      SELECT * FROM sweets WHERE id = ?
    `),
    
    updateSweet: db.prepare(`
      UPDATE sweets 
      SET name = ?, category = ?, price = ?, quantity = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      RETURNING *
    `),
    
    updateSweetQuantity: db.prepare(`
      UPDATE sweets 
      SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      RETURNING *
    `),
    
    deleteSweet: db.prepare(`
      DELETE FROM sweets WHERE id = ?
    `),
    
    searchSweets: (filters: any) => {
      let query = 'SELECT * FROM sweets WHERE 1=1';
      const params: any[] = [];
      
      if (filters.name) {
        query += ' AND name LIKE ?';
        params.push(`%${filters.name}%`);
      }
      
      if (filters.category) {
        query += ' AND category LIKE ?';
        params.push(`%${filters.category}%`);
      }
      
      if (filters.minPrice !== undefined) {
        query += ' AND price >= ?';
        params.push(filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        query += ' AND price <= ?';
        params.push(filters.maxPrice);
      }
      
      query += ' ORDER BY created_at DESC';
      
      return db.prepare(query).all(...params);
    }
  };
}

// Export getter for helpers 
export function getDbHelpers() {
  if (!_dbHelpers) {
    throw new Error('Database helpers not initialized. Call initDatabase() first.');
  }
  return _dbHelpers;
}

// Export helpers property that can be accessed directly
export const dbHelpers = new Proxy({} as any, {
  get(target, prop) {
    if (!_dbHelpers) {
      throw new Error('Database helpers not initialized. Call initDatabase() first.');
    }
    return _dbHelpers[prop];
  }
});