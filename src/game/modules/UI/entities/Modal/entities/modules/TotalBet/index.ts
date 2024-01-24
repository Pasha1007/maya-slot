import { Container, Text } from "pixi.js-legacy";
import { theme } from "../../../../../style";
import { ContentButton } from "../../ContentButton";
import { GridContainer } from "../../GridContainer";
import { formatNumber } from "../../../../../../../utils/formatNumber";

type TotalBetType = {
  availableBets: number[];
  fontSize?: number;
  gap?: number;
  columns?: number;
  btnSize?: { w: number; h: number };
  onClick?: (betSize: number) => void;
};

export class TotalBet extends Container {
  private betsContainer = new Container();
  private activeBetValue?: number;
  private gridContainer!: GridContainer;
  private availableBets: number[] = [];

  private columns: number;
  private fontSize: number;
  private gap: number;
  private btnSize?: { w: number; h: number };
  private onClick?: (betSize: number) => void;

  constructor({
    availableBets,
    columns = 4,
    fontSize = 30,
    gap = 15,
    btnSize,

    onClick,
  }: TotalBetType) {
    super();
    this.availableBets = availableBets;
    this.columns = columns;
    this.fontSize = fontSize;
    this.gap = gap;
    this.btnSize = btnSize;
    this.onClick = onClick;

    const title = new Text("AVAILABLE BETS", {
      fontFamily: theme.fontFamily.primary,
      fontSize: fontSize,
      fontWeight: "700",
      fill: theme.color.white,
    });
    this.betsContainer.y = title.height * 1.5;
    // title.y = (screenVersion === ScreenVersion.MOBILE)
    //   ? 250
    //   : 0;
    this.addChild(title, this.betsContainer);
    this.setAvailableBets(this.availableBets);
    this.setActiveBet(Number(this.availableBets[0]));
  }

  setAvailableBets(availableBets: number[]) {
    if (this.betsContainer.children.length) this.betsContainer.removeChildren();

    this.availableBets = availableBets;
    const bets = this.availableBets.map((betValue) => {
      const value = new Text(formatNumber(betValue, 2), {
        fontFamily: theme.fontFamily.primary,
        fontSize: 36,
        fill: theme.color.white,
      });

      return new ContentButton({
        value: Number(betValue),
        fontSize: this.fontSize,
        sizes: this.btnSize,
        onClick: () => {
          if (this.onClick) this.onClick(Number(betValue));
        },
        content: value,
      });
    });

    this.gridContainer = new GridContainer({
      items: bets,
      columns: this.columns,
      gap: this.gap,
    });

    this.betsContainer.addChild(this.gridContainer);
  }

  setActiveBet(betValue: number) {
    this.activeBetValue = betValue;
    this.gridContainer.children.forEach((child) => {
      if (child instanceof ContentButton) {
        child.setActive(child.value === this.activeBetValue);
      }
    });
  }

  setAllDisabled(disable: boolean) {
    this.gridContainer.children.forEach((child) => {
      if (child instanceof ContentButton) {
        child.setDisable(disable);
      }
    });
  }
}
