"use strict";
exports.__esModule = true;
exports.contractSchema = void 0;
exports.contractSchema = {
    body: {
        type: "object",
        properties: {
            username: { type: "string" },
            password: { type: "string" },
            nodeName: { type: "string" },
            requestTimeout: { type: "number" },
            connectionTTL: { type: "number" },
            callbackUrl: { type: "string" }
        }
    }
};
