import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import * as compression from "compression";
import * as morgan from "morgan";
import * as mongoose from "mongoose";
import { Config } from "./utils/config";
import routes from "./routes";

class Server {
    public app: express.Application;
    private port: number = 3000;

    constructor() {
        this.app = express();
        this.initMiddlewares();
        this.initRoutes();
        this.dbConnect();
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log("API is running at http://localhost:%d", this.port);
        });
    }

    private initRoutes(): void {
        this.app.use("/", routes);
    }

    private initMiddlewares(): void {
        // cross-origin support
        this.app.use(cors());

        // secure against common attacks
        this.app.use(helmet());

        // compress response body
        this.app.use(compression());

        // http requests logging
        this.app.use(morgan("combined"));

        // support application/json type post data
        this.app.use(bodyParser.json());

        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private dbConnect(): void {
        mongoose.connect(Config.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true })
            .then(async () => {
                console.info("Successfully connected");
            })
            .catch((error) => {
                console.error("Error connecting to database: ", error);
                return process.exit(1);
            });
    }
}

const server = new Server();
server.start();
