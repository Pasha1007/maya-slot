import { SlotKeys } from "../../UI/entities/SlotsField/Reel/SlotPool/Slot/constants";

export function mergeArrays(arr1: SlotKeys[][], arr2: SlotKeys[][], startIndex: number): SlotKeys[][] {
    if (arr1?.length !== arr2?.length) {
      throw new Error("Both arrays should have the same length of nested arrays.");
    }
  
    const mergedArray: SlotKeys[][] = [];
  
    for (let i = 0; i < arr1.length; i++) {
      mergedArray.push([...arr1[i].slice(0, startIndex), ...arr2[i]]);
    }
  
    return mergedArray;
  }
  
  