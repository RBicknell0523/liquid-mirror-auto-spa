import type { NextConfig } from "next";

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
        destination: "https://www.liquidmirrorautospa.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
