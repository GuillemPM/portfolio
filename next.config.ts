import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/** React dev + Next dev rely on eval(); GLTF/DRACO in drei needs wasm-unsafe-eval. */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  "https://unpkg.com",
  "https://va.vercel-scripts.com",
  "'wasm-unsafe-eval'",
  ...(isDev ? ["'unsafe-eval'" as const] : []),
].join(" ");

const cspDirectives = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' blob: https://va.vercel-scripts.com https://unpkg.com wss: https:",
  "frame-src 'self' https: blob:",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.36"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  async headers() {
    const headers: { key: string; value: string }[] = [
      { key: "Content-Security-Policy", value: cspDirectives },
    ];
    if (!isDev) {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }
    headers.push(
      { key: "X-Content-Type-Options", value: "nosniff" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    );
    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
