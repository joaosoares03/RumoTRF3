// Prepara o projeto para PostgreSQL (produção — ex.: Neon ou Supabase gratuitos).
// Uso: defina DATABASE_URL="postgresql://..." no .env e rode: npm run db:use-postgres
// O script troca o provider no schema e guarda as migrações SQLite em prisma/migrations-sqlite.
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const schemaPath = "prisma/schema.prisma";
let schema = readFileSync(schemaPath, "utf8");
if (schema.includes('provider = "postgresql"')) {
  console.log("O schema já está configurado para PostgreSQL.");
  process.exit(0);
}
schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
writeFileSync(schemaPath, schema);
if (existsSync("prisma/migrations") && !existsSync("prisma/migrations-sqlite")) renameSync("prisma/migrations", "prisma/migrations-sqlite");
console.log("Provider alterado para postgresql. Migrações SQLite guardadas em prisma/migrations-sqlite.");
console.log("Gerando a migração inicial para PostgreSQL (requer DATABASE_URL apontando para o banco)...");
execSync("npx prisma migrate dev --name init_postgres", { stdio: "inherit" });
execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
console.log("Pronto. Faça commit da pasta prisma/migrations gerada antes de publicar.");
