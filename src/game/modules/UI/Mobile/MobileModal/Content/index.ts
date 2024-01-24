import { Container, DisplayObject } from "pixi.js-legacy";
import { TotalBet } from "../../../entities/Modal/entities/modules/TotalBet";
import { Autoplay } from "../../../entities/Modal/entities/modules/Autoplay";
import { ModalContentType, ModalTabsType } from "../../../entities/Modal/type";
import { MobilePaytableTab } from "./PaytableTab";
import { ScreenVersion } from "../../../../types";

export class MobileContent extends Container {
  private contentMap: Map<ModalTabsType, DisplayObject> = new Map();

  public totalBet: TotalBet;
  public gameTable!: MobilePaytableTab;
  public autoplay: Autoplay;

  constructor({ contentW, manager }: ModalContentType) {
    super();

    this.totalBet = new TotalBet({
      onClick: (bet) => {
        manager.setValue("setTotalBet", { totalBet: bet });
        manager.setValue("setVisibleModal", false);
      },
      columns: 2,
      gap: 10,
      btnSize: { w: contentW / 2 - 10, h: 70 },
      fontSize: 60,
      availableBets: manager.state.init.available_bets,
    });

    this.totalBet.visible = false;

    this.gameTable = new MobilePaytableTab({
      contentW,
      totalBet: manager.state.gameState.totalBet,
      currency: manager.state.init.game_state.currency,
    });
    this.gameTable.visible = false;

    this.autoplay = new Autoplay({
      buttonSizes: { w: contentW, h: 95 },
      manager,
      gap: 25,
      contentW,
      alignItemsCenter: true,
      screenVersion: ScreenVersion.MOBILE,

    });
    this.autoplay.visible = false;

    this.addChild(this.totalBet, this, this.gameTable, this.autoplay);

    this.contentMap.set("bet", this.totalBet);
    this.contentMap.set("table", this.gameTable);
    this.contentMap.set("auto", this.autoplay);

    this.showTabContent("bet");

    this.addChild(this.totalBet, this.autoplay);
  }

  showTabContent(tab: ModalTabsType) {
    this.contentMap.forEach((content, key) => {
      content.visible = key === tab;
    });
  }
}
