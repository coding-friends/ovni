export interface Contract {
  username: string;
  password: string;
  nodeName: string;
  requestTimeout?: number;
  connectionTTL?: number;
  callbackURL?: string;
}

export default class ContractManager {
  private users: { [user: string]: Contract };

  constructor() {
    this.users = {};
  }

  add(contract: Contract) {
    const username = contract.username;
    this.users[username] = contract;
  }

  remove(username: string) {
    if (username in this.users) {
      delete this.users[username];
    }
  }

  authorize(username: string, password: string): boolean {
    if (username in this.users) {
      return this.users[username].password === password;
    }
    return false;
  }

  authenticate(username: string, password: string) {}
}
