const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://10.50.50.145:9797',
            changeOrigin: true,
        })
    );
};