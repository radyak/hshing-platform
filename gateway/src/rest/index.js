var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var proxy = require('http-proxy-middleware');

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.raw());
// app.use(bodyParser.json());

app.use("/isAlive", function (req, res) {
  res.status(200).end();
});

app.use('/admin', require("./admin"));

// TODO: Test
// TODO: Forward to correct backend system URL
// For websockets with greenlock, see https://git.coolaj86.com/coolaj86/greenlock-express.js/src/branch/master/examples/websockets.js
app.use('/api', proxy('/api/**', {
  // Overwrite target

  router: function(message) {
    var regex = /\/api\/([a-zA-Z.-]*)\/(.*)/i;
    var matches = regex.exec(message.url);
    var host = matches[1];

    var backendUrl = `http://${host}:3000`;

    console.log(`Redirecting to ${backendUrl}`);

    return `http://${host}:3000`;
  },
  // Default backend
  target: 'http://nonsense:3000',
  changeOrigin: true,
  ws: true,

  pathRewrite: {
    '^/api/[a-zA-Z.-]*/': '' // remove base path,
  },

}));

app.use("*", function (req, res) {
  res.status(404).send("Invalid URL");
});


module.exports = app;
