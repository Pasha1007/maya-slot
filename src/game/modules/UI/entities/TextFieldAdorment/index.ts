import { Container, Text, TextStyle } from "pixi.js-legacy";
import { theme } from "../../style";

type TextFieldAdormentType = {
  body: string;
  currencyName?: string;
  fontSize: number;
  position?: { x: number; y: number };
};

export class TextFieldAdorment extends Container {
  private currencyText: Text;

  constructor({ position, currencyName, body, fontSize }: TextFieldAdormentType) {
    super();
    const rootStyle = {
      fontFamily: theme.fontFamily.primary,
      fill: theme.color.primaryText,
      fontSize,
    };

    if (!!position) this.position.set(position.x, position.y);

    const bodyStyle = new TextStyle({ ...rootStyle, fontWeight: "700" });
    const currencyStyle = new TextStyle({
      ...rootStyle,
      fontSize: fontSize * 0.6,
      fontWeight: "600",
    });

    const bodyText = new Text(body + " ", bodyStyle);

    this.currencyText = new Text(currencyName, currencyStyle);
    this.currencyText.y = bodyText.height - this.currencyText.height * 1.15;

    this.currencyText.x = bodyText.width;

    this.addChild(bodyText, this.currencyText);
  }

  setCurrency = (currency: string) => {
    this.currencyText.text = currency;
  };
}
