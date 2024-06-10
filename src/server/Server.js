import express from "express";

export default class Server {
  #app;
  #host;
  #port;
  #router;
  #server;

  constructor(port, host, router) {
    this.#app = express();
    this.#port = port;
    this.#host = host;
    this.#server = null;
    this.#router = router;
  }

  getApp = () => this.#app;

  start() {
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`Server is listening on http://${this.#host}:${this.#port}`);
    });
    this.#app.use(express.json());
    this.#app.use(
      this.#router.getRouteStartingPoint(),
      this.#router.getRouter()
    );
  }

  close() {
    this.#server?.close();
  }
}
