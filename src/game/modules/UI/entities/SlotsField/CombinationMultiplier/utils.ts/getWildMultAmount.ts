import { ClusterCombinations } from "../../../../../manager/type";

export const getWildMultAmount = (comb: ClusterCombinations) => {
  let wildCounter = 0;
  comb.wild_mults.forEach((wild) => {
    if (wild.mult > 1) wildCounter += 1;
  });

  return wildCounter;
};
