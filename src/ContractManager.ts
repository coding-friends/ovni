import NodeManager from "./NodeManager";

export interface Contract {
    username: string;
    password: string;
    nodeName: string;
    active?: boolean;
    dieOnDisconnect?: boolean;
    requestTimeout?: number;
    connectionTTL?: number;
    callbackURL?: string;
    requestTimeoutID?: NodeJS.Timeout;
    connectionTTLID?: NodeJS.Timeout;
}

export default class ContractManager {
    private users: { [user: string]: Contract };
    private manager: NodeManager;
    constructor(manager: NodeManager) {
        this.users = {};
        this.manager = manager;
    }

    add(contract: Contract) {
        const username = contract.username;
        this.users[username] = contract;
        if (contract.connectionTTL) {
            contract.connectionTTLID = setTimeout(() => {
                this.manager.deleteContract(contract)
            }, contract.connectionTTL)
        }
        if (contract.requestTimeout) {
            setTimeout(() => {
                this.manager.deleteContract(contract)
            }, contract.requestTimeout);
        }
    }

    remove(username: string) {
        this.handleDisconnect(this.getByUsername(username))
        if (username in this.users) {
            delete this.users[username];
        }
    }

    getByUsername(username: string) {
        return this.users[username];
    }

    authorize(username: string, password: string): boolean {
        if (username in this.users) {
            return this.users[username].password === password;
        }
        return false;
    }

    handleConnect(contract : Contract){
        clearTimeout(contract.requestTimeoutID)
        contract.requestTimeoutID = null
    }

    handleDisconnect(contract : Contract){
        clearTimeout(contract.connectionTTLID)
        contract.connectionTTLID = null
    }

}
