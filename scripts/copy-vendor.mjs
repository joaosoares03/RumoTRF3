// Copia o SQLite em WebAssembly (sql.js) para /public — usado pelo Laboratório SQL, executado no navegador.
import { copyFileSync, mkdirSync } from "node:fs";
mkdirSync("public/vendor", { recursive: true });
for (const f of ["sql-wasm.js", "sql-wasm.wasm"]) copyFileSync(`node_modules/sql.js/dist/${f}`, `public/vendor/${f}`);
console.log("sql.js copiado para public/vendor");
