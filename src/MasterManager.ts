import { Contract } from "./ContractManager";
import { NodeManager } from "./NodeManager";
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
  private Config: any;
  constructor(configPath: string) {
    this.Config = require(configPath);
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
  }

  // Master manager will then check if the nodeName is valid and add it to the connection manager
  registerContract(contract: Contract) {
    const { nodeName } = contract;
    if (!(nodeName in this.nodeManagerCollection)) {
    }
    const nodeManager = this.nodeManagerCollection[nodeName];
    if (!nodeManager) {
      throw new Error(
        `targetNode ${nodeName} was not a valid target node. Please try again with a valid node`
      );
    }
    nodeManager.contractManager.add(contract);
  }
}
