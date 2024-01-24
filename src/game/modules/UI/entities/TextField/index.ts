import { Container, Text, TextStyle, ITextStyle } from "pixi.js-legacy";
import { Position } from "../../../types";
import { theme } from "../../style";
import { formatNumber } from "../../../../utils/formatNumber";
import { TextFieldAdorment } from "../TextFieldAdorment";

type TextFieldType = {
  position: Position;
  valueStyle?: Partial<ITextStyle>;
  adornment?: TextFieldAdorment;
  defaultValue?: number | null;
  valueOfset?: Position;
};

export class TextField extends Container {
  public value: Text;

  constructor({
    valueStyle,
    defaultValue,
    adornment,
    position = { x: 0, y: 0 },
    valueOfset = { x: 0, y: 0 },
  }: TextFieldType) {
    super();
    this.position.set(position.x, position.y);

    const style = {
      fontFamily: theme.fontFamily.primary,
      fill: theme.color.primaryText,
      ...valueStyle,
    };


    const rootValueStyle = new TextStyle(style);
    const euroSymbol = new Text("(€)", rootValueStyle)

    this.value = new Text(formatNumber(Number(defaultValue), 8), rootValueStyle);
    if (adornment) {
      euroSymbol.y = adornment?.height * 1.2
      euroSymbol.x = this.value?.width * 1.2

      this.value.y = adornment.height * 1.2;
      this.addChild(adornment, euroSymbol);
    }

    this.addChild(this.value);
  }

  setValue = (value: number) => {
    this.value.text = formatNumber(value, 8);
  };

  getValue = () => {
    return this.value.text.replace(/\s/g, "");
  };
}
