import { Container, Graphics } from "pixi.js-legacy";
import { createSprite } from "../../../../../utils/createSprite";
import { theme } from "../../../style";
import { ResourceNames } from "../../../../types";

type TableHeaderItemType = {
  borderWidth: number;
  size: { w: number; h: number };
  iconSize: number,
  symbolName: ResourceNames
};

export class TableHeaderItem extends Container {
  constructor({ borderWidth, size, iconSize, symbolName }: TableHeaderItemType) {
    super();
    this.x = borderWidth;

    const wrapperContainer = new Container();

    const item = createSprite({
      textureName: symbolName,
      size: iconSize,
    });

    const border = new Graphics();
    border.lineStyle(borderWidth, theme.color.yellow);
    border.drawRect(-size.w / 2, -size.h / 2, size.w, size.h);

    wrapperContainer.addChild(item, border);
    wrapperContainer.position.set(size.w / 2, size.h / 2);

    this.addChild(wrapperContainer);
  }
}
