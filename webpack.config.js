var path = require('path');

module.exports = {
  devServer: {
    compress: true,
    port: 8080,
    contentBase: path.join(__dirname, '.'),
    allowedHosts: [
      'allnewmarvel.ru'
    ],
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
  },
};
