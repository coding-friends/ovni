import Configuration, {AccessConfig} from "./Configuration";
import { Dict, dictComp } from "./utils";

export class Authenticator {
  private config: Configuration;
  private ipMaps: Dict<AccessConfig>;
  constructor(config: Configuration) {
    this.config = config;
    this.ipMaps = dictComp(access => [access.ip,access], this.config.access)
  }

  authorize(ip: string, secret: string): boolean {
    if (ip in this.ipMaps) {
      const officialSecret = this.ipMaps[ip].secret;
      return secret === officialSecret;
    }
    return false;
  }
}

export default Authenticator;
