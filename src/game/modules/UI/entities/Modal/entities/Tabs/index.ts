import { Container } from "pixi.js-legacy";
import { tabsConfig } from "./config";
import { ModalTabsType } from "../../type";
import { Position } from "../../../../../types";
import { TabButton } from "../TabBtn";

type TabsType = {
  onClick: (tabKey: ModalTabsType) => void;
  position: Position;
  mragin: { x: number; y: number };
  scaleSize?: number;
};

export class Tabs extends Container {
  public tabs: TabButton[] = [];

  constructor({ onClick, position, mragin, scaleSize }: TabsType) {
    super();
    this.position.set(position.x, position.y);

    tabsConfig.forEach((buttonConfig, i) => {
      const tab = new TabButton({
        onClick: (tabKey: ModalTabsType) => {
          onClick(tabKey);
        },
        textureNames: buttonConfig.texturesForBtn,
        key: buttonConfig.tabKey,
        scaleSize,
        //additionalText: buttonConfig.additionlText,
      });
      tab.x = mragin.x * i;
      tab.y = mragin.y * i;
      this.tabs.push(tab);

      this.addChild(tab);
    });
  }
}
