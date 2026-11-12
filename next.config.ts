import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // permite rodar uma segunda instância (testes E2E) sem conflitar com o servidor de desenvolvimento
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Em desenvolvimento, o banco SQLite (prisma/dev.db) muda a cada ação; sem isso o Next recompila e recarrega a página.
  webpack: (config, { dev }) => {
    if (dev) config.watchOptions = { ...config.watchOptions, ignored: ["**/node_modules/**", "**/.git/**", "**/prisma/**", "**/docs/**", "**/backups/**"] };
    return config;
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
