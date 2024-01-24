import { CoordinationsType } from "../type";

export function convertStringToCoordinations(str: string): CoordinationsType {
  const [r, c] = str.split("|").map(Number);

  return { r, c: 7 - c };
}
