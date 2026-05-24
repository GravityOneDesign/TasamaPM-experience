module.exports = {
  '/cdapi': {
    target: 'https://dhre-dev.strategydotzero.com/cdapi/',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/cdapi': '',
    },
  },
  '/businessplanAPI': {
    target: 'https://dhre-dev.strategydotzero.com/businessplanAPI/',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/businessplanAPI': '',
    },
  },
  '/root': {
    target: 'https://dhre-dev.strategydotzero.com/',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/root': '',
    },
  },
};
