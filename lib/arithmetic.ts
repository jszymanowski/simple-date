import ProperDate from "./model";
import type { Period, ArithmeticOptions } from "./types";

// TODO: Refactor this to not use Date: https://github.com/jszymanowski/proper-date.js/issues/21
export const add = (base: ProperDate, n: number, period: Period): ProperDate => {
  if (n !== Math.round(n)) {
    throw new Error(`Value '${n}' is not an integer`);
  }

  if (period === "day" || period === "days") {
    const baseDate = base.toDate();
    const newDate = new Date(baseDate.getTime());
    newDate.setDate(baseDate.getDate() + n);
    return new ProperDate(newDate);
  }
  if (period === "month" || period === "months") {
    const baseDate = base.toDate();
    const targetDate = new Date(
      Date.UTC(baseDate.getFullYear(), baseDate.getMonth() + n, baseDate.getDate()),
    );

    // Handle cases where the target date overflows to the next month
    // // Calculate expected month: original month + n, then take modulo 12
    const expectedMonth = (((baseDate.getMonth() + n) % 12) + 12) % 12;
    if (targetDate.getMonth() !== expectedMonth) {
      targetDate.setDate(0); // Set to the last day of the previous month
    }

    return new ProperDate(targetDate);
  }
  if (period === "year" || period === "years") {
    const baseDate = base.toDate();
    return new ProperDate(
      new Date(Date.UTC(baseDate.getFullYear() + n, baseDate.getMonth(), baseDate.getDate())),
    );
  }

  throw new Error(`Period '${period}' is not supported`);
};

export const subtract = (base: ProperDate, n: number, period: Period): ProperDate => {
  return add(base, -1 * n, period);
};

const DEFAULT_OPTIONS: ArithmeticOptions = { period: "days" };

export const difference = (
  base: ProperDate,
  other: ProperDate,
  options: ArithmeticOptions = DEFAULT_OPTIONS,
): number => {
  const { period = "days" } = options;

  if (period !== "days") {
    throw new Error(`Unsupported option: period=${period}`);
  }
  const diffInMilliseconds = Math.abs(base.toDate().getTime() - other.toDate().getTime());
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  return diffInDays;
};
