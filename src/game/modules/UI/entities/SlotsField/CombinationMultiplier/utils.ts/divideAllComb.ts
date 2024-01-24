import { ClusterCombinations } from "../../../../../manager/type";

export const hasWild = (allCombinations: ClusterCombinations[]) => {
  let hasWild = false;

  allCombinations.forEach((comb) => {
    if (comb.wild_mult > 1) {
      hasWild = true;
    }
  });

  return hasWild
};
