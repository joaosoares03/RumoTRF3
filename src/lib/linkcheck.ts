/**
 * Verificação de links (compartilhada entre o painel administrativo e scripts/check-links.ts).
 * VERIFICADO somente com HTTP 2xx E presença do texto esperado na página (quando informado).
 */
const UA = "Mozilla/5.0 (compatible; PlataformaEstudosTRF3-LinkChecker/1.0; uso pessoal educacional)";

export function expectedText(description: string): string | null {
  const m = description.match(/\[esperado: "([^"]+)"\]/);
  return m ? m[1] : null;
}

export type CheckOutcome = { status: "VERIFICADO" | "QUEBRADO" | "INACESSIVEL" | "DIVERGENTE"; http: number | null; msg: string };

export async function checkUrl(url: string, expect: string | null): Promise<CheckOutcome> {
  if (!/^https:\/\//.test(url)) return { status: "INACESSIVEL", http: null, msg: "Somente URLs https são aceitas" };
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8" }, signal: AbortSignal.timeout(25000) });
    const ct = res.headers.get("content-type") || "";
    let body = "";
    if (ct.includes("text") || ct.includes("html") || ct.includes("json") || ct.includes("xml")) body = (await res.text()).slice(0, 3_000_000);
    if (res.status === 404 || res.status === 410) return { status: "QUEBRADO", http: res.status, msg: `HTTP ${res.status}` };
    if (!res.ok) return { status: "INACESSIVEL", http: res.status, msg: `HTTP ${res.status}` };
    if (expect && body && !body.toLowerCase().includes(expect.toLowerCase())) return { status: "DIVERGENTE", http: res.status, msg: `Texto esperado não encontrado: "${expect}"` };
    if (expect && !body && !ct.includes("pdf")) return { status: "DIVERGENTE", http: res.status, msg: `Conteúdo não textual (${ct}) — conferir manualmente` };
    return { status: "VERIFICADO", http: res.status, msg: ct.includes("pdf") ? "PDF acessível (conteúdo não inspecionado)" : "OK" };
  } catch (e) {
    return { status: "INACESSIVEL", http: null, msg: (e as Error).message.slice(0, 200) };
  }
}

/** Verifica um vídeo do YouTube pelo endpoint público oEmbed (retorna título e canal reais). */
export async function youtubeOEmbed(url: string): Promise<{ title: string; author: string } | null> {
  try {
    const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(15000) });
    if (!r.ok) return null;
    const j = (await r.json()) as { title?: string; author_name?: string };
    return j.title ? { title: j.title, author: j.author_name ?? "" } : null;
  } catch {
    return null;
  }
}
