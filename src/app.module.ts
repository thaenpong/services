import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from './assets/assets.module';
import { Asset } from './assets/entities/asset.entity';
import { DataSource } from 'typeorm';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { JobsModule } from './jobs/jobs.module';
import { Job } from './jobs/entities/job.entity';
import { StatusModule } from './status/status.module';
import { RemovedModule } from './removed/removed.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    /* host: '159.223.89.150', */
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'services',
    autoLoadEntities: true,
    synchronize: true,
  }), AssetsModule, CategoriesModule, JobsModule, StatusModule, RemovedModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
