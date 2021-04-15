
import { WebApp } from "./WebApp";
import { ArgumentParser } from "argparse";
import Configuration from "./Configuration";
console.log("Welcome ... to the best OVNI")
const parser = new ArgumentParser({
  description: "The best OVNI of all",
});

parser.add_argument("-c", "--config", {
  help: "The path of the config file to use",
  "default": "./config.json",
  "type": "string",
});

const args = parser.parse_args();
const { config : configPath, port } = args;

// Example usage
const config = new Configuration(configPath)
const app = new WebApp(config);
app.start()
