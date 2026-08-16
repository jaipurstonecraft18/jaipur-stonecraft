import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { CREATE_TABLES_SQL } from "./schema.js";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "jaipur_stonecraft.db");

let dbInstance = null;

export function getDB() {
  if (!dbInstance) {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    dbInstance = new Database(DB_PATH);
    
    // Performance optimizations: WAL mode for concurrent readers & 64MB cache
    dbInstance.pragma("journal_mode = WAL");
    dbInstance.pragma("synchronous = NORMAL");
    dbInstance.pragma("cache_size = -64000");

    // Execute schema table creation
    dbInstance.exec(CREATE_TABLES_SQL);

    // Migration safety for is_active columns
    const tables = ["materials", "subjects", "collections", "subcategories", "categories"];
    tables.forEach((tbl) => {
      try {
        dbInstance.exec(`ALTER TABLE ${tbl} ADD COLUMN is_active INTEGER DEFAULT 1`);
      } catch (e) {
        // Column already exists
      }
    });

    // Seed default product types if empty
    const ptCount = dbInstance.prepare("SELECT COUNT(*) as count FROM product_types").get();
    if (ptCount.count === 0) {
      const defaultTypes = [
        { id: "statue", name: "Deity Statue / Sacred Murti", description: "Full-figure devotional statues and deity icons" },
        { id: "idol", name: "Devotional Murti / Idol", description: "Sanctuary pooja murti for home temples" },
        { id: "sculpture", name: "Artistic & Classical Sculpture", description: "Classical artwork sculptures and fine art figures" },
        { id: "bust", name: "Portrait Bust / Head Carving", description: "Masonic portrait busts and anatomical head studies" },
        { id: "figurine", name: "Statuette / Small Accent", description: "Desk figurines, table accents, and miniature carvings" },
        { id: "relief", name: "Carved Wall Relief Panel / Mural", description: "High-relief carved stone wall murals and panels" },
        { id: "mandir", name: "Home Temple Architecture", description: "Marble home mandirs, garbhagriha structures, and pooja arches" },
        { id: "fountain", name: "Water Fountain / Lotus Basin", description: "Tiered courtyard fountains and carved lotus basins" },
        { id: "architectural_element", name: "Jali Screen / Column / Arch", description: "Carved sandstone jali lattices, pillars, and arches" },
        { id: "decorative_object", name: "Urn / Planter / Plinth", description: "Garden urns, pedestals, and decorative stonework" },
        { id: "custom_artwork", name: "Bespoke Commission / Tribute", description: "Custom architectural carvings and private commissions" }
      ];

      const stmt = dbInstance.prepare("INSERT INTO product_types (id, name, description, is_active) VALUES (?, ?, ?, 1)");
      defaultTypes.forEach((pt) => stmt.run(pt.id, pt.name, pt.description));
    }

    // Seed default attribute definitions if empty
    const attrCount = dbInstance.prepare("SELECT COUNT(*) as count FROM attribute_definitions").get();
    if (attrCount.count === 0) {
      const defaultAttrs = [
        {
          id: "dimensions_height_inches",
          name: "Height (Inches)",
          data_type: "number",
          options: JSON.stringify([]),
          applies_to_product_types: JSON.stringify(["statue", "idol", "sculpture", "bust", "figurine", "mandir", "fountain", "architectural_element"])
        },
        {
          id: "dimensions_width_inches",
          name: "Width (Inches)",
          data_type: "number",
          options: JSON.stringify([]),
          applies_to_product_types: JSON.stringify(["statue", "idol", "sculpture", "bust", "relief", "mandir", "fountain", "architectural_element"])
        },
        {
          id: "dimensions_depth_inches",
          name: "Depth (Inches)",
          data_type: "number",
          options: JSON.stringify([]),
          applies_to_product_types: JSON.stringify(["statue", "idol", "sculpture", "bust", "mandir", "fountain"])
        },
        {
          id: "approximate_weight_kg",
          name: "Approximate Weight (KG)",
          data_type: "number",
          options: JSON.stringify([]),
          applies_to_product_types: JSON.stringify(["statue", "idol", "sculpture", "bust", "relief", "mandir", "fountain", "architectural_element"])
        },
        {
          id: "water_flow_system",
          name: "Water Circulation System",
          data_type: "select",
          options: JSON.stringify(["Recirculating Submersible Pump", "Self-Contained Lotus Basin", "Gravity Spillway"]),
          applies_to_product_types: JSON.stringify(["fountain"])
        },
        {
          id: "mandir_dome_style",
          name: "Dome / Shikhara Architecture",
          data_type: "select",
          options: JSON.stringify(["Nagara Style Pyramid Shikhara", "Lotus Kalash Finial", "Flat Masonic Arch"]),
          applies_to_product_types: JSON.stringify(["mandir"])
        },
        {
          id: "wall_mounting_hardware",
          name: "Wall Mounting System Included",
          data_type: "boolean",
          options: JSON.stringify([]),
          applies_to_product_types: JSON.stringify(["relief"])
        }
      ];

      const stmt = dbInstance.prepare("INSERT INTO attribute_definitions (id, name, data_type, options, applies_to_product_types, is_active) VALUES (?, ?, ?, ?, ?, 1)");
      defaultAttrs.forEach((att) => stmt.run(att.id, att.name, att.data_type, att.options, att.applies_to_product_types));
    }
  }

  return dbInstance;
}

export default getDB;
