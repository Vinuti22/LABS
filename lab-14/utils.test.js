import { factorial, sumArray, findMax } from './utils.js';

describe('Utils tests', () => {
  test('factorial calculates correctly', () => {
    expect(factorial(5)).toBe(120);
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
    expect(factorial(10)).toBe(3628800);
  });

  test('sumArray sums array correctly', () => {
    expect(sumArray([1, 2, 3, 4, 5])).toBe(15);
    expect(sumArray([-1, 0, 1])).toBe(0);
    expect(sumArray([])).toBe(0);
  });

  test('findMax finds maximum', () => {
    expect(findMax([3, 7, 2, 9, 1])).toBe(9);
    expect(findMax([-5, -2, -8])).toBe(-2);
  });
});