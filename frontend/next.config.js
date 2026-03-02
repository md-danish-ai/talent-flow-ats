/** @type {import('next').NextConfig} */
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

let apiHostname = "localhost";
try {
  apiHostname = new URL(apiBase).hostname;
} catch (e) {
  // fallback: keep apiBase as hostname if parse fails
  apiHostname = apiBase;
}

const nextConfig = {
  images: {
    domains: [apiHostname, "localhost"],
  },
};

module.exports = nextConfig;
