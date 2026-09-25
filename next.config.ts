import type { NextConfig } from "next";
import { SITE_URL } from "./lib/siteConfig";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "liquid-mirror-auto-spa-pi.vercel.app",
          },
        ],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
