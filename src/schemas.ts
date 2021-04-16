export const contractSchema = {
    body: {
        type: "object",
        properties: {
            username: { type: "string" },
            password: { type: "string" },
            nodeName: { type: "string" },
            dieOnDisconnect: { type: "boolean" },
            requestTimeout: { type: "number" },
            connectionTTL: { type: "number" },
            callbackUrl: { type: "string" },
        },
        requiredProperties: [
            "username", "password", "nodeName"
        ],
    },
};
export const deleteContractSchema = {
    body: {
        type: "object",
        properties: {
            username: { type: "string" },
            nodeName: { type: "string" },
        },
        requiredProperties: [
            "username", "nodeName"
        ],
    },
};
