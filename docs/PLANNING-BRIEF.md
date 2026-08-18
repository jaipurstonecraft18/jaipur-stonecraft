# Jaipur Stonecraft — Production Transition Planning Brief

## 1. Finalized Architectural Decisions
1. **Database Migration to MySQL**:
   - Local development connects to a local MySQL instance.
   - Production connects to Hostinger managed MySQL instance.
   - Database connection configured exclusively via `DATABASE_URL` environment variable.
2. **Backup Destination**:
   - Automated backups for both database SQL dumps and image assets will target **Google Drive**.
3. **No Granite Constraint**:
   - Jaipur Stonecraft does not offer granite as a material, capability, or content item. This constraint strictly applies to all code, schema definitions, validation functions, and seed data.
4. **System Preservation**:
   - Existing working systems (4-level Collections taxonomy, Product/Image Studio admin components, Smart Search engine, CSS design system, existing SEO/sitemap/structured-data) must be preserved without unnecessary refactoring or rebuilds.

## 2. Implementation Execution Protocol
- **Phase-by-Phase Execution**: Each phase is executed sequentially.
- **Phase Protocol**:
  1. Inspect codebase.
  2. Plan phase changes.
  3. Implement phase changes.
  4. Test thoroughly and verify non-regression.
  5. Produce written summary report.
  6. Stop and wait for user confirmation before starting the next phase.
