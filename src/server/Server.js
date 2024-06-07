import express from "express";

export default class Server {
  #app;
  #host;
  #port;
  #server;

  constructor(port, host) {
    this.#app = express();
    this.#port = port;
    this.#host = host;
    this.#server = null;
  }

  start() {
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`Server is listening on http://${this.#host}:${this.#port}`);
    });
  }

  close() {
    this.#server?.close();
  }
}
