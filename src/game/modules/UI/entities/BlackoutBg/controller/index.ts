import { EventEmitter } from "stream";
import { BlackoutBg } from "..";
import { MayaManager } from "../../../../manager";
import { ScreenVersion } from "../../../../types";

type ControllerType = {
  ui: BlackoutBg;
  manager: MayaManager;
  screenVersion: ScreenVersion;
};

export class BlackoutBgController {
  private blackoutBg: BlackoutBg;
  private removeListeners: (void | (() => EventEmitter))[] = [];
  private manager: MayaManager;

  constructor({ ui, manager, screenVersion }: ControllerType) {
    this.manager = manager;
    this.blackoutBg = ui;

    const listenVisibleModal = manager.listen("listenVisibleModal", (visible) => {
      if (screenVersion !== ScreenVersion.DESKTOP) return;

      this.blackoutBg.setVisible(visible);
    });
    this.removeListeners.push(listenVisibleModal);

    const freeGames = manager.listen("listenShowNotification", (isShow) => {
      this.blackoutBg.setVisible(isShow);
    });
    this.removeListeners.push(freeGames);
  }

  destroy = () => {
    this.removeListeners.forEach((removeListener: () => EventEmitter) => {
      removeListener();
    });
  };
}
