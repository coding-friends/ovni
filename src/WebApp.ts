import { fastify, FastifyInstance } from "fastify";
import { Authenticator } from "./Authenticator";
import Configuration from "./Configuration";
import { Contract } from "./ContractManager";
import MasterManager from "./MasterManager";
import { contractSchema, deleteContractSchema } from "./schemas";

export class WebApp {
    router: FastifyInstance;
    private authenticator: Authenticator;
    private config: Configuration;

    private masterManager: MasterManager;
    constructor(config: Configuration) {
        this.router = fastify();
        this.config = config;
        this.authenticator = new Authenticator(config);
        this.masterManager = new MasterManager(config);

        this.router.addHook("onRequest", (req, res, done) => {
            if (this.authenticator.authorize(req.ip, req.headers.authorization))
                done();
            else
                res.code(401).send(
                    "Unauthorized. Please make sure you are accesssing it from a valid IP address using the correct secret."
                );
        });

        this.useEndpoints();
    }

    useEndpoints() {
        this.router.post("/contracts", { schema: contractSchema }, (req,res) => {
            const contract = req.body as Contract;
            this.masterManager.registerContract(contract);
            res.send("Ok") 
            res.status(200)
        });
        this.router.get("/contracts", { schema: contractSchema }, (req,res) => {
            const contract = req.body as Contract;
            this.masterManager.registerContract(contract);
            res.send("Ok") 
            res.status(200)
        });
        this.router.delete("/contracts", { schema: deleteContractSchema }, (req,res) => {
            
            const contract = req.body as Contract;
            this.masterManager.deleteContract(contract)
            res.send("Ok") 
            res.status(200)
        });
    }

    start() {
        this.router.listen(this.config.server.port, this.config.server.address);
    }
}
