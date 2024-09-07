import { Server } from '@overnightjs/core';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import UserController from './controllers/user.js';
import { mongoURI } from './config.js';
import cors from 'cors';

class AppServer extends Server {
  constructor() {
    super(true);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.setupControllers();
  }

  private setupControllers(): void {
    const userController = new UserController();
    super.addControllers([userController]);
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
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
server.start(PORT);