import dgram from "dgram";

class Socket {
  _socket;

  constructor() {
    this.createSocket();
  }

  send(packet, port, address) {
    return new Promise((resolve, reject) => {
      this._socket.send(packet, port, address, (err) => {
        if (err) {
          this.createSocket();
          reject(err);
        }
      });
      this._socket.on("message", (msg) => {
        this.createSocket();
        resolve(msg);
      });
    });
  }

  createSocket() {
    if (this._socket) this._socket.close();

    this._socket = dgram.createSocket("udp4");
  }
}

export default Socket;
