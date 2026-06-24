// Vercel Serverless Function — bridges Express SSR server to Vercel
const { join } = require('node:path');

module.exports = async (req, res) => {
  // The Angular SSR build outputs the server bundle here:
  const serverModule = join(__dirname, '..', 'dist', 'stephulz-portfolio', 'server', 'server.mjs');
  const { default: app } = await import(serverModule);
  return app(req, res);
};
