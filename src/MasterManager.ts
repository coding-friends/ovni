import { Contract, Indexable } from "./utils";
import { NodeManager } from "./NodeManager";
import { Authenticator } from "./Authenticator";
import ContractManager from "./ContractManager";
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

export default class MasterManager {
  private nodeCollection: NodeCollection;
  private nodeManagerCollection: NodeManagerCollection;
  private authenticator: Authenticator;
  private contractManager: ContractManager;
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
    this.contractManager = new ContractManager();
    this.initNodes();
  }

  // Master manager will then check if the nodeName is valid and add it to the connection manager
  addConnection(contract: Contract) {
    const { nodeName } = contract;
    if (!(nodeName in this.nodeManagerCollection)) {
      throw new Error(
        `targetNode ${nodeName} was not a valid target node. Please try again with a valid node`
      );
    }
    this.contractManager.add(contract);
  }
  initNodes() {
    const handleUserCallBack = (username: string, password: string) => {
      return this.contractManager.authorize(username, password);
    };
    Object.values(this.nodeManagerCollection).forEach((nodeManager) => {
      nodeManager.handleAuthentication(handleUserCallBack);
    });
  }
}
