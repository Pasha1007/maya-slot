import { Container, TextStyle } from "pixi.js-legacy";
import { createSprite } from "../../../../../utils/createSprite";
import { ResourceNames } from "../../../../types";
import { TextComponent } from "./TextComponent";
import { screenSizes } from "../../../../constants";

type SymbolDescriptionType = {
  symbolName: ResourceNames;
  symbolSize: number;
  textBody: string;
  textContainerW: number;
  symbolContainerW: number;
  fontSize: number;
  style?: TextStyle;
  direction?: "row" | "column";
  dividerVisibility?: boolean
  dividerOffsetY?: number
};

export class SymbolDescription extends Container {
  constructor({
    fontSize,
    symbolName,
    symbolSize,
    symbolContainerW,
    textBody,
    textContainerW,
    style,
    direction = "row",
    dividerVisibility = true,
    dividerOffsetY
  }: SymbolDescriptionType) {
    super();

    const symbol = createSprite({
      textureName: symbolName,
      size: symbolSize,
      anchor: { x: 0, y: 0 },
    });

    symbol.x = (symbolContainerW - symbol.width) / 2;

    const description = new TextComponent({
      body: textBody,
      wordWrapWidth: textContainerW,
      fontSize,
      style,
    });
    if (direction === "row") description.x = symbolContainerW + 50;
    if (direction === "column") description.x = symbolContainerW + 90;

    this.addChild(symbol, description);
    if (direction === "row" || direction === "column") description.y = (this.height - description.height) / 2 + 50;
    // if (direction === "column") description.y = symbol.height
    if (direction === "row" || direction === "column") symbol.y = 50;

  }
}
