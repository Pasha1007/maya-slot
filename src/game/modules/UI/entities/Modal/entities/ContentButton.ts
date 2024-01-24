import { Container, Sprite, Text } from "pixi.js-legacy";
import { ResourceNames } from "../../../../types";
import { createSprite } from "../../../../../utils/createSprite";
import { theme } from "../../../style";

export type ButtonVariantType = "checkbox" | "radioButton";

type ContentButtonType = {
  textureName?: ResourceNames[];
  content: Text | Sprite;
  onClick: (value: number | null) => void;
  value?: number | null;
  type?: ButtonVariantType;
  isDraging?: boolean;
  isActiveMode?: boolean;
  fontSize?: number;
  sizes?: { w: number; h: number };
};

export class ContentButton extends Container {
  private button: Sprite;
  private buttonHover: Sprite;
  private content: Text | Sprite;
  private onClick: (value: number | null) => void;
  private active!: boolean;
  private type: ButtonVariantType;
  private disable: boolean = false;
  private isDraging?: boolean = false;
  private isTouchstart: boolean = false;
  public value: number | null;

  constructor({
    content,
    onClick,
    value = null,
    textureName = ["modalButton", "modalButtonHover"],
    isActiveMode = true,
    type = "checkbox",
    sizes,
  }: ContentButtonType) {
    super();
    this.value = value;
    this.onClick = onClick;
    this.content = content;
    this.type = type;

    this.button = createSprite({
      textureName: textureName[0],
      anchor: { x: 0, y: 0 },
      sizes,
    });

    this.button.tint = 0xffffff;
    this.button.interactive = true;
    this.button.cursor = "pointer";

    this.buttonHover = createSprite({
      textureName: textureName[1],
      anchor: { x: 0, y: 0 },
      sizes,
    });
    this.buttonHover.visible = false;

    this.button
      .on("mousedown", this.onButtonDown)
      .on("mouseover", this.onButtonOver)
      .on("mouseout", this.onButtonOut)
      .on("touchstart", () => {
        this.isTouchstart = true;
        if (this.isDraging || isActiveMode) return;
        this.onButtonOver();
      })
      .on("touchend", () => {
        if (this.isDraging || !this.isTouchstart) return;

        this.onButtonOut();
        this.onButtonDown();
        this.isTouchstart = false
      })
      .on("touchendoutside", () => {
        this.isTouchstart = false;

        if (this.isDraging) return;

        this.onButtonOut();
      });

    this.addChild(this.button, this.buttonHover, content);
    content.x = (this.width - content.width) / 2;
    content.y = (this.height - content.height) / 2;
  }

  onButtonOver = () => {
    if (this.disable) return;
    this.buttonHover.visible = true;
  };

  onButtonOut = () => {
    if (this.disable || this.active) return;

    this.buttonHover.visible = false;
    this.content.tint = theme.color.white;
  };

  onButtonDown = () => {
    if (this.disable) return;

    if (this.type === "radioButton") {
      this.onClick(this.value);
    } else {
      const value = this.active ? null : this.value;
      this.onClick(value);
    }
  };

  setActive = (active: boolean) => {
    this.active = active;

    if (active) {
      this.buttonHover.visible = true;
    } else {
      this.buttonHover.visible = false;
      this.content.tint = theme.color.white;
    }
  };

  setDisable = (disable: boolean) => {
    this.disable = disable;
    this.button.cursor = disable ? "default" : "pointer";

    if (disable) {
      this.button.alpha = 0.85;
      this.content.alpha = 0.5;
    } else {
      this.button.alpha = 1;
      this.content.alpha = 1;
    }
  };

  setDraging = (isDraging: boolean) => {
    this.isDraging = isDraging;
  };
}
