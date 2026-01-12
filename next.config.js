/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ez mondja meg, hogy az egész alkalmazás a /kocsonya alatt lakik
  basePath: '/kocsonya',
  
  // Ez pedig azért kell, hogy ha valaki a sima domainre jön (vercel.app),
  // akkor is jó helyre lyukadjon ki.
  async redirects() {
    return [
      {
        source: '/',
        destination: '/kocsonya',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig