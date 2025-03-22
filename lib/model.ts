
import { parseInput } from "./utils";
import { add, subtract, difference } from "./arithmetic";
import type { Period, ArithmeticOptions } from "./types";

export default class ProperDate {
  year: number;
  month: number;
  day: number;

  constructor(date: Date | ProperDate | string = new Date()) {
    const { year, month, day } = parseInput(date);
    this.year = year;
    this.month = month;
    this.day = day;
  }

  // experimental
  static compare(a: ProperDate, b: ProperDate) {
    console.warn(
      "EXPERIMENTAL: ProperDate.compare() is experimental and may be removed in a future release.",
    );
    return a.toDate().getTime() - b.toDate().getTime();
  }

  get formatted() {
    return this.toString();
  }

  get priorYearEnd(): ProperDate {
    return this.getEndOfNYearsAgo(1);
  }

  get priorMonthEnd(): ProperDate {
    return this.getEndOfNMonthsAgo(1);
  }

  equals(other: ProperDate): boolean {
    return this.toString() === other.toString();
  }

  toString(): string {
    return this.jsDate.toISOString().split("T")[0];
  }

  toJSON(): string {
    return this.toString();
  }

  toDate(): Date {
    return new Date(this.toString());
  }

  // deprecated
  getTime(): number {
    console.warn(
      "DEPRECATION WARNING: getTime() is deprecated and will be removed in a future release. Use toDate().getTime() instead.",
    );
    return this.toDate().getTime();
  }

  /**
   * Adds a specified number of units to the current date.
   * @param n - The number of units to add.
   * @param periodOrOptions - The period specifying the unit of measurement (e.g., 'days', 'months', 'years'), or an object containing the period.
   * @returns A new ProperDate instance with the added units.
   */
  add(n: number, periodOrOptions: Period | ArithmeticOptions): ProperDate {
    return add(this, n, typeof periodOrOptions === "string" ? { period: periodOrOptions } : periodOrOptions);
  }

  /**
   * Subtracts a specified number of units from the current date.
   * @param n - The number of units to subtract.
   * @param periodOrOptions - The period specifying the unit of measurement (e.g., 'days', 'months', 'years'), or an object containing the period.
   * @returns A new ProperDate instance with the subtracted units.
   */
  subtract(n: number, periodOrOptions: Period | ArithmeticOptions): ProperDate {
    return subtract(this, n, typeof periodOrOptions === "string" ? { period: periodOrOptions } : periodOrOptions);
  }

  /**
   * Calculates the absolute difference in days between this date and another date.
   * @param other - The date to compare against
   * @param period - The unit of measurement (currently only 'days' is supported)
   * @param options - An optional object specifying the desired `period` / unit of measurement for the difference (currently only 'days' is supported)
   * @returns The number of days between the dates
   * @throws Error when a period other than 'days' is provided
   */
  difference(other: ProperDate, options?: ArithmeticOptions): number {
    return difference(this, other, options);
  }

  endOfMonth(): ProperDate {
    return new ProperDate(new Date(Date.UTC(this.year, this.month + 1, 0)));
  }

  // TODO: Refactor to use the new period-based arithmetic. See https://github.com/jszymanowski/proper-date.js/issues/20
  getEndOfNMonthsAgo(n: number): ProperDate {
    console.warn("DEPRECATION WARNING: getEndOfNMonthsAgo() is deprecated and will be removed in a future release. Use subtract().endOfMonth() instead.");
    // return this.subtract(n, "months").endOfMonth();
    return new ProperDate(
      // `0` gives the last day of the previous month.
      new Date(Date.UTC(this.year, this.month - n + 1, 0)),
    );
  }

  // TODO: Refactor to use the new period-based arithmetic. See https://github.com/jszymanowski/proper-date.js/issues/20
  getEndOfNYearsAgo(n: number): ProperDate {
    const priorYear = this.toDate().getFullYear() - n;
    const priorYearEndDate = new Date(Date.UTC(priorYear, 11, 31));
    return new ProperDate(priorYearEndDate);
  }

  private get jsDate(): Date {
    return new Date(Date.UTC(this.year, this.month, this.day));
  }
}
