import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export type TransactionType = "deposit" | "withdrawal";

export const TRANSACTION_TYPE_DEPOSIT: TransactionType = "deposit";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "varchar", length: 32 })
  type!: TransactionType;

  @Column({ type: "integer" })
  amountInMinorUnits!: number;

  @Column({ type: "integer" })
  balanceAfterInMinorUnits!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
