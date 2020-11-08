const proxy = require("http-proxy-middleware");
//const morgan = require("morgan");

const URI = `http://localhost`;
module.exports = function (app) {
    const apiProxy = proxy('/api', { target: URI, secure: false });
    //const wsProxy = proxy('/cable', { ws: true, target: URI, secure: false });
    app.use(apiProxy);
    //app.use(wsProxy);
    //app.use(morgan('combined'));
};
