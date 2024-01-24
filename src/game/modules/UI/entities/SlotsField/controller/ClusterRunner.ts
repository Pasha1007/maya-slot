import { Easing } from "@tweenjs/tween.js";
import { SortedSlotsType } from ".";
import { SlotsField } from "..";
import { TOTAL_ROWS } from "../../../../constants";
import { MayaManager } from "../../../../manager";
import { ClusterType, CoordinationsType, WildSymbolsChanges } from "../../../../manager/type";
import { convertStringToCoordinations } from "../../../../manager/utils/convertStringToObject";
import { createGameTableByCoordinates } from "../../../../manager/utils/createGameTableByCoordinates";
import { SlotKeys } from "../Reel/SlotPool/Slot/constants";
import { backout } from "./utils/backout";
import { sortSLots } from "./utils/sortSLots";
import { sleep } from "../../../../../utils/sleep";
import { hasWild } from "../CombinationMultiplier/utils.ts/divideAllComb";

export class ClusterRunner {
  private slotsField: SlotsField;
  private manager: MayaManager;

  constructor(slotsField: SlotsField, manager: MayaManager) {
    this.slotsField = slotsField;
    this.manager = manager;
  }

  async runCluster(cluster: ClusterType, index: number) {
    if (index > 0) {
      await this.rearrangeSlots(cluster);
    }

    await this.handleCombinations(cluster);
    this.manager.emitter.clusterFinished(cluster.cluster_mult);
  }

  private async handleCombinations(cluster: ClusterType) {
    const { destroyed_elements, wild_symbols_changes, all_combinations } = cluster;

    const combinations = [
      ...destroyed_elements,
      ...wild_symbols_changes.map((el) => el.prev_pos),
    ].map((str) => convertStringToCoordinations(str));

    if (all_combinations.length) {
      let hasWildMult = false;
      wild_symbols_changes.forEach((wild) => {
        if (wild.prev_mult > 1) hasWildMult = true;
      });

      all_combinations.forEach((comb) => {
        const { wild_mult } = comb;
        if (wild_mult === 1) {
          this.slotsField.burstedSlots.showBurstedElemens(comb, 1500);
        }
      });

      const showMultiplierPromise = this.slotsField.multiplayers.showMultiplier(
        all_combinations,
        this.setSlotDimming
      );
      const startCombAnimationPromise = this.startCombAnimation(combinations, hasWildMult);
      await Promise.all([showMultiplierPromise, startCombAnimationPromise]);
    }

    if (wild_symbols_changes.length) {
      await this.moveWildSymbols(wild_symbols_changes);
    }
  }

  private async moveWildSymbols(wild_symbols_changes: WildSymbolsChanges[]) {
    const { reels, moveSlots } = this.slotsField;

    wild_symbols_changes.forEach(async (wild) => {
      const { reels } = this.slotsField;
      const { prev_pos, new_pos } = wild;
      const prevPosComb = convertStringToCoordinations(prev_pos);
      const newPosComb = convertStringToCoordinations(new_pos);
      if (prevPosComb.r !== newPosComb.r) {
        reels[prevPosComb.r].zIndex = 100;
      }
    });

    await Promise.all(
      wild_symbols_changes.map(async (wild) => {
        const { prev_pos, new_pos, new_mult } = wild;
        const prevPosComb = convertStringToCoordinations(prev_pos);
        const nextPosComb = convertStringToCoordinations(new_pos);

        const slot = reels[prevPosComb.r].slots[prevPosComb.c];

        const movePositionX = nextPosComb.r - prevPosComb.r;
        const movePositionY = prevPosComb.c - nextPosComb.c; //because reverse combinations in "convertStringToCombination"
        moveSlots({
          startRange: prevPosComb.c,
          endRange: prevPosComb.c,
          reelIndex: [prevPosComb.r],
          movePositionX,
          movePositionY,
          delay: 270,
          easing: Easing.Linear.None,
          time: 350,
        });

        slot.wildMultiplier?.jump();
        slot.staticWildMultiplier?.jump();
        setTimeout(() => {
          slot.wildMultiplier?.setWildMultiplier(new_mult);
          slot.staticWildMultiplier?.setWildMultiplier(new_mult);
        }, 620);

        await slot.startAnimation({
          animationName: "jump",
          repeat: 1,
        });
      })
    );

    await Promise.all(
      wild_symbols_changes.map(async (wild) => {
        const { new_pos, new_mult, prev_pos } = wild;
        const prevPosComb = convertStringToCoordinations(prev_pos);
        const nextPosComb = convertStringToCoordinations(new_pos);
        const slot = reels[prevPosComb.r].slots[prevPosComb.c];

        const reel = reels[nextPosComb.r];
        reel.replaceSlotByIndex(nextPosComb.c, SlotKeys.WILD, new_mult);
        slot.alpha = 0;
        reels[prevPosComb.r].zIndex = 0;
      })
    );
  }

