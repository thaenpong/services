import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Asset } from 'src/assets/entities/asset.entity';

@Module({
  // import Entity
  imports: [TypeOrmModule.forFeature([Category, Asset])],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule { }
