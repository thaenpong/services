import { Asset } from "src/assets/entities/asset.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, nullable: false, comment: "ชื่อ" })
    name: string

    @Column({ unique: true, nullable: false, comment: "ตัวย่อ" })
    shortname: string

    @Column({ nullable: false, comment: "ID ผู้สร้าง", type: 'bigint' })
    staff_employee_id: number

    @OneToMany(() => Asset, asset => asset.category)
    assets: Asset[];
}
