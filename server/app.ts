// src/app.ts or src/server.ts
import { Server } from '@overnightjs/core';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { UserController } from './controllers/UserController';
import { mongoURI } from './config';
import cors from 'cors';

class AppServer extends Server {
  constructor() {
    super(true);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors({ origin: '*' }));  
    this.app.options('*', cors()); 
    this.setupControllers();
  }

  private setupControllers(): void {
    const userController = new UserController();
    this.addControllers([userController]);
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server listening on port: ${port}`);
    });
  }
}

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const server = new AppServer();
const PORT: number = 5000;
server.start(PORT);
