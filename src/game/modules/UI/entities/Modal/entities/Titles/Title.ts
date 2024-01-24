import { Container, Text } from "pixi.js-legacy";
import { ModalTabsType, TabsTitleType } from "../../type";
import { theme } from "../../../../style";

type TitleType = {
  body: TabsTitleType;
  fontSize: number;
  key: ModalTabsType;
};

export class Title extends Container {
  public key: ModalTabsType;

  constructor({ body, fontSize, key }: TitleType) {
    super();
    this.key = key;
    const bodyText = new Text(body, {
      fontFamily: theme.fontFamily.primary,
      fill: theme.color.white,
      fontSize,
    });
    bodyText.anchor.set(0.5);

    this.addChild(bodyText);
  }
}
