/**
 * Jaipur Stonecraft — Database Schema Definition (SQLite)
 * 
 * Defines tables, foreign keys, and indexes for persistent database architecture.
 * STRICT RULE: Granite is strictly excluded from all materials, attributes, and definitions.
 */

export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_src TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subcategories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    parent_collection_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_src TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    parent_collection_slug TEXT NOT NULL,
    parent_subcategory_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_src TEXT,
    image_alt TEXT,
    featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    origin TEXT,
    color_family TEXT,
    durability TEXT,
    is_sacred_grade INTEGER DEFAULT 0,
    description TEXT,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    primary_name TEXT NOT NULL,
    synonyms TEXT, -- JSON array
    tradition TEXT,
    iconography_elements TEXT, -- JSON array
    default_category_slug TEXT,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS product_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS attribute_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    data_type TEXT NOT NULL, -- text, number, boolean, select, multiselect
    options TEXT, -- JSON array of options for select types
    applies_to_product_types TEXT, -- JSON array of product type IDs
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'published',
    is_featured INTEGER DEFAULT 0,
    is_new_arrival INTEGER DEFAULT 0,
    is_custom_only INTEGER DEFAULT 0,
    
    product_type TEXT NOT NULL,
    parent_collection TEXT NOT NULL,
    parent_subcategory TEXT NOT NULL,
    parent_category TEXT NOT NULL,
    
    subject_id TEXT,
    primary_material_id TEXT NOT NULL,
    
    short_description TEXT,
    detailed_description TEXT,
    
    knowledge_layer TEXT, -- JSON object
    attributes TEXT,      -- JSON object
    tags TEXT,            -- JSON array
    variants TEXT,        -- JSON object
    seo TEXT,             -- JSON object
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_slug TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    role TEXT DEFAULT 'gallery',
    sort_order INTEGER DEFAULT 0,
    is_primary INTEGER DEFAULT 0,
    FOREIGN KEY (product_slug) REFERENCES products(slug) ON DELETE CASCADE
  );

  -- Indexing strategy for fast query execution & pagination
  CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(parent_category);
  CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(parent_subcategory);
  CREATE INDEX IF NOT EXISTS idx_products_collection ON products(parent_collection);
  CREATE INDEX IF NOT EXISTS idx_products_material ON products(primary_material_id);
  CREATE INDEX IF NOT EXISTS idx_products_subject ON products(subject_id);
  CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
  CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_slug);
`;
