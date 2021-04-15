interface ServerConfig {
  port: number;
  secure?: boolean;
  publicKey?: string;
  certificate?: string;
  useCors?: boolean;
}

interface NodeConfig {
  name: string;
  port: number;
  password?: string;
}

interface AccessConfig {
  ip: string;
  secret?: string;
  secure?: string;
  extern?: string;
  nodes: string[];
}

interface Config {
  server: ServerConfig;
  nodes: NodeConfig[];
  access: AccessConfig[];
}

export default class Configuration implements Config {
  server: ServerConfig;
  nodes: NodeConfig[];
  access: AccessConfig[];

  constructor(filename: string) {}
}
