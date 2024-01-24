import { Container, Graphics, Text, TextStyle } from "pixi.js-legacy";
import { theme } from "../../../style";

type TableType = {
  multipliers: Record<string, number[]>;
  cellSize: { w: number; h: number };
  wrapperBorderW?: number;
  innerBorderW?: number;
  amountWinSlots: string[];
  commonTextStyle?: TextStyle;
  cellFontSize?: number;
  amountWinSlotsColumnWidth?: number;
};

export class Table extends Container {
  private currentTotalBet!: number;
  private multipliers: Record<string, number[]>;
  private textObjects: Text[][] = [];
  private tableContainer = new Container();
  private amountWinSlotsColumnWidth: number;
  private cellSize: { w: number; h: number };

  constructor({
    multipliers,
    cellSize,
    wrapperBorderW = 2,
    innerBorderW = 1,
    amountWinSlots,
    commonTextStyle,
    cellFontSize,
    amountWinSlotsColumnWidth = 100,
  }: TableType) {
    super();
    this.cellSize = cellSize;
    this.multipliers = {};
    for (const key in multipliers) {
      if (multipliers.hasOwnProperty(key)) {
        this.multipliers[key] = Array.from(new Set(multipliers[key]));
      }
    }

    this.amountWinSlotsColumnWidth = amountWinSlotsColumnWidth;

    const columns = Object.keys(this.multipliers).length + 1;
    const rows = this.multipliers[Object.keys(this.multipliers)[0]].length;

    this.x = wrapperBorderW;

    const textStyle = new TextStyle({
      fontFamily: theme.fontFamily.primary,
      fontSize: 20,
      fill: theme.color.white,
      ...commonTextStyle,
    });

    const firstColumnStyles = new TextStyle({
      ...textStyle,
      fontWeight: "700",
      fontSize: cellFontSize || 20,
    });

    for (let row = 0; row < rows; row++) {
      this.textObjects[row] = [];
      const rowContainer = new Container();
      for (let col = 0; col < columns; col++) {
        const cell = new Container();

        const border = new Graphics();
        border.lineStyle(innerBorderW, theme.color.yellow);
        border.drawRect(0, 0, this.getCellWidth(col), cellSize.h);

        const rowIndex = rows - row - 1;
        const isAmountWinSlot = col === 0;
        const value = isAmountWinSlot
          ? amountWinSlots[rowIndex]
          : this.multipliers[Object.keys(this.multipliers)[col - 1]][rowIndex];
        const result = isAmountWinSlot ? value : (Number(value) * this.currentTotalBet).toFixed(1);

        const text = new Text(result, isAmountWinSlot ? firstColumnStyles : textStyle);
        text.anchor.set(0.5);
        text.position.set(this.getCellWidth(col) / 2, cellSize.h / 2);

        cell.addChild(border, text);
        cell.x = this.getColumnX(col);
        cell.y = 0;

        rowContainer.addChild(cell);
        this.textObjects[row][col] = text;
      }
      rowContainer.y = (rows - row - 1) * cellSize.h;
      this.tableContainer.addChild(rowContainer);
    }

    const outerBorder = new Graphics();
    outerBorder.lineStyle(wrapperBorderW, theme.color.yellow);
    outerBorder.drawRect(
      0,
      0,
      columns * cellSize.w - cellSize.w + amountWinSlotsColumnWidth,
      rows * cellSize.h
    );

    this.addChild(outerBorder, this.tableContainer);
  }

  setCurrentTotalBet = (totalBet: number) => {
    this.currentTotalBet = totalBet;
    this.updateTable();
  };

  private getColumnX(col: number): number {
    let x = 0;
    for (let i = 0; i < col; i++) {
      x += this.getCellWidth(i);
    }
    return x;
  }

  private getCellWidth(col: number): number {
    if (col === 0) {
      return this.amountWinSlotsColumnWidth;
    } else {
      return this.cellSize.w;
    }
  }

  private updateTable() {
    for (let row = 0; row < this.textObjects.length; row++) {
      for (let col = 1; col < this.textObjects[row].length; col++) {
        const multiplier = this.multipliers[Object.keys(this.multipliers)[col - 1]][row];
        const result = (multiplier * (this.currentTotalBet || 0)).toFixed(1);
        this.textObjects[row][col].text = result;
      }
    }
  }
}
