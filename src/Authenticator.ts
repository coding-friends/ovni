import { Indexable } from "./utils";
const configPath = "../config.json";

export class Authenticator {
  private configPath: string;
  private Config: Indexable;
  private ipMaps: Indexable;
  constructor(configPath: string) {
    this.configPath = configPath;
    this.Config = require(configPath);
    this.ipMaps = Object.assign(
      {},
      ...this.Config.access.map(({ ip, secret }: { ip: string; secret: string }) => ({
        [ip]: secret,
      }))
    );
  }

  authenticate(ip: string, secret: string): boolean {
    if (ip in this.ipMaps) {
      const officialSecret = this.ipMaps[secret];
      return secret === officialSecret;
    }
    return false;
  }
}

export default Authenticator;
