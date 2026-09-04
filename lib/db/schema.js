/**
 * Jaipur Stonecraft — Database Schema Definition (MySQL / MariaDB)
 * 
 * Defines tables, foreign keys, and indexes for MySQL engine.
 * STRICT RULE: Granite is strictly excluded from all materials, attributes, and definitions.
 */

export const CREATE_TABLES_SQL_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS collections (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_src TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS subcategories (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(100) NOT NULL,
    parent_collection_slug VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_src TEXT,
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_collection_slug VARCHAR(100) NOT NULL,
    parent_subcategory_slug VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_src TEXT,
    image_alt TEXT,
    featured TINYINT(1) DEFAULT 0,
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS materials (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    origin VARCHAR(255),
    color_family VARCHAR(100),
    durability VARCHAR(255),
    is_sacred_grade TINYINT(1) DEFAULT 0,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(100) PRIMARY KEY,
    primary_name VARCHAR(255) NOT NULL,
    synonyms LONGTEXT,
    tradition VARCHAR(255),
    iconography_elements LONGTEXT,
    default_category_slug VARCHAR(100),
    is_active TINYINT(1) DEFAULT 1
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS product_types (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS attribute_definitions (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    options LONGTEXT,
    applies_to_product_types LONGTEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'published',
    is_featured TINYINT(1) DEFAULT 0,
    is_new_arrival TINYINT(1) DEFAULT 0,
    is_custom_only TINYINT(1) DEFAULT 0,
    product_type VARCHAR(100) NOT NULL,
    parent_collection VARCHAR(100) NOT NULL,
    parent_subcategory VARCHAR(100) NOT NULL,
    parent_category VARCHAR(100) NOT NULL,
    subject_id VARCHAR(100),
    primary_material_id VARCHAR(100) NOT NULL,
    short_description TEXT,
    detailed_description LONGTEXT,
    knowledge_layer LONGTEXT,
    attributes LONGTEXT,
    tags LONGTEXT,
    variants LONGTEXT,
    seo LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_slug VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    role VARCHAR(50) DEFAULT 'gallery',
    sort_order INT DEFAULT 0,
    is_primary TINYINT(1) DEFAULT 0,
    FOREIGN KEY (product_slug) REFERENCES products(slug) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS site_content (
    key_name VARCHAR(100) PRIMARY KEY,
    page VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'image',
    value TEXT NOT NULL,
    alt_text TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  /* NEW PHASE 1 CMS FOUNDATION TABLES */
  `CREATE TABLE IF NOT EXISTS page_sections (
    key_name VARCHAR(100) PRIMARY KEY,
    page VARCHAR(50) NOT NULL,
    section_id VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    content_json LONGTEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    year VARCHAR(50),
    description TEXT,
    materials TEXT,
    craftsmanship TEXT,
    final_result TEXT,
    image_src TEXT,
    gallery LONGTEXT,
    products_used LONGTEXT,
    status VARCHAR(50) DEFAULT 'published',
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    inquiry_type VARCHAR(50) DEFAULT 'custom',
    message LONGTEXT,
    reference_image_url TEXT,
    status VARCHAR(50) DEFAULT 'new',
    admin_notes LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS site_settings (
    key_name VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    value LONGTEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
];
