import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { deposit } from "../services/walletService";
import { formatMinorUnitsToInrAmountString, parseInrAmountStringToMinorUnits } from "../utils/inrAmount";

const DEPOSIT_AMOUNT_ERROR =
  'Amount must be a positive INR amount string (e.g. "100" or "100.50")';

export const walletController = {
  getBalance: (req: Request, res: Response) => {
    const { user } = req as AuthenticatedRequest;
    return res.status(200).json({
      balance: formatMinorUnitsToInrAmountString(user.balanceInMinorUnits),
    });
  },

  deposit: async (req: Request, res: Response) => {
    const { user } = req as AuthenticatedRequest;
    const amountInMinorUnits = parseInrAmountStringToMinorUnits(req.body?.amount);
    if (amountInMinorUnits === null) {
      return res.status(400).json({ message: DEPOSIT_AMOUNT_ERROR });
    }
    const result = await deposit(user.id, amountInMinorUnits);
    return res.status(200).json({
      balance: formatMinorUnitsToInrAmountString(result.balanceInMinorUnits),
      transactionId: result.transactionId,
    });
  },
};
