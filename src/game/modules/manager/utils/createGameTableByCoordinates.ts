import { TOTAL_REELS } from "../../constants";
import { convertStringToCoordinations } from "./convertStringToObject";

export const createGameTableByCoordinates = (obj: Record<string, string[]>) => {
  const res: string[][] = Array.from({ length: TOTAL_REELS }, () => []);

  Object.keys(obj).forEach((key) => {
    obj[key].forEach((comb) => {
      const { r, c } = convertStringToCoordinations(comb);
      res[r][7 - c] = key;
    });
  });

  for (let r = 0; r < res.length; r++) {
    for (let c = 0; c < res[r].length; c++) {
      if (!res[r][c]) {
        res[r][c] = "EMPTY";
      }
    }
  }

  return res;
};
