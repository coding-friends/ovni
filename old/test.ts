const { Manager } = require(".");

const manager = new Manager("192.168.0.101", 8899, "123456");
manager.addClient({
  username: "hello",
  password: "123456",
});
