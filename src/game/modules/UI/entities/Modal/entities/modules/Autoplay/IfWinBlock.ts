import { Container, Text, Graphics } from "pixi.js-legacy";
import { IfWinConfigType } from "../../../type";
import { theme } from "../../../../../style";


type IfWinBlockType = {
  config: IfWinConfigType;
  circleRadius?: number;
};

export class IfWinBlock extends Container {
  private smallerCircle: Graphics;

  constructor({ config, circleRadius = 30 }: IfWinBlockType) {
    super();

    const { text } = config;

    const newText = new Text(text, {
      fontFamily: theme.fontFamily.primary,
      fontSize: 28,
      fill: theme.color.white,
    });

    const circleContainer = new Container();

    const smallerCircleRadius = circleRadius / 2;

    const circle = new Graphics();
    circle.beginFill(0x0AE7F4, 0);
    circle.lineStyle(3, 0x0AE7F4);
    circle.drawCircle(0, 0, circleRadius);
    circle.endFill();

    this.smallerCircle = new Graphics();
    this.smallerCircle.beginFill(0x0AE7F4);
    this.smallerCircle.drawCircle(0, 0, smallerCircleRadius);
    this.smallerCircle.endFill();

    circleContainer.addChild(circle, this.smallerCircle);

    circle.x = circleContainer.width / 2;
    circle.y = circleContainer.height / 2;

    this.smallerCircle.x = circle.x;
    this.smallerCircle.y = circle.y;

    this.addChild(newText, circleContainer);
    newText.x = circleContainer.width + 10;
    newText.y = (circleContainer.height - newText.height) / 2;
    this.setActive(false);
  }

  setActive = (active: boolean) => {
    this.smallerCircle.visible = active;
  };
}
