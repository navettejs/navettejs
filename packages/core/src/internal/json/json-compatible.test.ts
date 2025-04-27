import { Equal, Expect, ExpectFalse } from 'type-testing';
import { JSONCompatible } from './json-compatible.ts';

describe('JSONCompatible<T>', () => {
  test('should be ok with raw strings', () => {
    type test_ok = Expect<Equal<JSONCompatible<string>, string>>;
  });

  test('should be ok with raw number', () => {
    type test_ok = Expect<Equal<JSONCompatible<number>, number>>;
  });

  test('should be ok with raw boolean', () => {
    type test_ok = Expect<Equal<JSONCompatible<boolean>, boolean>>;
  });

  test('should be ko with raw Function', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    type test_ko = ExpectFalse<Equal<JSONCompatible<Function>, Function>>;
  });

  test('should be ok with an object with only json compatible values', () => {
    type myTest = {
      a: string;
      b: number[];
      c: boolean;
      d: undefined;
      e: null;
      f: string | null;
    };

    type test_ko = Expect<Equal<JSONCompatible<myTest>, myTest>>;
  });

  test('should be ko with an object with a function attribute', () => {
    type myTest = {
      a: string;
      b: number[];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      c: Function;
      d: undefined;
      e: null;
      f: string | null;
    };

    type test_ko = ExpectFalse<Equal<JSONCompatible<myTest>, myTest>>;
  });

  test('should be ko with an object with a symbol attribute', () => {
    type myTest = {
      a: string;
      b: number[];
      c: symbol;
      d: undefined;
      e: null;
      f: string | null;
    };

    type test_ko = ExpectFalse<Equal<JSONCompatible<myTest>, myTest>>;
  });

  test('should be ko with an object with a bigint attribute', () => {
    type myTest = {
      a: string;
      b: number[];
      c: bigint;
      d: undefined;
      e: null;
      f: string | null;
    };

    type test_ko = ExpectFalse<Equal<JSONCompatible<myTest>, myTest>>;
  });
});
