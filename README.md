# Simple Failure

["Maybe Not" - Rich Hickey](https://www.youtube.com/watch?v=YR5WdGrpoug)

Simple errors as values. Intended to be used in a union instead of bieng a wrapper. Typescript can do better than Result/Optional/Maybe.

## How to use

Example function that can fail and handling the failure:

```
import { failure, isFailure } from 'simple-failure';

function safeSort(values: number[]): number[] | Failure<string> {
    if (values.includes(69)) {
        return failure("Naughty numbers aren't allowed");
    }
    return values.toSorted()
}

const sortedNumbers = safeSort([11, 22, 69, 12]);
if (isFailure(sortedNumbers)){
    console.log('error', getFailure(sortedNumbers));
    process.exit(1);
}
console.log(sortedNumbers);
```

Create Failure value:

```
import { failure } from 'simple-failure';

failure(new Error("something"));

```

Check if a value is a Failure:

```
import { isFailure } from 'simple-failure';

const result = doSomething(42);
if (isFailure(result)) {
    // handle failure
} else {
    // handle success
}

```

Throw the error inside the failure if the value is a failure:

```
import { throwFailure } from 'simple-failure';
const result = doSomething(42);
throwFailure(result)
// handle success
```

Get the error inside the failure if the value is a failure, returns undefined if it isn't:

```
import { getFailure } from 'simple-failure';
const result = doSomething(42);
const error = getFailure(result);
if (error) {
    console.log(error);
}
```

Wrap a block of code or a promise, and turn exceptions/rejections into Failures. Supports functions, async functions, and Promises

```
import { captureFailure, isFailure } from 'simple-failure';
const result = await captureFailure(async () => {
    const foo = await doSomething();
    const bar = await doSomethingElse();
    return foo + bar;
});

if(isFailure(result)) {
    //handle failure
} else {
    // handle success
}
```

## The problem this solves

The way languages with shitty typesystems handle errors as values is by using types like Optional or Result. A lot of current error as value solutions in the Typescript world just copy this, this library aims to fix that and simple solution that leverages Typescripts unions to let you handle errors in a better way.

The main problem with Optional or Result types are that they can't be narrowed back down to their original types in a backwards compatible way.

Lets say we have a function that returns a Result type, and some code that handles it

```
function doSomething(x: number): Result<number, MyError> { ... }

const answer = doSomething(42);
if (answer.isError()) {
  // hande the error
}
// do something with the answer
```

Some time later the doSomething function gets updated so it can't error anymore. This should be a good thing but because we used a Result it breaks existing consumers of the function.

```
function doSomething(x: number): number { ... }

const answer = doSomething(42);
if (answer.isError()) { // Now crashes. isError doesn't exist on type number

```

Instead of using a wrapper class we can use unions and this library instead, which will allow narrowing without breaking existing consumers

before:

```
function doSomething(x: number): number | Failure { ... }

const answer = doSomething(42);
if (isFailure(answer)) {
  // hande the error
}
// do something with the answer
```

After removing the ability to error

```
function doSomething(x: number): number

const answer = doSomething(42);
if (isFailure(answer)) {
  // will never get run now, but won't crash/type error
}
// do something with the answer
```
