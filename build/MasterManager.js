"use strict";
exports.__esModule = true;
var NodeManager_1 = require("./NodeManager");
var utils_1 = require("./utils");
var MasterManager = /** @class */ (function () {
    function MasterManager(config) {
        this.config = config;
        this.nodeManagerCollection = utils_1.dictComp(function (node) { return [node.name, new NodeManager_1.NodeManager(node)]; }, this.config.nodes);
    }
    // Master manager will then check if the nodeName is valid and add it to the connection manager
    MasterManager.prototype.registerContract = function (contract) {
        var nodeName = contract.nodeName;
        if (!(nodeName in this.nodeManagerCollection)) {
        }
        var nodeManager = this.nodeManagerCollection[nodeName];
        if (!nodeManager) {
            throw new Error("targetNode " + nodeName + " was not a valid target node. Please try again with a valid node");
        }
        nodeManager.contractManager.add(contract);
    };
    return MasterManager;
}());
exports["default"] = MasterManager;
