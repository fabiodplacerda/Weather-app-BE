import express from "express";

export default class Server {
  #app;
  #host;
  #port;
  #routers;
  #server;

  constructor(port, host, routers) {
    this.#app = express();
    this.#port = port;
    this.#host = host;
    this.#server = null;
    this.#routers = routers;
  }

  getApp = () => this.#app;

  start() {
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`Server is listening on http://${this.#host}:${this.#port}`);
    });
    this.#app.use(express.json());
    this.#routers.forEach((router) => {
      this.#app.use(router.getRouteStartingPoint(), router.getRouter());
    });
  }

  close() {
    this.#server?.close();
  }
}
