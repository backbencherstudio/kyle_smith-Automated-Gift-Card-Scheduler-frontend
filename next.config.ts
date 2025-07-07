import type { NextConfig } from "next";
const path = require("path");
const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias["date-fns/esm"] = path.resolve(
      __dirname,
      "node_modules/date-fns"
    );
    return config;
  },
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },

      // local http://192.168.4.4:4000
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
          protocol: "https",
          hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "handheld-ips-division-fancy.trycloudflare.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
