const INR_AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

/**
 * Convert INR amount string to paise.
 *
 * Examples:
 * "100" -> 10000
 * "100.5" -> 10050
 * "100.50" -> 10050
 * "0.01" -> 1
 */
export function parseInrAmountStringToMinorUnits(
  raw: unknown
): number | null {
  if (typeof raw !== "string") {
    return null;
  }

  const amount = raw.trim();

  if (!INR_AMOUNT_PATTERN.test(amount)) {
    return null;
  }

  const [rupeesPart, paisePart = ""] = amount.split(".");

  const rupees = Number(rupeesPart);
  const paise = Number(paisePart.padEnd(2, "0"));

  const minorUnits = rupees * 100 + paise;

  if (!Number.isSafeInteger(minorUnits) || minorUnits <= 0) {
    return null;
  }

  return minorUnits;
}

/**
 * Convert paise to INR amount string.
 *
 * Examples:
 * 10000 -> "100.00"
 * 10050 -> "100.50"
 * 1 -> "0.01"
 */
export function formatMinorUnitsToInrAmountString(
  minorUnits: number
): string {
  if (!Number.isInteger(minorUnits) || minorUnits < 0) {
    throw new Error(
      "minorUnits must be a non-negative integer"
    );
  }

  const rupees = Math.floor(minorUnits / 100);
  const paise = minorUnits % 100;

  return `${rupees}.${paise.toString().padStart(2, "0")}`;
}
