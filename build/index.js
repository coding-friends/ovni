"use strict";
exports.__esModule = true;
var WebApp_1 = require("./WebApp");
var argparse_1 = require("argparse");
var Configuration_1 = require("./Configuration");
console.log("Welcome ... to the best OVNI");
var parser = new argparse_1.ArgumentParser({
    description: "The best OVNI of all"
});
parser.add_argument("-c", "--config", {
    help: "The path of the config file to use",
    "default": "./config.json",
    "type": "string"
});
var args = parser.parse_args();
var configPath = args.config, port = args.port;
// Example usage
var config = new Configuration_1["default"](configPath);
var app = new WebApp_1.WebApp(config);
app.start();
