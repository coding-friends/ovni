import Configuration, {NodeConfig} from "./Configuration";
import { Contract } from "./ContractManager";
import { NodeManager } from "./NodeManager";
import { Dict, dictComp} from "./utils";

export default class MasterManager {
  private nodeManagerCollection: Dict<NodeManager>;
  private config: Configuration;
  constructor(config: Configuration) {
    this.config = config
    this.nodeManagerCollection = dictComp(node => [node.name, new NodeManager(node)],this.config.nodes)
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
