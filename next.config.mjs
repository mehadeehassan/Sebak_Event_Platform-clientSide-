/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Static shell + client rendering fits this project better; the strict
     prerender rules of the cache components mode were too heavy here. */
  cacheComponents: false,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
