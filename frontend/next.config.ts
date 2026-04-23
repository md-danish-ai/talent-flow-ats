import type { NextConfig } from "next";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

let apiHostname = "localhost";
try {
  apiHostname = new URL(apiBase).hostname;
} catch {
  // fallback: keep apiBase as hostname if parse fails
  apiHostname = apiBase;
}

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: apiBase.startsWith("https") ? "https" : "http",
        hostname: apiHostname,
        pathname: "/**",
      },
    ],
  },
  experimental: {
    authInterrupts: true,
    // cacheComponents: true,
  },

  poweredByHeader: false,
};

export default nextConfig;
