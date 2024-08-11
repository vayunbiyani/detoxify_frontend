/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
      bodyParser: {
        sizeLimit: '100mb'
      },
    },
    serverRuntimeConfig: {
      bodySizeLimit: '100mb' // This is used for server-side configurations
    },
  };
  
  export default nextConfig;