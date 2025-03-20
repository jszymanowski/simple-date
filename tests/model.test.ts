import { describe, expect, test } from "vitest";
import ProperDate from "../lib";

describe("model", () => {
  describe("constructor", () => {
    test("with a yyyy-mm-dd formatted string", () => {
      const subject = new ProperDate("2023-12-25");
      expect(subject.toString()).toStrictEqual("2023-12-25");
      expect(subject.toDate()).toStrictEqual(new Date("2023-12-25T00:00:00.000Z"));
      expect(subject.year).toStrictEqual(2023);
      expect(subject.month).toStrictEqual(11);
      expect(subject.day).toStrictEqual(25);
    });

    test("with a JavaScript date", () => {
      const date = new Date("2023-12-25");
      const subject = new ProperDate(date);
      expect(subject.toString()).toStrictEqual("2023-12-25");
      expect(subject.toDate()).toStrictEqual(new Date("2023-12-25T00:00:00.000Z"));
      expect(subject.year).toStrictEqual(2023);
      expect(subject.month).toStrictEqual(11);
      expect(subject.day).toStrictEqual(25);
    });

    test("with a ProperDate", () => {
      const properDate = new ProperDate("2023-12-25");
      const subject = new ProperDate(properDate);
      expect(subject.toString()).toStrictEqual("2023-12-25");
      expect(subject.toDate()).toStrictEqual(new Date("2023-12-25T00:00:00.000Z"));
      expect(subject.year).toStrictEqual(2023);
      expect(subject.month).toStrictEqual(11);
      expect(subject.day).toStrictEqual(25);
    });
  });

  describe('comparison', () => {
    test('sorts in order', () => {
      const dates = [
        new ProperDate('2023-12-25'),
        new ProperDate('2024-12-20'),
        new ProperDate('2023-12-24'),
        new ProperDate('2023-12-26'),
      ];
      expect(dates.sort()).toEqual([
        new ProperDate('2023-12-24'),
        new ProperDate('2023-12-25'),
        new ProperDate('2023-12-26'),
        new ProperDate('2024-12-20'),
      ]);
    });

    test('compares correctly', () => {
      const dec_25_2023 = new ProperDate('2023-12-25');
      const dec_24_2023 = new ProperDate('2023-12-24');
      const dec_20_2024 = new ProperDate('2024-12-20');

      expect(dec_24_2023 > dec_25_2023).toBe(false);
      expect(dec_24_2023 < dec_25_2023).toBe(true);

      expect(dec_20_2024 < dec_25_2023).toBe(false);
      expect(dec_20_2024 > dec_25_2023).toBe(true);
    });
  });

  describe("#equals", () => {
    test("returns true if the dates are equal", () => {
      const subject = new ProperDate("2023-12-25");

      expect(subject.equals(new ProperDate("2023-12-25"))).toStrictEqual(true);
      expect(subject.equals(new ProperDate(new Date("2023-12-25")))).toStrictEqual(true);
      expect(subject.equals(new ProperDate(new Date(Date.UTC(2023, 11, 25))))).toStrictEqual(true);
    });

    test("returns false when the dates are not equal", () => {
      const subject = new ProperDate("2023-12-25");
      expect(subject.equals(new ProperDate("2023-12-24"))).toStrictEqual(false);
      expect(subject.equals(new ProperDate(new Date("2023-12-24")))).toStrictEqual(false);
      expect(subject.equals(new ProperDate(new Date(Date.UTC(2023, 11, 24))))).toStrictEqual(false);
    });
  });

  describe("#formatted", () => {
    test("returns the date as a string", () => {
      const subject = new ProperDate("2023-12-25");
      expect(subject.formatted).toStrictEqual("2023-12-25");
    });
  });

  describe("#priorYearEnd", () => {
    test("returns a ProperDate for 12/31 of the prior year", () => {
      const subject = new ProperDate("2023-12-25");
      expect(subject.priorYearEnd).toStrictEqual(new ProperDate("2022-12-31"));
    });
  });

  describe("#priorMonthEnd", () => {
    test("returns a ProperDate for the end of the prior month", () => {
      const subject = new ProperDate("2023-12-25");
      expect(subject.priorMonthEnd).toStrictEqual(new ProperDate("2023-11-30"));
    });
  });

  describe("#getEndOfNYearsAgo", () => {
    test("returns a ProperDate for 12/31 of the prior year", () => {
      const subject = new ProperDate("2023-12-25");
      expect(subject.getEndOfNYearsAgo(1)).toStrictEqual(new ProperDate("2022-12-31"));
      expect(subject.getEndOfNYearsAgo(2)).toStrictEqual(new ProperDate("2021-12-31"));
      expect(subject.getEndOfNYearsAgo(10)).toStrictEqual(new ProperDate("2013-12-31"));
    });
  });
});

describe("ProperDate collection", () => {
  test("sort() works as expected", () => {
    const dates = [
      new ProperDate("2021-07-22"),
      new ProperDate("2023-01-01"),
      new ProperDate("2024-10-15"),
      new ProperDate("2023-02-01"),
      new ProperDate("2022-12-31"),
    ];
    const expectedDates = [
      new ProperDate("2021-07-22"),
      new ProperDate("2022-12-31"),
      new ProperDate("2023-01-01"),
      new ProperDate("2023-02-01"),
      new ProperDate("2024-10-15"),
    ];

    expect(dates.slice().sort()).toEqual(expectedDates);
  });
});
