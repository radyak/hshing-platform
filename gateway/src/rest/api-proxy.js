var proxy = require('http-proxy-middleware');

const DEFAULT_PORT = 3000;

// TODO: Test
// TODO: Forward to correct backend system URL
// For websockets with greenlock, see https://git.coolaj86.com/coolaj86/greenlock-express.js/src/branch/master/examples/websockets.js
var apiProxy = proxy('/api/**', {
    // Overwrite target
  
    router: function(message) {
      var regex = new RegExp("/api\/([a-zA-Z.-]*)\/(.*)", "i");
      var matches = regex.exec(message.url);
      var host = matches[1];
      var backendUrl = `http://${host}:${DEFAULT_PORT}`;
      return backendUrl;
    },

    // Default backend
    target: 'http://nirvana:3000',

    changeOrigin: true,

    ws: true,
  
    pathRewrite: {
      // remove base path,
      '^/api/[a-zA-Z0-9.-]*/': ''
    },

    onError: function(err, req, res) {
        res.writeHead(502, {
          "Content-Type": "application/json"
        })
        res.end(JSON.stringify({
          "message": "Bad Gateway"
        }));
    }
  
  });
  
module.exports = apiProxy;