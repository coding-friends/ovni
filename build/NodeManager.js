"use strict";
exports.__esModule = true;
exports.NodeManager = void 0;
var net_1 = require("net");
var events_1 = require("events");
var ContractManager_1 = require("./ContractManager");
var EClientEvent;
(function (EClientEvent) {
    EClientEvent["Connect"] = "CLIENT:CONNECT";
    EClientEvent["Reauth"] = "CLIENT:REAUTH";
    EClientEvent["Disconnect"] = "CLIENT:DISCONNECT";
    EClientEvent["Env"] = "CLIENT:ENV";
    EClientEvent["EnvEnd"] = "CLIENT:ENV-END";
})(EClientEvent || (EClientEvent = {}));
/*
# begin
>client-connect cid kid
>client-env username Wei heng
>client-env password 123456
>client-env end
*/
var NodeManager = /** @class */ (function () {
    function NodeManager(config) {
        this.backlog = "";
        this.config = config;
        this.socket = new net_1.Socket();
        this.io = new events_1.EventEmitter();
        this.notif = new events_1.EventEmitter();
        this.client = new events_1.EventEmitter();
        this.contractManager = new ContractManager_1["default"]();
        this.addSocketListeners();
        this.addIOListeners();
        this.addNotifListeners();
        this.addClientListeners();
        this.socket.connect(config.port, config.address);
    }
    NodeManager.prototype.addSocketListeners = function () {
        var _this = this;
        this.socket.on("data", function (data) {
            return _this.io.emit("output", data.toString());
        });
    };
    NodeManager.prototype.addIOListeners = function () {
        var _this = this;
        this.io.on("output", function (data) {
            if (data.startsWith("ENTER PASSWORD:"))
                return _this.io.emit("enter-password");
            var lines = data.split("\n");
            lines[0] = _this.backlog + lines[0];
            _this.backlog = lines.pop();
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                _this.io.emit("line", line.trim());
            }
        });
        this.io.on("line", function (data) {
            if (data.startsWith(">"))
                _this.io.emit("notification", data.slice(1));
        });
        this.io.on("notification", function (data) {
            var match = data.match(/^([A-Z]+:[A-Z]+),(.+)$/);
            if (match)
                _this.notif.emit(match[1], match[2]);
        });
        this.io.on("enter-password", function () {
            _this.writeLine(_this.config.password);
        });
    };
    NodeManager.prototype.addNotifListeners = function () {
        var _this = this;
        var _loop_1 = function (event_1) {
            this_1.notif.on(event_1, function (data) {
                var _a = (data + ",").split(","), CID = _a[0], KID = _a[1];
                _this.current = { CID: CID, KID: KID, event: event_1 };
            });
        };
        var this_1 = this;
        for (var _i = 0, _a = [
            EClientEvent.Connect,
            EClientEvent.Reauth,
            EClientEvent.Disconnect,
        ]; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            _loop_1(event_1);
        }
        this.notif.on(EClientEvent.Env, function (data) {
            if (data == "END")
                return _this.notif.emit(EClientEvent.EnvEnd);
            var match = data.match(/^(\w+)=(.*)$/);
            if (match)
                _this.current.env[match[1]] = match[2];
        });
        this.notif.on(EClientEvent.EnvEnd, function () {
            _this.client.emit(_this.current.event, _this.current);
        });
    };
    NodeManager.prototype.addClientListeners = function () {
        var _this = this;
        this.client.on(EClientEvent.Connect, function (data) {
            var CID = data.CID, KID = data.KID, env = data.env;
            var _a = env, username = _a.username, password = _a.password;
            if (_this.contractManager.authorize(username, password)) {
                _this.writeClientAuth(CID, KID);
            }
        });
    };
    NodeManager.prototype.write = function (content) {
        this.socket.write(content);
    };
    NodeManager.prototype.writeLine = function (line) {
        this.write(line + "\n");
    };
    NodeManager.prototype.connectUser = function (contract) {
        var username = contract.username, password = contract.password;
    };
    NodeManager.prototype.writeClientAuth = function (CID, KID) {
        this.writeLine("client-auth-nt " + CID + " " + KID);
    };
    NodeManager.prototype.writeClientDeny = function (CID, KID, reason, clientReason) {
        if (reason === void 0) { reason = "Unauthorized"; }
        this.writeLine("client-deny " + CID + " " + KID + " " + reason + " " + (clientReason !== null && clientReason !== void 0 ? clientReason : reason));
    };
    return NodeManager;
}());
exports.NodeManager = NodeManager;
exports["default"] = NodeManager;
