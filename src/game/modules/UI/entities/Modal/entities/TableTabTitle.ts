import { Container, Text } from "pixi.js-legacy";
import { theme } from "../../../style";

type TableTabTitleType = {
  direction: "row" | "column";
  fontSizeH1?: number;
  fontSizeH2?: number;
};

export class TableTabTitle extends Container {
  private description: Text;
  private totalBet: number = 0;
  private currnecy: string = " ";

  constructor({ direction, fontSizeH1, fontSizeH2 }: TableTabTitleType) {
    super();

    const text = new Text("SYMBOLS", {
      fontSize: fontSizeH1 || 12,
      fontFamily: theme.fontFamily.primary,
      fill: theme.color.white,
    });

    this.description = new Text(` ()`, {
      fontSize: 10 || 14,
      fontFamily: theme.fontFamily.primary,
      fill: theme.color.white,
    });

    if (direction === "row") {
      this.description.y = (text.height - this.description.height) / 1.7;
      this.description.x = text.width + 15;
    }

    if (direction === "column") {
      this.description.anchor.set(0.5, 0);
      text.anchor.set(0.5, 0);
      this.description.y = text.height;
    }

    this.addChild(text, this.description);
  }

  setBetInfo = (currency?: string, totalBet?: number) => {
    if (currency) this.currnecy = currency;
    if (totalBet) this.totalBet = totalBet;
    const newCurrncy = currency || this.currnecy;
    const newTotalBet = totalBet || this.totalBet;

    this.description.text = `(ALL WINS SHOW ARE IN ${newCurrncy} AND CAILD FOR CURRENT BET OF ${newTotalBet} ${newCurrncy})`;
  };
}
