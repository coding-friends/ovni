"use strict";
exports.__esModule = true;
var ContractManager = /** @class */ (function () {
    function ContractManager() {
        this.users = {};
    }
    ContractManager.prototype.add = function (contract) {
        var username = contract.username;
        this.users[username] = contract;
    };
    ContractManager.prototype.remove = function (username) {
        if (username in this.users) {
            delete this.users[username];
        }
    };
    ContractManager.prototype.authorize = function (username, password) {
        if (username in this.users) {
            return this.users[username].password === password;
        }
        return false;
    };
    ContractManager.prototype.authenticate = function (username, password) { };
    return ContractManager;
}());
exports["default"] = ContractManager;
