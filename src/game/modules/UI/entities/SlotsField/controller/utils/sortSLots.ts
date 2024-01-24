import { SortedSlotsType } from "..";

export const sortSLots = (arr: SortedSlotsType[]) => {
  const filterd = arr.filter((el) => !el.isWild || (el.isWild && el.destroy));
  const wildArr = arr.map((el, i) =>
    el.isWild && !el.destroy ? { prevIndex: i, wild: el } : null
  );
  const sorted = filterd.sort((a, b) => {
    if (a.destroy && !b.destroy) return 1;
    else if (!a.destroy && b.destroy) return -1;
    else return 0;
  });
  const res = [];
  let filterIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    const wild = wildArr.find((el) => el?.prevIndex === i);
    if (wild) res.push(wild.wild);
    else {
      res.push(sorted[filterIndex]);
      filterIndex++;
    }
  }
  
  return res;
};
