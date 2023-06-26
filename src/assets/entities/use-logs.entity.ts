import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "./asset.entity";

@Entity()
export class Uselogs {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    fromdate: Date;

    @Column({ type: 'bigint', nullable: false, })
    user_employee_id: number;

    @Column({ type: 'bigint', nullable: false, })
    from_staff_employee_id: number;

    @Column({ type: 'timestamp', default: null })
    todate: Date;

    @Column({ type: 'bigint', default: null })
    to_staff_employee_id: number;

    @Column({ default: null })
    detail: string;

    @ManyToOne(() => Asset, asset => asset.uselog)
    asset: Asset
}