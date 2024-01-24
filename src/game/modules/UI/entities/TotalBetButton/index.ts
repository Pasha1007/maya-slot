import { Container } from "pixi.js-legacy";
import { createSprite } from "../../../../utils/createSprite";
import { Position, ResourceNames } from "../../../types";

type TotalBetButtonType = {
  textureName: ResourceNames;
  position: Position;
  onClick: () => void;
};

export class TotalBetButton extends Container {
  constructor({ textureName, position, onClick }: TotalBetButtonType) {
    super();
    this.position.set(position.x, position.y);

    const btn = createSprite({
      textureName,
      size: 130,
    });
    btn.interactive = true;
    btn.cursor = "pointer";

    const btnHover = createSprite({
      textureName: "totalBetHover-d",
      size: 130,
    });
    btnHover.visible = false;



    this.addChild(btn, btnHover);

    btn
      .on("pointerdown", onClick)
      .on("pointerover", () => {
        btnHover.visible = true;
      })
      .on("pointerout", () => {
        btnHover.visible = false;
      });
  }
}
