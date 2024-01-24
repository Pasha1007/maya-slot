import { Container } from "pixi.js-legacy";
import { ResourceState, ScreenVersion } from "../../../../types";
import { CustomSpine } from "../../Spine";
import { config } from "./config";

type StartAnimationType = {
  animationName: string;
  onComplete?: () => void;
};

type FreeGamesType = {
  screenVersion: ScreenVersion;
  resources: ResourceState;
};

export class FreeGames extends Container {
  private freeGameSpine: CustomSpine;

  constructor({ resources, screenVersion }: FreeGamesType) {
    super();
    const screenConfig = config[screenVersion];
    this.visible = false;
    this.freeGameSpine = new CustomSpine({
      spineResource: resources["freeSpins"],
    });
    this.freeGameSpine.resize(screenConfig.size);
    this.freeGameSpine.y = screenConfig.offsetY + 30;

    this.addChild(this.freeGameSpine);
  }

  startAnimation = async ({ animationName, onComplete }: StartAnimationType) => {
    this.visible = true;
    await this.freeGameSpine.startAnimation({
      animationName,
    });
    onComplete && onComplete();
    this.visible = false;
  };
}
