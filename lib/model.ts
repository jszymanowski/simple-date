import type { ProperDateInterface } from "./interface";

export default class ProperDate implements ProperDateInterface {
  year: number;
  month: number;
  day: number;

  constructor(date: Date | ProperDate | string = new Date()) {
    if (date instanceof Date) {
      this.year = date.getFullYear();
      this.month = date.getMonth();
      this.day = date.getDate();
    } else if (date instanceof ProperDate) {
      this.year = date.year;
      this.month = date.month;
      this.day = date.day;
    } else if (typeof date === "string") {
      const parsedDate = new Date(date);
      this.year = parsedDate.getFullYear();
      this.month = parsedDate.getMonth();
      this.day = parsedDate.getDate();
    } else {
      throw new Error(
        "Date must be either a Date, ProperDate, or stringified date"
      );
    }
  }

  // TODO: move to a factory
  static get Today(): ProperDate {
    return new ProperDate();
  }

  // TODO: move to a factory
  static get Yesterday(): ProperDate {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    return new ProperDate(now);
  }

  static compare(a: ProperDate, b: ProperDate) {
    return a.getTime() - b.getTime();
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

  // TODO: deprecated
  formatDateDifference(other: ProperDate): string {
    console.warn(
      "Warning: formatDateDifference() is deprecated and will be removed prior to v1.0.0."
    );

    const baseDate = this.toUTCDatetime();
    const pastDate = other.toUTCDatetime();

    const diffMs = baseDate.getTime() - pastDate.getTime();
    const numDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (numDays === 0) {
      return "today";
    }
    if (numDays === 1) {
      return "yesterday";
    }
    if (numDays > 30) {
      const numMonths = Math.floor(numDays / 30.42); // Approximation for months
      return `${numMonths} month${numMonths > 1 ? "s" : ""} ago`;
    }

    return `${numDays} day${numDays > 1 ? "s" : ""} ago`;
  }

  toString(): string {
    return this.jsDate.toISOString().split("T")[0];
  }

  toJSON(): string {
    // serialize to JSON
    return this.toString();
  }

  toDate(): Date {
    return this.toUTCDatetime();
  }

  // TODO: deprecated
  toUTCDatetime(): Date {
    console.warn(
      "Warning: toUTCDatetime() is deprecated and will be removed prior to v1.0.0.  Use toDate() instead."
    );
    return new Date(this.toString());
  }

  // TODO: This is used to sort ProperDate objects.  Can we do something better?
  getTime(): number {
    return this.toUTCDatetime().getTime();
  }

  // TODO: Make this a generic 'add' function that also takes a 'unit' parameter
  addDays(n: number): ProperDate {
    const baseDate = this.toUTCDatetime();
    const newDate = baseDate;
    newDate.setDate(baseDate.getDate() + n);
    return new ProperDate(newDate);
  }

  // TODO: use a similar pattern as addDays
  getDateNDaysAgo(n: number): ProperDate {
    const baseDate = this.toUTCDatetime();
    const newDate = baseDate;
    newDate.setDate(baseDate.getDate() - n);
    return new ProperDate(newDate);
  }

  getDateNMonthsAgo(n: number): ProperDate {
    const baseDate = this.toUTCDatetime();
    const targetDate = new Date(
      Date.UTC(
        baseDate.getFullYear(),
        baseDate.getMonth() - n,
        baseDate.getDate()
      )
    );

    // Handle cases where the target date overflows to the next month
    if (targetDate.getMonth() !== (baseDate.getMonth() - n + 12) % 12) {
      targetDate.setDate(0); // Set to the last day of the previous month
    }

    return new ProperDate(targetDate);
  }

  getDateNYearsAgo(n: number): ProperDate {
    const baseDate = this.toUTCDatetime();
    return new ProperDate(
      new Date(
        Date.UTC(
          baseDate.getFullYear() - n,
          baseDate.getMonth(),
          baseDate.getDate()
        )
      )
    );
  }

  getEndOfNMonthsAgo(n: number): ProperDate {
    return new ProperDate(
      // `0` gives the last day of the previous month.
      new Date(Date.UTC(this.year, this.month - n + 1, 0))
    );
  }

  getEndOfNYearsAgo(n: number): ProperDate {
    const priorYear = this.toUTCDatetime().getFullYear() - n;
    const priorYearEndDate = new Date(Date.UTC(priorYear, 11, 31));
    return new ProperDate(priorYearEndDate);
  }

  private get jsDate(): Date {
    return new Date(Date.UTC(this.year, this.month, this.day));
  }
}
