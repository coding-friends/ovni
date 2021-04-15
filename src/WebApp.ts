import { fastify, FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Authenticator } from "./Authenticator";
import { Contract } from "./ContractManager";
import MasterManager from "./MasterManager";
import { contractSchema } from "./schemas";

export class WebApp {
  router: FastifyInstance;
  private authenticator: Authenticator;
  private masterManager: MasterManager;
  constructor(configFile: string) {
    this.router = fastify();
    this.authenticator = new Authenticator(configFile);
    this.masterManager = new MasterManager(configFile);

    this.router.addHook("onRequest", (req, res, done) => {
      if (this.authenticator.authorize(req.ip, req.headers.authorization)) done();
      else
        res
          .code(401)
          .send(
            "Unauthorized. Please make sure you are accesssing it from a valid IP address using the correct secret."
          );
    });

    this.useEndpoints();
  }

  useEndpoints() {
    this.router.post("/contracts", { schema: contractSchema }, (req, res) => {
      const contract = req.body as Contract;
      this.masterManager.registerContract(contract);
    });

    this.router.get("/contracts/:nodeName/:username", (req, res) => {});
  }
}
