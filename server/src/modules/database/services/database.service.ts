import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';
import * as process from 'node:process';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger: Logger = new Logger(DatabaseService.name);

  async onModuleInit(): Promise<void> {
    this.logger.log('Connection to the database service...');

    mongoose.connection.on('connected', (): void => {
      this.logger.log('Successfully connected to MongoDB');
    });

    mongoose.connection.on('error', (err: []): void => {
      this.logger.error(`Error connecting to MongoDB: ${err}`);
    });

    mongoose.connection.on('disconnected', (): void => {
      this.logger.warn('MongoDB disconnected');
    });

    try {
      await mongoose.connect(<string>`${process.env.MONGODB_URL}`, {
        serverSelectionTimeoutMS: 5000,
      });
    } catch (error) {
      this.logger.error(`Error connecting to MongoDB: ${error.message}`);
    }
  }
}
