/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow requests from all origins (be cautious in production)
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS", // Allowed methods
          },
          // Add other CORS headers if needed (e.g., Allow-Credentials)
        ],
      },
    ];
  },
};

export default nextConfig;
