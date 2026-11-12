/**
 * Backup do banco.
 *  - SQLite (padrão local): copia o arquivo dev.db para backups/dev-AAAAMMDD-HHMM.db
 *  - PostgreSQL: use pg_dump (ou os backups automáticos do provedor: Neon/Supabase). Ver docs/SEGURANCA.md.
 * Restauração SQLite: pare o servidor e copie o arquivo de backup de volta para prisma/dev.db.
 * Uso: npm run backup
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import "dotenv/config";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
if (!url.startsWith("file:")) {
  console.log("Banco PostgreSQL detectado. Execute: pg_dump \"$DATABASE_URL\" -Fc -f backups/trf3-$(date +%Y%m%d).dump");
  process.exit(0);
}
const src = `prisma/${url.replace("file:./", "").replace("file:", "")}`;
if (!existsSync(src)) {
  console.error(`Arquivo não encontrado: ${src}`);
  process.exit(1);
}
mkdirSync("backups", { recursive: true });
const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);
const dest = `backups/dev-${stamp}.db`;
copyFileSync(src, dest);
console.log(`Backup criado: ${dest}`);
