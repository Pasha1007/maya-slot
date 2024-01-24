import { Container, Text } from "pixi.js-legacy";
import { ResourceNames } from "../../../../types";
import { createSprite } from "../../../../../utils/createSprite";
import { ModalTabsType } from "../type";
import { theme } from "../../../style";

type ButtonType = {
  textureNames: ResourceNames[];
  onClick: (tabKey: ModalTabsType) => void;
  key: ModalTabsType;
  scaleSize?: number;
  additionalText?: string;
};

export class TabButton extends Container {
  public key: ModalTabsType;

  constructor({ textureNames, onClick, key, scaleSize, additionalText }: ButtonType) {
    super();
    this.scale.set(scaleSize)
    this.key = key;
    const [btn, hover] = textureNames;

    const button = createSprite({
      textureName: btn,

    });
    button.interactive = true;
    button.cursor = "pointer";
    button.scale.set(0.9)

    const hoverButton = createSprite({
      textureName: hover,
    });
    hoverButton.scale.set(0.9)
    hoverButton.alpha = 0;
    //hoverButton.x = -hoverButton.width * 0.03;
    //hoverButton.y = -hoverButton.height * 0.06;

    this.addChild(hoverButton, button);

    if (!!additionalText) {
      const text = new Text(additionalText, {
        fontFamily: theme.fontFamily.primary,
        fontSize: 65,
        fill: theme.color.white,
        fontWeight: "700",
      });
      text.anchor.set(0.5);

      this.addChild(text);
    }

    button
      .on("mousedown", () => {
        onClick(this.key);
      })
      .on("mouseover", () => {
        hoverButton.alpha = 1;
      })
      .on("mouseout", () => {
        hoverButton.alpha = 0;
      })
      .on("touchstart", () => {
        onClick(this.key);
        hoverButton.alpha = 1;
      })
      .on("touchend", () => {
        hoverButton.alpha = 0;
      })
      .on("touchendoutside", () => {
        hoverButton.alpha = 0;
      });
  }
}
