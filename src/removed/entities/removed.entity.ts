import { Asset } from "src/assets/entities/asset.entity";
import { RemoveStatus } from "src/status/entities/remove-status.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Removed {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Asset, asset => asset.removed)
    @JoinColumn()
    asset: Asset;

    @CreateDateColumn()
    datecreate: Date;

    @Column({ nullable: false, comment: "รายระเอียด" })
    detail: string;

    @Column({ nullable: false, comment: "id พนักงาน", type: 'bigint' })
    staff_employee_id: number;

    @ManyToOne(() => RemoveStatus, removestatus => removestatus.remove, { nullable: false })
    status: RemoveStatus;

    @Column({ default: null, comment: "id ผู้อนุมัติ", type: 'bigint' })
    approved_id: number;

}