  private startCombAnimation = async (combination: CoordinationsType[], hasWildMult: boolean) => {
    let promises: Promise<unknown>[] = [];
    const reels = this.slotsField.reels;

    for (let i = 0; i < combination.length; i++) {
      const selectedReel = combination[i].r;
      const selectedSlot = combination[i].c;
      const reel = reels[selectedReel];

      reel.slots.forEach((slot, i) => {
        if (i === selectedSlot) {
          slot.isDestroyed = true;
          slot.spineSlot.setSpineFirstFrame("light");
          const promise = slot.startAnimation({
            animationName: "light",
            repeat: 1,
          });

          if (hasWildMult) {
            setTimeout(() => {
              if (!slot.isWild) {
                slot.spineSlot.pauseAnimation(true);
              }
            }, 850);
          }

          promises.push(promise);
        }
      });
    }

    this.setSlotDimming(true);
    if (!hasWildMult) {
      await sleep(1200);
      this.setSlotDimming(false);
    }

    await Promise.all(promises);
  };

  private async rearrangeSlots(cluster: ClusterType) {
    const { reels } = this.slotsField;
    const swapedGameTable = createGameTableByCoordinates(cluster.spawned_symbols) as SlotKeys[][];
    const { destroyed_elements } = cluster;

    this.manager.setValue("setTargetGameTable", {
      gameTable: swapedGameTable,
      destroyedElements: destroyed_elements,
    });

    await Promise.all(
      reels.map(async (reel, k) => {
        const slotsConfig = reel.slots.slice(0, 8).map((slot) => ({
          key: slot.slotKey,
          destroy: slot.isDestroyed,
          isWild: slot.isWild,
          id: slot.id,
        }));

        const sortedSlotsConfig = sortSLots(slotsConfig);
        const promise1 = this.moveExistingSlots(k, slotsConfig, sortedSlotsConfig);
        const promise2 = this.moveSwapedSlots(swapedGameTable[k], k);
        await Promise.all([promise1, promise2]);
        reel.updateSlotsOrder(sortedSlotsConfig, k);
      })
    );
  }

  private async moveSwapedSlots(reverseGameTable: SlotKeys[], index: number) {
    const { moveSlots } = this.slotsField;

    if (!!reverseGameTable.length) {
      await moveSlots({
        startRange: TOTAL_ROWS,
        endRange: reverseGameTable.length + TOTAL_ROWS,
        movePositionY: reverseGameTable.length,
        reelIndex: [index],
        time: 500,
        delay: 0,
        easing: backout(0.5),
      });
    }
  }

  private async moveExistingSlots(
    k: number,
    slotsConfig: SortedSlotsType[],
    sortedSlotsConfig: SortedSlotsType[]
  ) {
    const { moveSlots } = this.slotsField;

    const promises: Promise<unknown>[] = [];

    sortedSlotsConfig.forEach(async (el, j) => {
      const elemIndexAfterSorting = j;
      const elemIndexBeforeSorting = slotsConfig.indexOf(el);

      if (elemIndexBeforeSorting !== elemIndexAfterSorting) {
        const target = elemIndexBeforeSorting - elemIndexAfterSorting;
        const movePromise = moveSlots({
          startRange: elemIndexBeforeSorting,
          endRange: elemIndexBeforeSorting,
          movePositionY: target,
          reelIndex: [k],
          time: 500,
          delay: 0,
          easing: backout(1),
        });
        promises.push(movePromise);
      }
    });

    await Promise.all(promises);
  }

  private setSlotDimming = (showDimming: boolean) => {
    const reels = this.slotsField.reels;

    reels.forEach((reel) => {
      reel.slots.forEach((slot, i) => {
        if (showDimming) {
          if (!slot.isDestroyed) slot.setDimming(250, showDimming);
        } else {
          slot.setDimming(250, showDimming);
        }
      });
    });
  };
}
