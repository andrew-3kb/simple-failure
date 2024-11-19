import { describe, test, expectTypeOf } from "vitest";
// biome-ignore lint/style/useImportType: <explanation>
import {
  captureFailure,
  Failure,
  failure,
  getFailure,
  isFailure,
  throwFailure,
} from ".";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const anyValue = (): any => {
  return undefined;
};

describe("Failure", () => {
  describe("failure()", () => {
    test("creates an inferred Failure type", () => {
      expectTypeOf(failure("error")).toEqualTypeOf<Failure<string>>();
      expectTypeOf(failure(2)).toEqualTypeOf<Failure<number>>();
    });
  });

  describe("isFailure()", () => {
    test("splits union type up", () => {
      const possibleFailure: Failure<string> | boolean = anyValue();
      if (isFailure(possibleFailure)) {
        expectTypeOf(possibleFailure).toEqualTypeOf<Failure<string>>();
      } else {
        expectTypeOf(possibleFailure).toEqualTypeOf<boolean>();
      }
    });

    test("if passed non failure type wont give type errors on true branch", () => {
      const nonFailure: boolean = anyValue();
      if (isFailure(nonFailure)) {
        expectTypeOf(nonFailure).toEqualTypeOf<boolean & Failure<unknown>>();
      } else {
        expectTypeOf(nonFailure).toEqualTypeOf<boolean>();
      }
    });

    test("if passed failure type will give never on false branch", () => {
      const failureValue: Failure<string> = anyValue();
      if (isFailure(failureValue)) {
        expectTypeOf(failureValue).toEqualTypeOf<Failure<string>>();
      } else {
        expectTypeOf(failureValue).toEqualTypeOf<never>();
      }
    });
  });

  describe("getFailure()", () => {
    test("infers error type or undefined on union", () => {
      const possibleFailure: Failure<string> | boolean = anyValue();
      const result = getFailure(possibleFailure);
      expectTypeOf(result).toEqualTypeOf<string | undefined>();
    });

    test("if passed non failure type infers undefined", () => {
      const nonFailure: boolean = anyValue();
      const result = getFailure(nonFailure);
      expectTypeOf(result).toEqualTypeOf<undefined>();
    });

    test("if passed failure type extracts the error type", () => {
      const failureValue: Failure<string> = anyValue();
      const result = getFailure(failureValue);
      expectTypeOf(result).toEqualTypeOf<string>();
    });
  });

  describe("throwFailure()", () => {
    test("splits union type up", () => {
      const possibleFailure: Failure<string> | boolean = anyValue();
      throwFailure(possibleFailure);
      expectTypeOf(possibleFailure).toEqualTypeOf<boolean>();
    });

    test("if passed non failure type doesn't change the type", () => {
      const nonFailure: boolean = anyValue();
      throwFailure(nonFailure);
      expectTypeOf(nonFailure).toEqualTypeOf<boolean>();
    });

    test("if passed failure type doesn't change the type", () => {
      const failureValue: Failure<string> = anyValue();
      throwFailure(failureValue);
      expectTypeOf(failureValue).toEqualTypeOf<Failure<string>>();
    });
  });

  describe("captureFailure()", () => {
    test("infers return type if passed function", () => {
      const result = captureFailure(() => {
        return 2;
      });
      expectTypeOf(result).toEqualTypeOf<number | Failure<unknown>>();
    });

    test("infers return type if passed async function", () => {
      const result = captureFailure(async () => {
        return 2;
      });
      expectTypeOf(result).toEqualTypeOf<Promise<number | Failure<unknown>>>();
    });

    test("infers return type if passed promise", async () => {
      const result = captureFailure(
        new Promise<number>((_, reject) => reject("error")),
      );
      expectTypeOf(result).toEqualTypeOf<Promise<number | Failure<unknown>>>();
    });

    test("can be passed the error type as a generic", () => {
      const result = captureFailure<() => number, string>(() => {
        return 2;
      });
      expectTypeOf(result).toEqualTypeOf<number | Failure<string>>();
    });
  });
});
