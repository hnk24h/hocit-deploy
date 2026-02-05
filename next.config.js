/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // Disable automatic 404 generation for static export
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig
