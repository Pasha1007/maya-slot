import { Container, DisplayObject, Sprite, Text } from "pixi.js-legacy";
import { createSprite } from "../../../../utils/createSprite";
import { ButtonConfigType, ByttonKey } from "./config";
import { theme } from "../../style";
import { Tween } from "@tweenjs/tween.js";

type ButtonType = {
  config: ButtonConfigType;
  onClick?: (key: ByttonKey) => void;
};

export class Button extends Container {
  private button: Sprite;
  private buttonHover: Sprite;
  private minButtonHover: Sprite;
  private maxButtonHover: Sprite;
  private text: Text;
  private isOver!: boolean;
  private disabled: boolean = false;
  private buttonScaleTween: Tween<DisplayObject>;
  private onClick?: (key: ByttonKey) => void;
  public key: ByttonKey;

  constructor({ config, onClick }: ButtonType) {
    super();
    this.key = config.key;
    this.onClick = onClick;
    this.minButtonHover = createSprite({
      textureName: "minButtonHover",
      size: 230,
    });
    this.maxButtonHover = createSprite({
      textureName: "maxButtonHover",
      size: 220,
    });
    const buttonsContainer = new Container();
    if (this.key === "min") {
      this.button = createSprite({
        textureName: "minButton",
        size: 230,
      });

    } else if (this.key === "max") {
      this.button = createSprite({
        textureName: "maxButton",
        size: 220,
      });

    } else {
      this.button = createSprite({
        textureName: "totalBetBlockButton",
        size: 212,
      });
    }
    this.button.interactive = true;
    this.button.cursor = "pointer";
    this.buttonHover = createSprite({
      textureName: "totalBetBlockButtonHover",
      size: 212,
    });
    this.buttonHover.visible = false;
    this.minButtonHover.visible = false
    this.maxButtonHover.visible = false

    this.text = new Text(config.text, {
      fontFamily: theme.fontFamily.primary,
      fontSize: 40,
      fill: theme.color.white,
      fontWeight: "700",
    });
    this.text.anchor.set(0.6, 0.6);
    buttonsContainer.addChild(this.button, this.buttonHover, this.minButtonHover, this.maxButtonHover, this.text);

    if (this.key === "next" || this.key === "prev") {
      const arrow = createSprite({
        textureName: "totalBetArrow",
      })
      arrow.scale.set(0.7)
      arrow.rotation = 1.5
      arrow.tint = theme.color.white
      if (this.key === "prev") {
        arrow.rotation = -1.5;
        arrow.y = -arrow.height / 3.5
      }
      arrow.anchor.set(0.6)

      buttonsContainer.addChild(arrow)
    }
    buttonsContainer.x = this.button.width / 3.5;
    buttonsContainer.y = -this.button.height / 2.8;

    this.button
      .on("pointerdown", this.onButtonDown)
      .on("pointerover", this.onButtonOver)
      .on("pointerout", this.onButtonOut)
      .on("touchstart", (this.onButtonOver))
      .on("touchend", (this.onButtonOut))

    this.buttonScaleTween = this.createScaleTween(buttonsContainer, buttonsContainer.scale.x, 0.9);
    this.addChild(buttonsContainer);
  }

  onButtonDown = () => {
    if (this.disabled) return;

    this.onClick && this.onClick(this.key);
    this.buttonScaleTween.start();
  };

  onButtonOver = () => {
    if (this.disabled) return;

    if (this.key === "min") {
      this.minButtonHover.visible = true;
      this.isOver = true;
    } else if (this.key === "max") {
      this.maxButtonHover.visible = true;
      this.isOver = true;
    } else {
      this.isOver = true;
      this.buttonHover.visible = true;
    }


  };

  onButtonOut = () => {
    if (this.disabled) return;
    this.minButtonHover.visible = false
    this.maxButtonHover.visible = false
    this.buttonHover.visible = false;
    this.isOver = true;
  };

  setDisable = (disable: boolean) => {
    this.disabled = disable;

    if (disable) {
      this.alpha = 0.75;
      this.button.cursor = "default";

    } else {
      this.alpha = 1;
      this.button.cursor = "pointer";
    }

    if (this.isOver && disable) {
      this.buttonHover.visible = false;
      this.minButtonHover.visible = false;
      this.maxButtonHover.visible = false;

    }
  };

  private createScaleTween = (obj: DisplayObject, currentScale: number, scaleSize: number) => {
    const scaleTween = new Tween(obj)
      .to(
        {
          scale: { x: currentScale * scaleSize, y: currentScale * scaleSize },
        },
        75
      )
      .yoyo(true)
      .repeat(1);

    return scaleTween;
  };
}
