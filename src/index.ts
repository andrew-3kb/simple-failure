export type Failure<T = unknown> = { __is_failure: true; error: T };

export const failure = <T>(error: T): Failure<T> => {
  return { __is_failure: true, error };
};

export const isFailure = <T, E>(
  possibleFailure: T | Failure<E>,
): possibleFailure is Failure<E> => {
  return !!(
    typeof possibleFailure === "object" &&
    possibleFailure &&
    "__is_failure" in possibleFailure &&
    possibleFailure.__is_failure
  );
};

export const getFailure = <T>(
  possibleFailure: T,
): T extends Failure<infer E> ? E : undefined => {
  if (isFailure(possibleFailure)) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return (possibleFailure as any).error;
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return undefined as any;
};

export function throwFailure<T, E>(
  possibleFailure: T | Failure<E>,
): asserts possibleFailure is T {
  if (isFailure(possibleFailure)) {
    throw possibleFailure.error;
  }
}

const isPromise = (
  possiblePromise: unknown,
): possiblePromise is Promise<unknown> => {
  return (
    typeof possiblePromise === "object" &&
    possiblePromise !== null &&
    "then" in possiblePromise &&
    "catch" in possiblePromise &&
    typeof possiblePromise.then === "function" &&
    typeof possiblePromise.catch === "function"
  );
};

export const captureFailure = <
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T extends (() => any) | Promise<any>,
  E = unknown,
>(
  captured: T,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): T extends Promise<any>
  ? Promise<Awaited<T> | Failure<E>>
  : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    T extends () => Promise<any>
    ? Promise<Awaited<ReturnType<T> | Failure<E>>>
    : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      T extends () => any
      ? ReturnType<T> | Failure<E>
      : never => {
  if (isPromise(captured)) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return captured.catch((e: E) => failure(e)) as any;
  }

  try {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const result = (captured as any)();
    if (isPromise(result)) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return result.catch((e: E) => failure(e)) as any;
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return result as any;
  } catch (e: unknown) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return failure(e as E) as any;
  }
};
