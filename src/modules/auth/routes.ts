import { Router } from 'express';
import { AuthController } from './controller';

export class AuthRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/');
    }
}