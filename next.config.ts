import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/admin/pages",
        destination: "/admin/institutional-pages",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
