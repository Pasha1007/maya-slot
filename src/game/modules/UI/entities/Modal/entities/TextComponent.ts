import { Container, Text, TextStyle } from "pixi.js-legacy";
import { theme } from "../../../style";

type TextComponentType = {
  body: string;
  wordWrapWidth: number;
  fontSize?: number;
  style?: TextStyle;
};

export class TextComponent extends Container {
  constructor({ body, fontSize, wordWrapWidth, style }: TextComponentType) {
    super();
    const text = new Text(body, {
      fontFamily: theme.fontFamily.primary,
      fontSize,
      fill: theme.color.white,
      wordWrap: true,
      wordWrapWidth,
    });

    this.addChild(text)
  }
}
