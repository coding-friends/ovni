#!/usr/bin/env node

import { WebApp } from "./WebApp";
import { ArgumentParser } from "argparse";
const { version } = require("package.json");

const parser = new ArgumentParser({
  description: "Argparse example",
});

parser.add_argument("-v", "--version", { action: "version", version });
parser.add_argument("-p", "--port", {
  help: "The port to use",
  default: 8090,
  type: "number",
});
parser.add_argument("-c", "--config", {
  help: "The path of the config file to use",
  default: "./config.json",
  type: "string",
});

const args = parser.parse_args();
const { config, port } = args;

// Example usage
console.log(port);
const app = new WebApp(config);
