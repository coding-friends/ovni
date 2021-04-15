import { Indexable } from "./utils";
import { NodeManager } from "./NodeManager";
import { Authenticator } from "./Authenticator";
interface OvniNode {
  name: string;
  port: number;
  password: string;
}
interface NodeCollection {
  [name: string]: OvniNode;
}

interface NodeManagerCollection {
  [name: string]: NodeManager;
}

interface Client {
    username: string
    password: string
    targetNode: 
}

export default class MasterManager {
  private nodeCollection: NodeCollection;
  private nodeManagerCollection: NodeManagerCollection;
  private authenticator: Authenticator;
  private passwordManager: PasswordManager;
  private Config: Indexable;
  private configPath: string;
  constructor(configPath: string) {
    this.Config = require(configPath);
    this.configPath = configPath;
    this.nodeCollection = Object.assign(
      {},
      ...this.Config.nodes.map((node: OvniNode) => {
        const { name } = node;
        return { [name]: node };
      })
    );
    this.nodeManagerCollection = Object.assign(
      {},
      ...Object.keys(this.nodeCollection).map((name: string) => {
        const nodeManager = new NodeManager();
        return { name: nodeManager };
      })
    );
    this.authenticator = new Authenticator(this.configPath);
    this.passwordManager = new PasswordManager();
    this.initNodes();
  }

  handleConnection(username: string, password: string, targetNode: string) {
    if (!(targetNode in this.nodeManagerCollection)) {
      throw new Error(
        `targetNode ${targetNode} was not a valid target node. Please try again with a valid node`
      );
    }
    const nodeManager = this.nodeManagerCollection[targetNode];
  }
  initNodes() {
    const handleUserCallBack = (username: string, password: string) => {
      return this.passwordManager.authenticate(username, password);
    };
    Object.values(this.nodeManagerCollection).forEach((nodeManager) => {
      nodeManager.handleUser(handleUserCallBack);
    });
  }
}
