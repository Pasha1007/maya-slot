import { Container } from "pixi.js-legacy";

type GridContainerType = {
  items: Container[];
  columns: number;
  gap: number;
  alignItemsCenter?: boolean;
};

export class GridContainer extends Container {
  constructor({ items, columns, gap, alignItemsCenter: isItemsCenter = false }: GridContainerType) {
    super();

    const numRows = Math.ceil(items.length / columns);
    let lastRowItems = items.length % columns;

    for (let i = 0; i < items.length; i++) {
      const col = i % columns;
      const row = Math.floor(i / columns);

      const item = items[i];
      item.x = col * (item.width + gap);
      item.y = row * (item.height + gap);

      if (numRows > 1 && row === numRows - 1 && lastRowItems < columns && isItemsCenter) {
        const offset = ((columns - lastRowItems) * (item.width + gap)) / 2;
        item.x += offset;
      }

      this.addChild(item);
    }
  }
}

