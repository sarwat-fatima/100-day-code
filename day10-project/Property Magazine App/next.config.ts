import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "res.cloudinary.com" }
    ]
  },
  // If you open the dev server via LAN IP, Next blocks HMR unless allowed.
  allowedDevOrigins: ["localhost", "192.168.56.1"],
  webpack: (config, { dev }) => {
    // Low-RAM Windows fix: disable filesystem cache to avoid "Array buffer allocation failed".
    if (dev) config.cache = false;
    return config;
  },
  experimental: {
    // Keeps dev memory lower by avoiding unnecessary polyfills in some setups
    optimizePackageImports: ["lucide-react"]
  }
};

export default nextConfig;
