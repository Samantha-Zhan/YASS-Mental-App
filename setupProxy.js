const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  /*   app.use("/v1/ping"
    createProxyMiddleware({
      target: "https://api.receptiviti.com",
      changeOrigin: true,
    })
  ); */
  console.log("inside app");
  app.use(
    "/v1/ping",
    createProxyMiddleware({
      target: "https://api.receptiviti.com",
      changeOrigin: true,
    })
  );
};
