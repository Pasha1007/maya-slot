import { Container } from "pixi.js-legacy";
import { Position, ResourceNames } from "../../../../types";
import { createSprite } from "../../../../../utils/createSprite";

type CloseBtnType = {
  textureName: ResourceNames;
  position: Position;
  onClick: () => void;
};

export class CloseBtn extends Container {
  constructor({
    position,
    textureName,
    onClick,
  }: // audios
    CloseBtnType) {
    super();
    this.position.set(position.x + 10, position.y);

    const sprite = createSprite({
      textureName,
    });
    sprite.interactive = true;
    sprite.cursor = "pointer";

    sprite.on("pointerdown", onClick)

    this.addChild(sprite);
  }
}
