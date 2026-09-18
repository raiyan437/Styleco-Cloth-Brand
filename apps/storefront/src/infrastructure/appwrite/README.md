# Appwrite adapter boundary

Reserved for CatalogRepository and HomepageRepository implementations using the
installed server SDK (`node-appwrite`). No client, network call, database, or Docker
service is created in Phase 0. `CATALOG_PROVIDER=appwrite` deliberately fails clearly
until the adapter exists; mock mode requires no credentials.

Later: validate endpoint/project/database configuration here, map TablesDB rows to
domain types, and keep SDK types and credentials inside this server boundary.
Cloud versus self-hosted should differ through environment configuration. API keys,
if needed later, must remain server-only and must never use NEXT_PUBLIC_ prefixes.
Authentication, Storage, Functions, Realtime, and hosting are future capabilities,
not configured services. Define tables and permissions only in an authorized phase.
