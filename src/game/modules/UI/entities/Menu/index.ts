import { Container, Sprite } from "pixi.js-legacy";
import { Position } from "../../../types";
import { createSprite } from "../../../../utils/createSprite";

type MenuType = {
  position: Position;
  onClick: () => void;
};

export class Menu extends Container {
  private menuHover: Sprite;

  constructor({ position, onClick }: MenuType) {
    super();
    this.position.set(position.x - 10, position.y);
    const menu = createSprite({
      textureName: "menuBtn",
      size: 90,
    });
    menu.cursor = "pointer";
    menu.interactive = true;

    this.menuHover = createSprite({
      textureName: "menuHover",
      size: 90
    });
    this.menuHover.alpha = 0;
    this.addChild(menu, this.menuHover);

    menu
      .on("pointerdown", onClick)
      .on("pointerover", () => {
        this.menuHover.alpha = 1;
      })
      .on("pointerout", () => {
        this.menuHover.alpha = 0;
      })
      .on("touchstart", () => {
        this.menuHover.alpha = 1;
      })
      .on("touchend", () => {
        this.menuHover.alpha = 0;
      })
      .on("touchendoutside", () => {
        this.menuHover.alpha = 0;
      });
  }
}
