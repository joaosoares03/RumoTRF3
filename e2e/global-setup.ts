import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

/** Recria o banco de testes E2E do zero (migrações versionadas + seed idempotente). */
export default function globalSetup() {
  const env = { ...process.env, DATABASE_URL: "file:./e2e.db" };
  for (const f of ["prisma/e2e.db", "prisma/e2e.db-journal"]) rmSync(f, { force: true });
  execSync("npx prisma migrate deploy", { stdio: "inherit", env });
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env });
}
