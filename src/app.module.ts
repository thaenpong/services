import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from './assets/assets.module';
import { DataSource } from 'typeorm';
import { CategoriesModule } from './categories/categories.module';
import { JobsModule } from './jobs/jobs.module';
import { StatusModule } from './status/status.module';
import { RemovedModule } from './removed/removed.module';
import { HistoriesModule } from './histories/histories.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '159.223.89.150',
    port: 3306,
    username: 'root',
    password: 'Admin1989',
    database: 'services',
    autoLoadEntities: true,
    synchronize: true,
  }), AssetsModule, CategoriesModule, JobsModule, StatusModule, RemovedModule, HistoriesModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
