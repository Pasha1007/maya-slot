import { Container, Sprite } from "pixi.js-legacy";
import { createSprite } from "../../../../utils/createSprite";
import { Position } from "../../../types";

type SpinButtonType = {
  position: Position;
};

export class SoundButton extends Container {
  private btnHover: Sprite;
  // private soundOn: Sprite;
  // private soundOff: Sprite;

  constructor({ position }: SpinButtonType) {
    super();
    this.position.set(position.x, position.y);

    const btn = createSprite({
      textureName: "soundBtn",
      size: 90,
    });
    btn.interactive = true;
    btn.cursor = "pointer";

    this.btnHover = createSprite({
      textureName: "soundBtnHover",
      size: 90
    });
    this.btnHover.alpha = 0;

    const soundOnIcon = createSprite({
      textureName: "soundOn",
    });
    // soundOnIcon.x = -this.btnHover.width * 0.03;
    soundOnIcon.y = this.btnHover.height * 0.025;
    // soundOnIcon.alpha = 0;


    this.addChild(btn, this.btnHover, soundOnIcon);

    btn
      .on("pointerdown", this.onButtonDown)
      .on("pointerup", this.onButtonUp)
      .on("pointerover", this.onButtonOver)
      .on("pointerout", this.onButtonOut)
      .on("touchstart", () => {
        // console.log("touchstart");
      })
      .on("touchend", () => {
        // console.log("touchend");
      })
      .on("touchendoutside", () => {
        // console.log("touchendoutside");
      });
  }

  onButtonDown = () => {
    // console.log("onButtonDown");
  };

  onButtonUp = () => {
    // console.log("onButtonUp");
  };

  onButtonOver = () => {
    this.btnHover.alpha = 1
    // console.log("onButtonOver");
  };

  onButtonOut = () => {
    this.btnHover.alpha = 0

    // console.log("onButtonOver");
  };
}
