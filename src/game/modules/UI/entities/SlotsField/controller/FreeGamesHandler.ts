import { SlotsField } from "..";
import { sleep } from "../../../../../utils/sleep";
import { slotsFieldSizes } from "../../../../constants";
import { MayaManager } from "../../../../manager";
import { ClusterType } from "../../../../manager/type";
import { createGameTableByCoordinates } from "../../../../manager/utils/createGameTableByCoordinates";
import { ScreenVersion } from "../../../../types";
import { Reel } from "../Reel";
import { SlotKeys } from "../Reel/SlotPool/Slot/constants";

export class FreeGamesHandler {
  private slotsField: SlotsField;
  private screenVersion: ScreenVersion;
  manager: MayaManager;

  constructor(slotsField: SlotsField, manager: MayaManager, screenVersion: ScreenVersion) {
    this.screenVersion = screenVersion;
    this.slotsField = slotsField;
    this.manager = manager;
  }

  async runFreeGamesStep(reels: Reel[], spawnedCluster: ClusterType, stepIndex: number) {
    const { moveSlots } = this.slotsField;

    const { spawned_symbols, destroyed_elements } = spawnedCluster;
    const spawnedGameTable = createGameTableByCoordinates(spawned_symbols) as SlotKeys[][];

    this.manager.setValue("setTargetGameTable", {
      gameTable: spawnedGameTable,
      destroyedElements: destroyed_elements,
    });
    const { free_games_won } = this.manager.state.sesionResult?.game_result || {};

    if (stepIndex === 1) {
      await Promise.all(
        reels.map(async (reel) => {
          await Promise.all(
            reel.slots.map(async (slot) => {
              if (slot.slotKey === SlotKeys.WILD) {
                slot.wildMultiplier?.appear(0);
                slot.staticWildMultiplier?.appear(0);
                await slot.startAnimation({
                  animationName: "start Multiplayer game",
                });
                slot.wildMultiplier?.appear(1);
                slot.staticWildMultiplier?.appear(1);
              }
            })
          );
        })
      );
      await sleep(200);
      this.manager.setValue("setShowNotification", true);
      await this.slotsField.notification.startFreeGame(free_games_won || "");
      this.manager.setValue("setShowNotification", false);
    }

    this.manager.setValue("setFreeGames", {
      isFreeGame: true,
      amount: Number(free_games_won),
      numberOfSpin: Number(stepIndex),
    });

    await Promise.all(
      reels.map(async (reel, i) => {
        reel.setWildSlotHold(true);

        await moveSlots({
          startRange: 0,
          endRange: 15,
          reelIndex: [i],
          movePositionY: spawnedGameTable[i].length,
          time: 1200,
          isSpinTween: true,
          spawnedMargin: slotsFieldSizes[this.screenVersion].h,
        });

        reel.removeChildrenInRange(0, 7, i);
        reel.mergeSlotsForFreeGame(i);
        reel.setWildSlotHold(false);
      })
    );
  }
}
