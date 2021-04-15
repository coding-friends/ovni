"use strict";
exports.__esModule = true;
exports.WebApp = void 0;
var fastify_1 = require("fastify");
var Authenticator_1 = require("./Authenticator");
var MasterManager_1 = require("./MasterManager");
var schemas_1 = require("./schemas");
var WebApp = /** @class */ (function () {
    function WebApp(config) {
        var _this = this;
        this.router = fastify_1.fastify();
        this.config = config;
        this.authenticator = new Authenticator_1.Authenticator(config);
        this.masterManager = new MasterManager_1["default"](config);
        this.router.addHook("onRequest", function (req, res, done) {
            if (_this.authenticator.authorize(req.ip, req.headers.authorization))
                done();
            else
                res.code(401).send("Unauthorized. Please make sure you are accesssing it from a valid IP address using the correct secret.");
        });
        this.useEndpoints();
    }
    WebApp.prototype.useEndpoints = function () {
        var _this = this;
        this.router.post("/contracts", { schema: schemas_1.contractSchema }, function (req) {
            var contract = req.body;
            _this.masterManager.registerContract(contract);
        });
        this.router.get("/contracts/:nodeName/:username", function (req, res) { });
    };
    WebApp.prototype.start = function () {
        this.router.listen(this.config.server.port, this.config.server.address);
    };
    return WebApp;
}());
exports.WebApp = WebApp;
