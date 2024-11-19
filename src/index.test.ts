import { describe, test, expect } from "vitest";
import {
  captureFailure,
  failure,
  getFailure,
  isFailure,
  throwFailure,
} from ".";

describe("Failure", () => {
  describe("failure()", () => {
    test("creates a valid failure", () => {
      expect(failure("error")).toEqual({
        __is_failure: true,
        error: "error",
      });
    });
  });

  describe("isFailure()", () => {
    test("returns true on a failure object", () => {
      expect(
        isFailure({
          __is_failure: true,
          error: "error",
        }),
      ).toBe(true);
    });

    test("returns false when not a failure object", () => {
      expect(isFailure("Hello")).toBe(false);
    });
  });

  describe("getFailure()", () => {
    test("returns the error inside a failure object", () => {
      expect(
        getFailure({
          __is_failure: true,
          error: "error",
        }),
      ).toBe("error");
    });

    test("returns undefined when not a failure object", () => {
      expect(getFailure("Hello")).toBe(undefined);
    });
  });

  describe("throwFailure()", () => {
    test("throws the error inside the failure object", () => {
      expect(() =>
        throwFailure({
          __is_failure: true,
          error: "error",
        }),
      ).toThrowError("error");
    });

    test("does nothing if not a failure object", () => {
      expect(() => throwFailure("hello")).not.toThrowError();
    });
  });

  describe("captureFailure()", () => {
    test("returns a failure object if passed a function that throws", () => {
      expect(
        captureFailure(() => {
          throw "error";
        }),
      ).toEqual({
        __is_failure: true,
        error: "error",
      });
    });

    test("returns a failure object if passed an async function that throws", async () => {
      const result = await captureFailure(async () => {
        throw "error";
      });
      expect(result).toEqual({
        __is_failure: true,
        error: "error",
      });
    });

    test("returns a failure object if passed a Promise that rejects", async () => {
      const result = await captureFailure(
        new Promise((_, reject) => reject("error")),
      );
      expect(result).toEqual({
        __is_failure: true,
        error: "error",
      });
    });

    test("returns the result of a function if passed a function that doesn't throw", () => {
      expect(
        captureFailure(() => {
          return "success";
        }),
      ).toEqual("success");
    });

    test("returns the result of a function if passed an async function that doesn't throw", async () => {
      const result = await captureFailure(async () => {
        return "success";
      });
      expect(result).toEqual("success");
    });

    test("returns the result of a Promise that resolves", async () => {
      const result = await captureFailure(
        new Promise((resolve) => resolve("success")),
      );
      expect(result).toEqual("success");
    });
  });
});
