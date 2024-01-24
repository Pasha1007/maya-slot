export function getRandomNumberInRange(n: number): number {
  return Math.floor(Math.random() * (2 * n + 1)) - n;
}
