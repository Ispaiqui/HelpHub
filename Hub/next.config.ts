import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@helphub/crm"],
  async redirects() {
    return [
      {
        source: "/demonstracoes/essencial",
        destination: "/demonstracoes",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
