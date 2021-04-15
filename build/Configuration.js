"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var Configuration = /** @class */ (function () {
    function Configuration(filename) {
        var rawConfig = fs_1.readFileSync(filename, { encoding: "utf-8" });
        var configuration = JSON.parse(rawConfig);
        console.log(configuration);
        this.setData(configuration);
    }
    Configuration.prototype.setData = function (configuration) {
        this.server = configuration.server;
        this.nodes = configuration.nodes;
        this.access = configuration.access;
    };
    return Configuration;
}());
exports["default"] = Configuration;
