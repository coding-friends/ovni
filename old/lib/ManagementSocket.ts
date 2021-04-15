import { Socket } from "net";

const handleNotificationClientFactory = (that: ManagementSocket, eventName: string) => (
  args: string
) => {
  const [CID, KID] = (args + ",").split(",");
  that.lastClient = { CID, KID, eventName };
};

class ManagementSocket extends Socket {
  lastClient;
  constructor() {
    super();

    this.lastClient = null;
    this._backlog = "";

    this.on("data", (data) => this.emit("text", data.toString()));
    this.on("text", this.handleText);
    this.on("line", this.handleLine);

    // notifications
    this.on("notification", this.handleNotification);
    this.on("notification-client-env", this.handleNotificationClientEnv);

    for (const kind of ["connect", "reauth", "disconnect"]) {
      const eventName = "client-" + kind;
      this.on("notification-" + eventName, handleNotificationClientFactory(this, eventName));
    }

    this.on("notification-client-env-end", () => {
      this.emit(this.lastClient.eventName, this.lastClient);
    });
  }

  handleNotificationClientEnv = (env) => {
    if (env == "END") return this.emit("notification-client-env-end");
    const match = env.match(/^(\w+)=(.*)$/);
    if (match) this.lastClient[match[1]] = match[2];
  };

  handleText = (text) => {
    if (text.startsWith("ENTER PASSWORD:")) return this.emit("enter-password");
    const lines = text.split("\n");
    lines[0] = this._backlog + lines[0];
    this._backlog = lines.pop();
    for (const line of lines) this.emit("line", line.trim());
  };

  handleLine = (line) => {
    if (line.startsWith(">")) this.emit("notification", line.slice(1));
  };

  handleNotification = (notification) => {
    const match = notification.match(/^([A-Z]+:[A-Z]+),(.+)$/);
    if (match) {
      const eventName = "notification-" + match[1].toLowerCase().replace(":", "-");
      this.emit(eventName, match[2]);
    }
  };

  /**
   * Writes a line to the socket stream
   * @param {string} line
   */
  writeLine(line) {
    this.write(line + "\n");
  }

  /**
   * Writes client-auth-nt {CID} {KID}
   * @param {string} CID
   * @param {string} KID
   */
  writeClientAuth(CID, KID) {
    this.writeLine(`client-auth-nt ${CID} ${KID}`);
  }

  /**
   * Writes client-deny {CID} {KID} {reason} {clientReason}
   * @param {string} CID
   * @param {string} KID
   * @param {string?} reason
   * @param {string?} clientReason
   */
  writeClientDeny(CID, KID, reason = "Unauthorized", clientReason) {
    this.writeLine(`client-deny ${CID} ${KID} ${reason} ${clientReason ?? reason}`);
  }
}

module.exports = ManagementSocket;
