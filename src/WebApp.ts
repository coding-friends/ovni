import { fastify, FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { IncomingMessage, ServerResponse } from "node:http";
import { Authenticator } from "./Authenticator";
import MasterManager from "./MasterManager";
import { userSchema } from "./schemas";
import { Contract } from "./utils";

enum Endpoints {
  postClient = "/users",
}

export class WebApp {
  router: FastifyInstance;
  private authenticator: Authenticator;
  private masterManager: MasterManager;
  private configFile: string;
  constructor(configFile: string) {
    this.router = fastify();
    this.configFile = configFile;
    this.authenticator = new Authenticator(configFile);
    this.masterManager = new MasterManager(configFile);

    this.router.addHook("onRequest", (req, res, done) => {
      if (this.authenticator.authenticate(req.ip, req.headers.authorization)) done();
      else
        res
          .code(401)
          .send(
            "Unauthorized. Please make sure you are accesssing it from a valid IP address using the correct secret."
          );
    });

    this.initRoutes();
  }

  // TODO: when there is a post client connection, add the connection contract to the master manager
  initRoutes() {
    this.router.post(Endpoints.postClient, { schema: userSchema }, (req, res) => {
      // adds a client
      // TODO: Update the schema
      const contract = req.body as Contract;
      this.masterManager.addConnection(contract);
    });
  }
}
