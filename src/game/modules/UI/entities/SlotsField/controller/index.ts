import { SlotsField } from "..";
import { MayaManager } from "../../../../manager";
import { SpinFetchResult, WiningType } from "../../../../manager/type";
import { SlotKeys } from "../Reel/SlotPool/Slot/constants";
import { FreeGamesHandler } from "./FreeGamesHandler";
import { ClusterRunner } from "./ClusterRunner";
import { sleep } from "../../../../../utils/sleep";
import EventEmitter from "events";
import { checkAutoModeConditions } from "./utils/checkAutoModeConditions";
import { TOTAL_REELS, slotsFieldSizes } from "../../../../constants";
import { ScreenVersion } from "../../../../types";
import { convertStringToCoordinations } from "../../../../manager/utils/convertStringToObject";

export type SortedSlotsType = { key: string; destroy: boolean; isWild: boolean; id: string };

type ControllerType = {
  ui: SlotsField;
  manager: MayaManager;
  screenVersion: ScreenVersion;
};

export class Controller {
  private slotsField: SlotsField;
  private manager: MayaManager;
  private freeGamesHandler: FreeGamesHandler;
  private clusterRunner: ClusterRunner;
  private removeListeners: (void | (() => EventEmitter))[] = [];
  private screenVersion: ScreenVersion;

  constructor({ manager, ui, screenVersion }: ControllerType) {
    this.manager = manager;
    this.slotsField = ui;
    this.screenVersion = screenVersion;

    this.freeGamesHandler = new FreeGamesHandler(ui, manager, screenVersion);
    this.clusterRunner = new ClusterRunner(ui, manager);

    const listenPlay = this.manager.listen("listenPlay", async () => {
      this.manager.setValue("setRunRotateAnimation", true);
      const { slotsField } = this;
      slotsField.reelsRunning = true;
      await this.handlePlayEvent();
      slotsField.reelsRunning = false;

      this.manager.setValue("setRunRotateAnimation", false);
      this.manager.setValue("setRunSpin", false);

      slotsField.reels.forEach((reel, i) => {
        reel.removeChildrenInRange(0, 7, i);
      });

      this.runSteps();
    });
    this.removeListeners.push(listenPlay);

    const listenTargetGameTable = this.manager.listen(
      "listenTargetGameTable",
      ({ gameTable, destroyedElements }) => {
        this.setGameTable(gameTable, destroyedElements);
      }
    );
    this.removeListeners.push(listenTargetGameTable);

    const listensetSpiningSpeedUp = this.manager.listen("listensetSpiningSpeedUp", () => {
      this.slotsField.speedUp();
    });
    this.removeListeners.push(listensetSpiningSpeedUp);
  }

  private handlePlayEvent = async () => {
    const baseTarget = 8;
    const baseTime = 800;

    await this.slotsField.moveSlots({
      startRange: 0,
      endRange: 15,
      reelIndex: [0, 1, 2, 3, 4, 5, 6, 7],
      movePositionY: baseTarget,
      time: baseTime,
      isSpinTween: true,
      spawnedMargin: slotsFieldSizes[this.screenVersion].h * 0.6,
    });
  };

  private setGameTable = async (tagetGameTable: SlotKeys[][], destroyedElements?: string[],) => {
    const newDestroyedElements: Array<number[]> = Array.from({ length: TOTAL_REELS }, () => []);

    destroyedElements && destroyedElements.forEach((el) => {
      const { r, c } = convertStringToCoordinations(el);
      newDestroyedElements[r].push(c);
    });

    this.slotsField.reels.forEach((reel, i) => {
      reel.buildReel(tagetGameTable[i], newDestroyedElements[i],);
    });
  };

  private runSteps = async () => {
    this.manager.setValue("setRunSteps", true);

    const { game_result } = this.manager.state.sesionResult as SpinFetchResult;
    const { reels } = this.slotsField;
    const stepsLength = game_result.steps.length;

    for (let k = 0; k < stepsLength; k++) {
      const step = game_result.steps[k];
      const { clusters } = step;

      if (k > 0) {
        await this.freeGamesHandler.runFreeGamesStep(reels, step.clusters[0], k);
      }

      for (let i = 0; i < clusters.length; i++) {
        const cluster = clusters[i];
        await this.clusterRunner.runCluster(cluster, i);
      }

      if (k > 1 && k === stepsLength - 1) {
        this.manager.setValue("setFreeGames", { isFreeGame: false });
      }
    }

    await this.showNotification();

    this.manager.setValue("setRunSteps", false);
    this.manager.setValue(
      "setBalance",
      Number(this.manager.state.sesionResult?.session_wallet.balance)
    );
    this.manager.actionFinished();
    this.checkAutomode();
  };

  private checkAutomode = () => {
    const { autoMode } = this.manager.state;

    if (!autoMode.isAutoMode) return;
    checkAutoModeConditions(this.manager);

    if (autoMode.isAutoMode) {
      this.manager.spin();
    }
  };

  private showNotification = async () => {
    const { game_result } = this.manager.state.sesionResult as SpinFetchResult;
    const winAmount = Number(game_result.win_amount);
    const { totalBet } = this.manager.state.gameState;
    const multiplier = winAmount / totalBet;
    //change for 0
    if (multiplier >= 10) {
      let winType: WiningType = "win";
      if (multiplier >= 50 && multiplier < 100) winType = "bigWin";
      if (multiplier >= 100) winType = "epicWin";

      await sleep(200);
      this.manager.setValue("setShowNotification", true);
      await this.slotsField.notification.startWiningAnimation(winType, winAmount);
      this.manager.setValue("setShowNotification", false);
    }
  };

  destroy = () => {
    this.removeListeners.forEach((removeListener: () => EventEmitter) => {
      removeListener();
    });
  };
}
