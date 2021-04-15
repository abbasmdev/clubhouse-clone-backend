const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { ExpressPeerServer } = require("peer");

var key = fs.readFileSync(path.join(__dirname, "../../../cert/selfsigned.key"));
var cert = fs.readFileSync(
  path.join(__dirname, "../../../cert/selfsigned.crt")
);
var options = {
  key: key,
  cert: cert,
};
const http = require("http");
const cors = require("cors");
const apiRootRouter = require("../../api/routers");
const { uploadsBaseDir } = require("../multer/multer-config");

class ExpressBootstrap {
  expressServer;
  httpServer;
  async init() {
    this.expressServer = express();
    this.expressServer.use(cors({ origin: "*" }));
    // this.httpServer = https.createServer(options, this.expressServer);
    this.httpServer = http.createServer(this.expressServer);

    const peerServer = ExpressPeerServer(this.expressServer, {
      path: "/",
    });

    this.expressServer.use("/peerjs", peerServer);

    this.expressServer.use("/public/uploads", express.static(uploadsBaseDir));
    //map api router
    this.expressServer.use("/api", apiRootRouter);

    const port = process.env.PORT || 3001;
    this.httpServer.listen(port, () => {
      console.log(`server started on port ${port}`);
    });
  }
}

const expressBootstrap = new ExpressBootstrap();

module.exports = expressBootstrap;
