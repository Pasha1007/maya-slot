import { Container, Text } from "pixi.js-legacy";
import { theme } from "../../../style";

type SymbolsListTitleType = {
  fontSizeH1?: number;
  fontSizeH2?: number;
};

export class SymbolsListTitle extends Container {
  constructor({ fontSizeH1, fontSizeH2 }: SymbolsListTitleType) {
    super();
    const featuresTitle = new Text("FEATURES", {
      fontFamily: theme.fontFamily.primary,
      fontSize: fontSizeH1 || 38,
      fill: theme.color.white,
    });
    featuresTitle.y = featuresTitle.height - 20;

    const symbolsTitle = new Text("Jam Jar symbols", {
      fontFamily: theme.fontFamily.primary,
      fontSize: fontSizeH2 || 28,
      fill: theme.color.teal,
    });
    symbolsTitle.y = featuresTitle.height + 20;
    this.addChild(featuresTitle, symbolsTitle);
  }
}
