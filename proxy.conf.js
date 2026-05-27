const DEV_TARGET = 'https://dhre-dev.strategydotzero.com';

function onProxyReq(proxyReq) {
  proxyReq.setHeader('origin', DEV_TARGET);
  proxyReq.setHeader('referer', DEV_TARGET + '/');
}

module.exports = {
  '/cdapi': {
    target: DEV_TARGET + '/cdapi/',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',
    cookieDomainRewrite: 'localhost',
    onProxyReq,
    pathRewrite: {
      '^/cdapi': '',
    },
  },
  '/businessplanAPI': {
    target: DEV_TARGET + '/businessplanAPI/',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',
    cookieDomainRewrite: 'localhost',
    onProxyReq,
    pathRewrite: {
      '^/businessplanAPI': '',
    },
  },
  '/root': {
    target: DEV_TARGET + '/',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',
    cookieDomainRewrite: 'localhost',
    onProxyReq,
    pathRewrite: {
      '^/root': '',
    },
  },
};
