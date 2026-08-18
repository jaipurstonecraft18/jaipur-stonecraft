# Jaipur Stonecraft — MySQL Migration Brief

## 1. Migration Objective
Migrate the underlying persistence layer from embedded `better-sqlite3` to MySQL (`mysql2` driver), enabling clean local/production parity using Hostinger MySQL.

## 2. Key Database Requirements
- **Driver**: `mysql2` (promise-based connection pool).
- **Environment Variable**: `DATABASE_URL` (e.g. `mysql://user:pass@host:3306/dbname`).
- **Data Parity**: Maintain identical 9-table schema structure (`collections`, `subcategories`, `categories`, `materials`, `subjects`, `product_types`, `attribute_definitions`, `products`, `product_images`).
- **No Granite Safeguard**: Retain explicit database checks rejecting any material or product creation involving granite.
- **Async API Abstraction**: Standardize database query functions to return Promises for async/await execution with `mysql2`.
