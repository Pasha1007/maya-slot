import { Container, DisplayObject, Sprite } from "pixi.js-legacy";
import { createSprite } from "../../../../utils/createSprite";
import { Position } from "../../../types";
import { theme } from "../../style";
import { Tween } from "@tweenjs/tween.js";
import { MayaManager } from "../../../manager";

type SpinButtonType = {
  position: Position;
  scaleSize: number;
  onClick?: () => void;
  manager: MayaManager;
};

export class SpinButton extends Container {
  private btn: Sprite;
  private btnHover: Sprite;
  private arrow: Sprite;
  private skipIcon: Sprite;
  private disable: boolean = false;
  private manager: MayaManager;
  private onClick?: () => void;
  private buttonScaleTween: Tween<DisplayObject>;
  private skipIconScaleTween: Tween<DisplayObject>;

  constructor({ position, scaleSize, onClick, manager }: SpinButtonType) {
    super();
    this.manager = manager;
    this.scale.set(scaleSize || 1);
    this.onClick = onClick;
    this.position.set(position.x, position.y);

    this.btn = createSprite({
      textureName: "spinButton",
      size: 320,
    });
    this.btn.position.set(-55, 38)
    this.btn.interactive = true;
    this.btn.cursor = "pointer";

    this.btnHover = createSprite({
      textureName: "spinButtonHover",
      size: 420
    });
    this.btnHover.position.set(-55, 38)

    this.btnHover.alpha = 0;

    this.arrow = createSprite({
      textureName: "spinArrow",
    });
    this.arrow.y = this.btnHover.height * 0.025;
    this.arrow.anchor.set(0.95, 0.25)

    this.skipIcon = createSprite({
      textureName: "skipIcon",
    });
    this.skipIcon.position.set(-60, 38)
    this.skipIcon.visible = false;

    this.addChild(this.btn, this.btnHover, this.arrow, this.skipIcon);

    document.addEventListener("keydown", this.onSpaceDown);

    this.btn
      .on("pointerup", this.onButtonUp)
      .on("pointerover", this.onButtonOver)
      .on("pointerout", this.onButtonOut);

    this.buttonScaleTween = this.createScaleTween(this, scaleSize, 0.9);
    this.skipIconScaleTween = this.createScaleTween(this.skipIcon, this.skipIcon.scale.x, 0.75);
  }

  private createScaleTween = (obj: DisplayObject, currentScale: number, scaleSize: number) => {
    const scaleTween = new Tween(obj)
      .to(
        {
          scale: { x: currentScale * scaleSize, y: currentScale * scaleSize },
        },
        150
      )
      .yoyo(true)
      .repeat(1);

    return scaleTween;
  };

  private onSpaceDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      this.onButtonUp();
    }
  };

  onButtonUp = () => {
    if (this.disable) return;

    const { isRunRotateAnimation } = this.manager.state.gameState;
    if (!isRunRotateAnimation) {
      this.buttonScaleTween.start();
    } else {
      this.skipIconScaleTween.start();
    }

    this.onClick && this.onClick();
  };

  onButtonOver = () => {
    if (this.disable) return;

    this.btnHover.alpha = 1;
  };

  onButtonOut = () => {
    this.btnHover.alpha = 0;
  };

  setDisable = (disable: boolean) => {
    this.disable = disable;

    this.arrow.tint = disable ? theme.color.grey : 0xffffff;
    this.btn.cursor = disable ? "not-allowed" : "pointer";
  };

  setVisbleSkipIcon = (visible: boolean) => {
    this.arrow.visible = !visible;
    this.skipIcon.visible = visible;
  };

  destroy = () => {
    document.removeEventListener("keydown", this.onButtonUp);
  };
}
