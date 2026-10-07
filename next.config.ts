import type { NextConfig } from "next";

const immutableCache = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    const topics: Record<string, string> = {
      "what-is-a-pbo": "legal-framework",
      "objects-and-purpose-of-the-act": "legal-framework",
      "registration-requirements": "registration",
      "registration-process-and-timeline": "registration",
      "pbo-regulatory-authority": "regulatory-authority-and-tribunal",
      "pbo-regulations-overview": "practical-compliance",
    };
    return [
      {
        source: "/knowledge/topics",
        destination: "/topics",
        permanent: true,
      },
      ...Object.entries(topics).map(([from, to]) => ({
        source: `/knowledge/topics/${from}`,
        destination: `/knowledge/topics/${to}`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    // Aggressive Cache-Control on /_next/static breaks webpack HMR in development
    // and can serve stale client chunks (causing "Element type is invalid" crashes).
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/documents/:path*",
        headers: [{ key: "Cache-Control", value: immutableCache }],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: immutableCache }],
      },
      {
        source: "/icon.svg",
        headers: [{ key: "Cache-Control", value: immutableCache }],
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: immutableCache }],
      },
      {
        source: "/:path*.svg",
        headers: [{ key: "Cache-Control", value: immutableCache }],
      },
      {
        source: "/:path*.woff2",
        headers: [{ key: "Cache-Control", value: immutableCache }],
      },
      {
        source: "/:path*.jpg",
        headers: [{ key: "Cache-Control", value: immutableCache }],
      },
      {
        source: "/:path*.jpeg",
        headers: [{ key: "Cache-Control", value: immutableCache }],
      },
      {
        source: "/:path*.webp",
        headers: [{ key: "Cache-Control", value: immutableCache }],
      },
    ];
  },
};

export default nextConfig;
