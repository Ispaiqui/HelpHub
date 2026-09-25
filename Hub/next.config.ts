import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
