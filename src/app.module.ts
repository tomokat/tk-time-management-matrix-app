import { GoogleStraetgy } from './security/google.strategy';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/configuration';

import { LabelModule } from './label/label.module';
import { TaskItemModule } from './task-item/task-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [configuration]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../client-app/www'),
      //rootPath: join(__dirname, '..', '../cdn-test'),
    }),
    MongooseModule.forRoot(process.env.dbConnect),
    LabelModule,
    TaskItemModule],
  controllers: [AppController],
  providers: [AppService, GoogleStraetgy],
})
export class AppModule {}
