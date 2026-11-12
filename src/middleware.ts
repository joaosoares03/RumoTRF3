import { NextResponse, type NextRequest } from "next/server";

const PUBLIC = ["/login", "/cadastro", "/_next", "/favicon", "/vendor", "/api/health"];

/** Proteção de rotas: sem cookie de sessão → login. A validade da sessão é conferida no servidor (requireUser). */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/" || PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (!req.cookies.get("trf3_session")?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|wasm)$).*)"] };
