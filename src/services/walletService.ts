import { AppDataSource } from "../config/data-source";
import { Transaction, TRANSACTION_TYPE_DEPOSIT } from "../entities/Transaction";
import { User } from "../entities/User";

export type DepositResult = {
  balanceInMinorUnits: number;
  transactionId: string;
};

export async function deposit(userId: string, amountInMinorUnits: number): Promise<DepositResult> {
  return AppDataSource.transaction(async (manager) => {
    const user = await manager.findOne(User, {
      where: { id: userId },
      lock: { mode: "pessimistic_write" },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const balanceAfterInMinorUnits = user.balanceInMinorUnits + amountInMinorUnits;

    const row = manager.create(Transaction, {
      user,
      type: TRANSACTION_TYPE_DEPOSIT,
      amountInMinorUnits,
      balanceAfterInMinorUnits,
    });
    await manager.save(row);

    user.balanceInMinorUnits = balanceAfterInMinorUnits;
    await manager.save(user);

    return { balanceInMinorUnits: balanceAfterInMinorUnits, transactionId: row.id };
  });
}
