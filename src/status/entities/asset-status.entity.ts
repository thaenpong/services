import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "src/assets/entities/asset.entity";

@Entity()
export class AssetStatus {
    //สถานะงาน

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Asset, asset => asset.status)
    asset: Asset[];
}