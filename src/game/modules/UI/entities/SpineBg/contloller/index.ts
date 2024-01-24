import { EventEmitter } from "stream";
import { SpineBg } from "..";
import { MayaManager } from "../../../../manager";

export class SpineBgController {
  private removeListeners: (void | (() => EventEmitter))[] = [];
  private isFreeGameRuning: boolean = false;

  constructor(ui: SpineBg, manager: MayaManager) {
    const listenFreeGames = manager.listen("listenFreeGames", (freeGame) => {
      if (freeGame.isFreeGame && !this.isFreeGameRuning) {
        this.isFreeGameRuning = true;
        ui.startAnimation("multiplayer mode");
      }

      if (!freeGame.isFreeGame) {
        ui.startAnimation("standart mode");
        this.isFreeGameRuning = false;
      }
    });
    this.removeListeners.push(listenFreeGames);
  }

  destroy = () => {
    this.removeListeners.forEach((removeListener: () => EventEmitter) => {
      removeListener();
    });
  };
}
