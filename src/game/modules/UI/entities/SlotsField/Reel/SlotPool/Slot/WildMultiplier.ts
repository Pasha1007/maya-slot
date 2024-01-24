import { Container, Text } from "pixi.js-legacy";
import { theme } from "../../../../../style";
import { Easing, Tween } from "@tweenjs/tween.js";
import { ScreenVersion } from "../../../../../../types";

type WildMultiplierType = {
  screenVersion: ScreenVersion;
};

export class WildMultiplier extends Container {
  private multiplierText: Text;
  private jumpTween!: Tween<Text>;
  private appearTween!: Tween<Text>;

  constructor({ screenVersion }: WildMultiplierType) {
    super();

    const fontSize = ScreenVersion.MOBILE === screenVersion ? 22 : 30;

    this.multiplierText = new Text("", {
      fontFamily: theme.fontFamily.primary,
      fill: theme.color.white,
      fontSize,
      stroke: theme.color.gold,
      strokeThickness: 4,
    });
    this.multiplierText.anchor.set(0.5, 0);
    this.multiplierText.alpha = 1;

    this.jumpTween = new Tween(this.multiplierText)
      .to({ scale: { x: 1.3, y: 1.6 }, y: -40 }, 400)
      .delay(50)
      .easing(Easing.Quadratic.Out)
      .yoyo(true)
      .repeat(1);

    this.appearTween = new Tween(this.multiplierText);

    this.addChild(this.multiplierText);
  }

  setWildMultiplier = (multiplayer: number) => {   
    this.multiplierText.alpha = 1;
    this.multiplierText.text = `x${multiplayer}`;
  };

  jump() {
    this.jumpTween.start();
  }

  appear(alpha: number, time = 500) {
    this.appearTween.to({ alpha }, time).start();
  }
}
