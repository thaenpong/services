import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetDto } from './create-asset.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateAssetDto extends PickType(CreateAssetDto, ['code', 'serial_number', 'brand', 'type', 'spec', 'color', 'user_employee_id', 'note', 'warranty_expires', 'categories_id']) {
}