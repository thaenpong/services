import { Module } from '@nestjs/common';
import { RemovedService } from './removed.service';
import { RemovedController } from './removed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Removed } from './entities/removed.entity';
import { Asset } from 'src/assets/entities/asset.entity';
import { AssetStatus } from 'src/status/entities/asset-status.entyty';
import { RemoveStatus } from 'src/status/entities/remove-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RemoveStatus, Removed, Asset, AssetStatus])],
  controllers: [RemovedController],
  providers: [RemovedService]
})
export class RemovedModule { }
