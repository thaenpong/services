import { Asset } from "src/assets/entities/asset.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AssetStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Asset, asset => asset.status)
    asset: Asset[];
}
