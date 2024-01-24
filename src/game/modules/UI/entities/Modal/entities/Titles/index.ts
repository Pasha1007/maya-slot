import { Container } from "pixi.js-legacy";
import { ModalTabsType } from "../../type";
import { Title } from "./Title";
import { Position } from "../../../../../types";
import { titlesConfig } from "./config";
import { MayaManager } from "../../../../../manager";

type TitlesType = {
  position: Position;
  fontSize: number;
  manager: MayaManager;
};

export class Titles extends Container {
  private titles: Map<ModalTabsType, Title> = new Map();
  private currentVisibleTitle?: Title;

  constructor({ position, fontSize, manager }: TitlesType) {
    super();
    this.position.set(position.x, position.y);
    const { activeModalTab: activeModalType } = manager.getValue("gameState");

    titlesConfig.forEach((config) => {
      const key = config.tabKey;
      const titleInstance = new Title({
        body: config.title,
        key: config.tabKey,
        fontSize,
      });

      if (activeModalType === key) {
        titleInstance.visible = true;
        this.currentVisibleTitle = titleInstance;
      } else {
        titleInstance.visible = false;
      }

      this.addChild(titleInstance);
      this.titles.set(key, titleInstance);
    });
  }

  setTitleVisible(key: ModalTabsType, visible: boolean) {
    const title = this.titles.get(key);
    if (title) {
      if (visible) {
        if (this.currentVisibleTitle && this.currentVisibleTitle !== title) {
          this.currentVisibleTitle.visible = false;
        }
        title.visible = true;
        this.currentVisibleTitle = title;
      } else {
        title.visible = false;
        if (this.currentVisibleTitle === title) {
          this.currentVisibleTitle = undefined;
        }
      }
    }
  }
}

