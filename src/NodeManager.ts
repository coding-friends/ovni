import { Socket } from "net";
import { EventEmitter } from "events";
import ContractManager, { Contract } from "./ContractManager";
import {NodeConfig} from "./Configuration";

interface IClientEvent {
    env?: { [key: string]: string };
    KID: string;
    CID: string;
    event: string;
}

enum EClientEvent {
    Connect = "CLIENT:CONNECT",
    Reauth = "CLIENT:REAUTH",
    Disconnect = "CLIENT:DISCONNECT",
    Env = "CLIENT:ENV",
    EnvEnd = "CLIENT:ENV-END",
}

/*
# begin  
>client-connect cid kid
>client-env username Wei heng
>client-env password 123456
>client-env end
*/

export class NodeManager {
    socket: Socket;
    io: EventEmitter;
    notif: EventEmitter;
    client: EventEmitter;
    contractManager: ContractManager;
    private config : NodeConfig;

    private backlog: string;
    private current: IClientEvent;

    constructor(config : NodeConfig) {
        this.backlog = "";
        this.config = config
        this.socket = new Socket();
        this.io = new EventEmitter();
        this.notif = new EventEmitter();
        this.client = new EventEmitter();
        this.contractManager = new ContractManager();

        this.addSocketListeners();
        this.addIOListeners();
        this.addNotifListeners();
        this.addClientListeners();
        this.socket.connect(config.port,config.address)
    }

    private addSocketListeners() {
        this.socket.on("data", (data) =>
            this.io.emit("output", data.toString())
        );
    }

    private addIOListeners() {
        this.io.on("output", (data: string) => {
            if (data.startsWith("ENTER PASSWORD:"))
                return this.io.emit("enter-password");
            const lines = data.split("\n");
            lines[0] = this.backlog + lines[0];
            this.backlog = lines.pop();
            for (const line of lines) this.io.emit("line", line.trim());
        });

        this.io.on("line", (data: string) => {
            if (data.startsWith(">"))
                this.io.emit("notification", data.slice(1));
        });

        this.io.on("notification", (data: string) => {
            const match = data.match(/^([A-Z]+:[A-Z]+),(.+)$/);
            if (match) this.notif.emit(match[1], match[2]);
        });
        this.io.on("enter-password",() => {
            this.writeLine(this.config.password)
        })
    }

    private addNotifListeners() {
        for (const event of [
            EClientEvent.Connect,
            EClientEvent.Reauth,
            EClientEvent.Disconnect,
        ]) {
            this.notif.on(event, (data: string) => {
                const [CID, KID] = (data + ",").split(",");
                this.current = { CID, KID, event };
            });
        }
        this.notif.on(EClientEvent.Env, (data: string) => {
            if (data == "END") return this.notif.emit(EClientEvent.EnvEnd);
            const match = data.match(/^(\w+)=(.*)$/);
            if (match) this.current.env[match[1]] = match[2];
        });
        this.notif.on(EClientEvent.EnvEnd, () => {
            this.client.emit(this.current.event, this.current);
        });
    }

    private addClientListeners() {
        this.client.on(EClientEvent.Connect, (data: IClientEvent) => {
            const { CID, KID, env } = data;
            const { username, password } = env as {
                username: string;
                password: string;
            };
            if (this.contractManager.authorize(username, password)) {
                this.writeClientAuth(CID, KID);
            }
        });
    }

    write(content: string) {
        this.socket.write(content);
    }

    writeLine(line: string) {
        this.write(line + "\n");
    }

    connectUser(contract: Contract) {
        const { username, password } = contract;
    }

    writeClientAuth(CID: string, KID: string) {
        this.writeLine(`client-auth-nt ${CID} ${KID}`);
    }

    writeClientDeny(
        CID: string,
        KID: string,
        reason: string = "Unauthorized",
        clientReason: string
    ) {
        this.writeLine(
            `client-deny ${CID} ${KID} ${reason} ${clientReason ?? reason}`
        );
    }
}

export default NodeManager;
