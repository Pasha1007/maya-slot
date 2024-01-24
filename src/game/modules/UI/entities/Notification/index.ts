import { Container } from "pixi.js-legacy";
import { FreeGames } from "./FreeGames";
import { ResourceState, ScreenVersion, WinsType } from "../../../types";
import { Wining } from "./Wining";

type GameNotificationType = {
  screenVersion: ScreenVersion;
  resources: ResourceState;
};

export class GameNotification extends Container {
  private freeGames: FreeGames;
  private wining: Wining;

  constructor({ resources, screenVersion }: GameNotificationType) {
    super();
    this.freeGames = new FreeGames({
      resources,
      screenVersion,
    });

    this.wining = new Wining({
      resources,
      screenVersion,
    });

    this.addChild(this.freeGames, this.wining);
  }

  startFreeGame = async (freeGameWon: string) => {
    await this.freeGames.startAnimation({
      animationName: freeGameWon,
    });
  };

  startWiningAnimation = async (winsType: WinsType, winAmount: number)=> {
    await this.wining.startAnimation(winsType, winAmount)
  }
}
