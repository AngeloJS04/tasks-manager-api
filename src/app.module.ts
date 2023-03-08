import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appDataSourceOptions } from 'src/database';
import { AuthModule } from './auth/auth.module';
import { configSchema } from './config.schema';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema
    }),
    TypeOrmModule.forRoot(appDataSourceOptions),
    TasksModule,
    AuthModule
  ],

})
export class AppModule { }
