var proxy = require('http-proxy-middleware');

const DEFAULT_PORT = 3000;

// Does not even require bodyParser.raw()
// Works with greenlock-express out-of-the-box
var apiProxy = proxy('/api/**', {
  
  // Overwrites `target`
    router: function(message) {
      var regex = new RegExp("/api\/([a-zA-Z.-]*)\/(.*)", "i");
      var matches = regex.exec(message.url);
      var host = matches[1];
      var backendUrl = `http://${host}:${DEFAULT_PORT}`;
      return backendUrl;
    },

    // Default target
    target: 'http://nirvana:3000',

    changeOrigin: true,

    ws: true,
  
    // Remove base path
    pathRewrite: {
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