// Configuração inicial em um comando (Windows, macOS ou Linux): npm run setup
// 1) cria o .env a partir do .env.example  2) aplica as migrações  3) carrega o conteúdo (seed)
import { execSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";

const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

const major = Number(process.versions.node.split(".")[0]);
if (major < 20) {
  console.error(`Node.js ${process.versions.node} detectado. Instale o Node.js 20 ou superior (https://nodejs.org).`);
  process.exit(1);
}
if (!existsSync(".env")) {
  copyFileSync(".env.example", ".env");
  console.log("Arquivo .env criado a partir de .env.example");
}
run("npx prisma migrate deploy");
run("npx prisma generate");
run("npx tsx prisma/seed.ts");
console.log(`
Pronto! Agora rode:  npm run dev
e abra http://localhost:3000 no navegador.
A primeira conta criada vira administradora (ou defina ADMIN_EMAILS no .env).
Opcional: npm run links:check  (verifica os links da biblioteca; requer internet)
`);
