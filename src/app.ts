/* import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors'; */
import * as mongoose from 'mongoose';
//import { UserModel } from './modules/user';
import { DeckModel } from './modules/deck';
import { Config } from './utils/config';

const MONGO_URL = `mongodb://${process.env.NODE_ENV === 'prod' ? `${Config.DB_USERNAME}:${Config.DB_PASSWORD}@` : ''}${Config.DB_HOST}:${Config.DB_PORT}/${Config.DATABASE}`;

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true })
    .then(async () => {
        console.info('Successfully connected');

        /* const u = new UserModel({
          username: 'tester',
          email: 'test@google.com',
          password: 'helloworld',
          firstName: 'Tester',
          lastName: 'Test',
        });

        await u.save();
        const user = await UserModel.findOne();

        console.log(user); */

        const d = new DeckModel({
            userId: 'kek',
            title: 'test',
            description: 'adsgg'
        });

        await d.save();
        const deck = await DeckModel.findOne();
        console.log(deck);
    })
    .catch((error) => {
        console.error('Error connecting to database: ', error);
        return process.exit(1);
    });
