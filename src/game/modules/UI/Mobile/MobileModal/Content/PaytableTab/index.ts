import { Container } from "pixi.js-legacy";
import { theme } from "../../../../style";
import { TableTabTitle } from "../../../../entities/Modal/entities/TableTabTitle";
import { TextComponent } from "../../../../entities/Modal/entities/TextComponent";
import { SymbolsListTitle } from "../../../../entities/Modal/entities/SymbolsListTitle";
import {
  amountWinSlots,
  multipliers,
  symbolsDecription,
  wildDescription,
} from "../../../../entities/Modal/constants";
import { SymbolDescription } from "../../../../entities/Modal/entities/SymbolDescription";
import { divideObject } from "../../../../../../utils/divideObject";
import { Table } from "../../../../entities/Modal/entities/Table";
import { splitArrayIntoChunks } from "../../../../../../utils/splitArrayIntoChunks";
import { TableHeaderItem } from "../../../../entities/Modal/entities/TableHeaderItem";

type MobilePaytableTabType = {
  contentW: number;
  totalBet: number;
  currency: string
};

export class MobilePaytableTab extends Container {
  public title: TableTabTitle;
  private tables = new Container();
  private partOfTables: Table[] = [];
  private currency: string

  constructor({ contentW, totalBet, currency }: MobilePaytableTabType) {
    super();
    const gap = 30;
    this.currency = currency

    // page title
    this.title = new TableTabTitle({
      direction: "column",
      fontSizeH1: 36,
      fontSizeH2: 14,
    });
    this.title.x = (contentW / 2);

    // page table
    this.tables.y = this.title.height + gap;
    const tableHeaderBorderW = 2.5;
    const mobileTabelsConfigs = divideObject(multipliers, 3);
    const slotIcons = splitArrayIntoChunks(symbolsDecription, 3);
    const amountWinSlotsColumnWidth = 130;

    let verticalOffset = 0;
    mobileTabelsConfigs.forEach((config, i) => {
      const tableContainer = new Container();

      const length = Object.keys(config).length;
      const cellW = (contentW * 0.99 - amountWinSlotsColumnWidth) / length;
      const cellSize = { w: cellW, h: 50 };

      const tableHeader = new Container();
      let offsetX = 0;
      slotIcons[i].forEach((config) => {
        const { symbolName } = config;
        const item = new TableHeaderItem({
          borderWidth: 2.5,
          symbolName,
          size: { w: cellW, h: 140 },
          iconSize: 140,
        });

        item.x += offsetX;
        offsetX += item.width - tableHeaderBorderW;
        tableHeader.addChild(item);
      });
      tableHeader.x = amountWinSlotsColumnWidth;

      const table = new Table({
        cellSize,
        multipliers: config,
        amountWinSlots: amountWinSlots,
        amountWinSlotsColumnWidth,
      });
      table.y = tableHeader.height - tableHeaderBorderW;
      this.partOfTables.push(table);

      tableContainer.addChild(table, tableHeader);
      tableContainer.y = verticalOffset;
      verticalOffset += tableContainer.height + gap;
      this.tables.addChild(tableContainer);
    });

    // description under table
    const underTableText = new TextComponent({
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      wordWrapWidth: contentW,
      fontSize: theme.desktop.fontSize.primary,
    });
    underTableText.y = this.tables.y + this.tables.height + gap;

    //symbol titles
    const titles = new SymbolsListTitle({
      fontSizeH1: 38,
      fontSizeH2: theme.desktop.fontSize.secondory,
    });
    titles.y = underTableText.y + underTableText.height + gap;

    //symbols description items
    const symbolsContainer = new Container();

    let offsetY = 0;
    wildDescription.forEach(({ description, wildName, wildSize }) => {
      const symbol = new SymbolDescription({
        fontSize: 16,
        symbolName: wildName,
        symbolContainerW: contentW * 0.3,
        symbolSize: wildSize,
        textBody: description,
        textContainerW: contentW * 0.5,
        direction: "column"
      });
      symbol.y = offsetY;
      symbol.x = 10
      offsetY += symbol.height + 50;
      symbolsContainer.addChild(symbol);
    });

    symbolsContainer.y = titles.y + titles.height + gap;

    this.addChild(this.title, this.tables, underTableText, titles, symbolsContainer);

    this.setTotalBet(totalBet);
  }

  setTotalBet = (totalBet: number) => {
    this.title.setBetInfo(this.currency, totalBet)
    this.partOfTables.forEach((table) => {
      table.setCurrentTotalBet(totalBet);
    });
  };
}
