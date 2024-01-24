import { Container, DisplayObject, Sprite, Text } from "pixi.js-legacy";
import { createSprite } from "../../../../utils/createSprite";
import { Position } from "../../../types";
import { theme } from "../../style";
import { Tween } from "@tweenjs/tween.js";

type AutoButtonType = {
  position: Position;
  onClick: () => void;
  scaleSize?: number;
};

export class AutoButton extends Container {
  private btnHover: Sprite;
  private onClick: () => void;
  private autoSpinCounter: Text;
  private autoText: Text;
  private infinityIcon: Sprite;
  private arrow: Sprite;
  private buttonScaleTween: Tween<DisplayObject>;


  constructor({ position, onClick, scaleSize = 1 }: AutoButtonType) {
    super();
    this.scale.set(0.5);
    this.onClick = onClick;
    this.position.set(600, -250);
    const btn = createSprite({
      textureName: "autoBtn",
    });
    btn.interactive = true;
    btn.cursor = "pointer";
    this.btnHover = createSprite({
      textureName: "autoButtonHover",
    });
    this.btnHover.alpha = 0;
    this.arrow = createSprite({
      textureName: "autoButtonArrow",
    });
    this.arrow.scale.set(1.4)
    this.arrow.y = 1;
    this.arrow.x = -4;

    this.autoText = new Text("A", {
      fontFamily: theme.fontFamily.primary,
      fontSize: 80,
      fill: theme.color.purple,
      fontWeight: "700",
    });
    this.autoText.y = -5;
    this.autoText.anchor.set(0.5);

    this.autoSpinCounter = new Text("", {
      fontFamily: theme.fontFamily.primary,
      fontSize: 54,
      fill: theme.color.purple,
      fontWeight: "700",
    });
    this.autoSpinCounter.y = -7;
    this.autoSpinCounter.anchor.set(0.5);
    this.autoSpinCounter.visible = true;

    this.infinityIcon = createSprite({
      textureName: "infinity",
    });
    this.infinityIcon.scale.set(1.4)
    this.infinityIcon.visible = false;

    this.buttonScaleTween = this.createScaleTween(this, scaleSize, 0.9)

    this.addChild(
      btn,
      this.btnHover,
      this.arrow,
      this.autoText,
      this.autoSpinCounter,
      this.infinityIcon
    );

    btn
      .on("mousedown", this.onButtonDown)
      .on("mouseover", this.onButtonOver)
      .on("mouseout", this.onButtonOut)
      .on("touchstart", () => {
        this.btnHover.alpha = 1;
        this.onClick();
      })
      .on("touchend", () => {
        this.btnHover.alpha = 1;
      })
      .on("touchendoutside", () => {
        this.btnHover.alpha = 0;
      });
  }

  onButtonDown = () => {
    this.onClick();
    this.buttonScaleTween.start()
  };

  onButtonOver = () => {
    this.btnHover.alpha = 1;
  };

  onButtonOut = () => {
    this.btnHover.alpha = 0;
  };

  setRestSpinAmount = (restSpins: number) => {
    if (restSpins !== Infinity) {
      this.autoSpinCounter.text = restSpins;
      if (this.infinityIcon.visible) {
        this.infinityIcon.visible = false;
      }
    } else {
      this.autoSpinCounter.text = "";
      this.infinityIcon.visible = true;
    }
  };

  setVisibleSpinsCounter = (visible: boolean) => {
    this.autoSpinCounter.visible = visible;
    this.autoText.visible = !visible;
    this.arrow.visible = !visible

    if (!visible && this.infinityIcon.visible) {
      this.infinityIcon.visible = false;
    }
  };

  private createScaleTween = (obj: DisplayObject, currentScale: number, scaleSize: number) => {
    const scaleTween = new Tween(obj)
      .to(
        {
          scale: { x: currentScale / scaleSize, y: currentScale / scaleSize },
        },
        160
      )
      .yoyo(true)
      .repeat(1);

    return scaleTween;
  };
}
