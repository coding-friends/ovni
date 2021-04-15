import { readFileSync } from "fs";
export interface ServerConfig {
    port: number;
    secure?: boolean;
    publicKey?: string;
    certificate?: string;
    useCors?: boolean;
    address? : string
}

export interface NodeConfig {
    name: string;
    port: number;
    address : string;
    password?: string;
}

export interface AccessConfig {
    ip: string;
    secret?: string;
    secure?: string;
    extern?: string;
    nodes: string[];
}

export interface Config {
    server: ServerConfig;
    nodes: NodeConfig[];
    access: AccessConfig[];
}

export default class Configuration implements Config {
    server: ServerConfig;
    nodes: NodeConfig[];
    access: AccessConfig[];

    constructor(filename: string) {
        const rawConfig = readFileSync(filename, { encoding: "utf-8" });
        const configuration = JSON.parse(rawConfig);
        console.log(configuration)
        this.setData(configuration);
    }
    setData(configuration: Config) {
        this.server = configuration.server;
        this.nodes = configuration.nodes;
        this.access = configuration.access;
    }
}
