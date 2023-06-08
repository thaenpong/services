import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { Asset } from './entities/asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Module({
  //import entity
  imports: [TypeOrmModule.forFeature([Asset, Category, Job])],

  controllers: [AssetsController],
  providers: [AssetsService]
})
export class AssetsModule { }
