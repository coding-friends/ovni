export const userSchema = {
  body: {
    type: "object",
    properties: {
      username: { type: "string" },
      password: { type: "string" },
      nodeName: { type: "string" },
      requestTimeout: { type: "number" },
      connectionTTL: { type: "number" },
      callbackUrl: { type: "string" },
    },
  },
};
