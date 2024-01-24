import { Container } from "pixi.js-legacy";
import { theme } from "../../../../style";
import { Table } from "../../../../entities/Modal/entities/Table";
import {
  amountWinSlots,
  multipliers,
  symbolsDecription,
  wildDescription,
} from "../../../../entities/Modal/constants";
import { TableHeaderItem } from "../../../../entities/Modal/entities/TableHeaderItem";
import { TextComponent } from "../../../../entities/Modal/entities/TextComponent";
import { SymbolDescription } from "../../../../entities/Modal/entities/SymbolDescription";
import { TableTabTitle } from "../../../../entities/Modal/entities/TableTabTitle";
import { SymbolsListTitle } from "../../../../entities/Modal/entities/SymbolsListTitle";

type PaytableTabType = {
  contentW: number;
  totalBet: number;
  currency: string;
};

export class DesktopPaytableTab extends Container {
  public title: TableTabTitle;
  private table: Table;
  private currency: string;

  constructor({ contentW, totalBet, currency }: PaytableTabType) {
    super();
    const gap = 20;
    this.currency = currency;

    // page title
    this.title = new TableTabTitle({
      direction: "row",
      fontSizeH1: 36,
      fontSizeH2: 12,
    });

    // page table
    const tableHeaderBorderW = 2.5;
    const cellSize = { w: 74, h: 30 };

    const tableHeader = new Container();
    tableHeader.x = cellSize.w;

    let offsetX = 0;
    symbolsDecription.forEach((config) => {
      const { symbolName } = config;
      const item = new TableHeaderItem({
        borderWidth: 2.5,
        symbolName,
        iconSize: 70,
        size: { w: 74, h: 74 },
      });

      item.x += offsetX;
      offsetX += item.width - tableHeaderBorderW;
      tableHeader.addChild(item);
    });

    tableHeader.y = this.title.height + gap;

    this.table = new Table({
      cellSize,
      multipliers: multipliers,
      amountWinSlots: amountWinSlots,
      amountWinSlotsColumnWidth: cellSize.w,
    });
    this.table.y = tableHeader.y + tableHeader.height - tableHeaderBorderW;

    // description under table

    const underTableText = new TextComponent({
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      wordWrapWidth: contentW,
      fontSize: 14,
    });
    underTableText.y = this.table.y + this.table.height + gap;

    //symbol titles
    const titles = new SymbolsListTitle({
      fontSizeH1: 36,
      fontSizeH2: theme.desktop.fontSize.secondory,
    });
    titles.y = underTableText.y + underTableText.height + gap;

    //symbols description items
    const symbolsContainer = new Container();

    let offsetY = 0;
    wildDescription.forEach(({ description, wildName, wildSize }, i) => {
      const symbol = new SymbolDescription({
        fontSize: 16,
        symbolName: wildName,
        symbolContainerW: contentW * 0.3,
        symbolSize: wildSize,
        textBody: description,
        textContainerW: contentW * 0.6,
        dividerVisibility: i !== symbolsDecription.length - 1,
      });
      symbol.y = offsetY;
      offsetY += symbol.height + 30;
      symbolsContainer.addChild(symbol);
    });

    symbolsContainer.y = titles.y + titles.height;

    this.addChild(this.title, tableHeader, this.table, underTableText, titles, symbolsContainer);
    this.setTotalBet(totalBet);
  }

  setTotalBet = (totalBet: number) => {
    this.title.setBetInfo(this.currency, totalBet);
    this.table.setCurrentTotalBet(totalBet);
  };
}
