const ManagementSocket = require("./ManagementSocket");

/**
 * @member {string} ip
 * @member {string} password
 * @member {number} port
 * @member {ManagementSocket} socket
 * @member {{[key: string] : IClient}} clients
 * @member {string} denyReason
 */
class Manager {
  /**
   * Create a manager
   * @param {string} ip
   * @param {number} port
   * @param {string} password
   */
  constructor(ip, port, password, denyReason = "Unauthorized") {
    this.ip = ip;
    this.port = port;
    this.password = password;
    this.socket = new ManagementSocket();
    this.socket.connect(port, ip);
    this.clients = {};
    this.denyReason = denyReason;

    this.socket.on("enter-password", () => {
      this.socket.writeLine(this.password);
    });

    this.socket.on("client-connect", (data) => {
      const client = this.clients[data.username];

      if (!client || client.password != data.password) {
        return this.socket.writeClientDeny(data.CID, data.KID, this.denyReason);
      }

      this.socket.writeClientAuth(data.CID, data.KID);
    });
  }

  /**
   * Add a client to the map of authorized clients
   * @param {IClient} client
   */
  addClient(client) {
    this.clients[client.username] = client;
  }
}

module.exports = Manager;
