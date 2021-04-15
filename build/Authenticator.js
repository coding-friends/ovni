"use strict";
exports.__esModule = true;
exports.Authenticator = void 0;
var utils_1 = require("./utils");
var Authenticator = /** @class */ (function () {
    function Authenticator(config) {
        this.config = config;
        this.ipMaps = utils_1.dictComp(function (access) { return [access.ip, access]; }, this.config.access);
    }
    Authenticator.prototype.authorize = function (ip, secret) {
        if (ip in this.ipMaps) {
            var officialSecret = this.ipMaps[ip].secret;
            return secret === officialSecret;
        }
        return false;
    };
    return Authenticator;
}());
exports.Authenticator = Authenticator;
exports["default"] = Authenticator;
