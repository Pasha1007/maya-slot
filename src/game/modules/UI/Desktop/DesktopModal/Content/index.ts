import { Container, DisplayObject } from "pixi.js-legacy";
import { TotalBet } from "../../../entities/Modal/entities/modules/TotalBet";
import { DesktopPaytableTab } from "./PaytableTab";
import { Autoplay } from "../../../entities/Modal/entities/modules/Autoplay";
import { ModalContentType, ModalTabsType } from "../../../entities/Modal/type";
import { ScreenVersion } from "../../../../types";

export class DesktopContent extends Container {
  private contentMap: Map<ModalTabsType, DisplayObject> = new Map();

  public totalBet: TotalBet;
  public gameTable: DesktopPaytableTab;
  public autoplay: Autoplay;

  constructor({ contentW, manager }: ModalContentType) {
    super();
    this.totalBet = new TotalBet({
      onClick: (bet) => {
        manager.setValue("setTotalBet", { totalBet: bet });
        manager.setValue("setVisibleModal", false);
      },
      availableBets: manager.state.init.available_bets,
    });
    this.totalBet.visible = false;

    this.gameTable = new DesktopPaytableTab({
      contentW,
      totalBet: manager.state.gameState.totalBet,
      currency: manager.state.init.game_state.currency,
    });
    this.gameTable.visible = false;

    this.autoplay = new Autoplay({
      buttonSizes: { w: 123, h: 60 },
      contentW,
      manager,
      screenVersion: ScreenVersion.DESKTOP,
    });
    this.autoplay.visible = false;

    this.addChild(this.totalBet, this.gameTable, this.autoplay);

    this.contentMap.set("bet", this.totalBet);
    this.contentMap.set("table", this.gameTable);
    this.contentMap.set("auto", this.autoplay);
  }

  showTabContent(tab: ModalTabsType) {
    this.contentMap.forEach((content, key) => {
      content.visible = key === tab;
    });
  }
}
