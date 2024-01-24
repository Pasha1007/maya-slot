import { Container, Sprite } from "pixi.js-legacy";
import { createSprite } from "../../../../utils/createSprite";
import { BlackoutBgController } from "./controller";
import { MayaManager } from "../../../manager";
import { ScreenVersion } from "../../../types";

type BlackoutBgType = {
  sizes: { w: number; h: number };
  manager: MayaManager;
  screenVersion: ScreenVersion;
};

export class BlackoutBg extends Container {
  private bg: Sprite;
  private controller: BlackoutBgController;

  constructor({ sizes, manager, screenVersion }: BlackoutBgType) {
    super();
    this.controller = new BlackoutBgController({
      manager,
      ui: this,
      screenVersion,
    });

    this.bg = createSprite({
      textureName: "blackoutBg",
      anchor: { x: 0.5, y: 0 },
      sizes,
    });
    this.bg.alpha = 0;

    this.addChild(this.bg);
  }

  setVisible = (visible: boolean) => {
    this.bg.alpha = visible ? 1 : 0;
    this.interactive = visible;

  };

  destroy = () => {
    this.controller.destroy();
  };
}
