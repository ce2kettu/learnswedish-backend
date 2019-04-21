import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import * as compression from "compression";
import * as morgan from "morgan";
import * as mongoose from "mongoose";
import { Config } from "./utils";
import routes from "./routes";
import { routeNotFound, errorMiddleware } from "./middlewares/error";

class Server {
    public app: express.Application;
    private port: number = 3000;

    constructor() {
        this.app = express();
        this.config();
        this.initMiddlewares();
        this.initRoutes();
        this.routeNotFound();
        this.dbConnect();
        this.errorHandler();
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log("API is running at http://localhost:%d", this.port);
        });
    }

    private config() {
        // pretty print json
        this.app.set("json spaces", 2);
    }

    private initRoutes() {
        this.app.use("/api/v1", routes);
    }

    private routeNotFound() {
        this.app.use(routeNotFound);
    }

    private initMiddlewares() {
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

    private dbConnect() {
        mongoose.connect(Config.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
            .then(async () => {
                console.info("Successfully connected");
            })
            .catch((err) => {
                console.error("Error connecting to database: ", err);
                return process.exit(1);
            });
    }

    private errorHandler() {
        this.app.use(errorMiddleware);
    }
}

const server = new Server();
server.start();
