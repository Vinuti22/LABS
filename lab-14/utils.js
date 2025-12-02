// Утилиты для лабораторной работы

export function factorial(n) {
  if (n < 0) return null;
  if (n === 0 || n === 1) return 1;
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result = result * i;
  }
  return result;
}

// ОШИБКА НАМЕРЕННАЯ! (для отладки в DevTools)
export function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i <= arr.length; i++) {  // ← Ошибка: i <= arr.length (должен быть <)
    sum += arr[i];                          // ← Вызовет undefined + число → NaN
  }
  return sum;
}

export function findMax(arr) {
  if (arr.length === 0) return null;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}