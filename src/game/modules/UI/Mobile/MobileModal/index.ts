import { Container } from "pixi.js-legacy";
import { createSprite } from "../../../../utils/createSprite";
import { Position, ScreenVersion } from "../../../types";
import { MayaManager } from "../../../manager";
import { ModalController } from "../../entities/Modal/controller";
import { ScrollContainer } from "../../entities/Modal/entities/ScrollContainer";
import { MobileContent } from "./Content";
import { Titles } from "../../entities/Modal/entities/Titles";
import { screenSizes } from "../../../constants";
import { CloseBtn } from "../../entities/Modal/entities/CloseButton";
import { Tabs } from "../../entities/Modal/entities/Tabs";

type MobileModalType = {
  position: Position;
  manager: MayaManager;
  canvasWrapper: HTMLDivElement;
};

export class MobileModal extends Container {
  private manager: MayaManager;
  private modalController: ModalController;
  private wrapperContent = new Container();
  public scrollContainer: ScrollContainer;
  public content: MobileContent;
  public titles: Titles;

  constructor({ canvasWrapper, manager, position }: MobileModalType) {
    super();
    this.manager = manager;
    this.interactive = true;
    this.position.set(position.x, position.y);
    this.modalController = new ModalController({
      manager,
      ui: this,
    });
    const { width } = screenSizes[ScreenVersion.MOBILE];
    const padding = 20;
    const maskSize = { w: width - padding * 2, h: 649 };
    this.wrapperContent.position.set(-300, 320);

    const closeBtn = new CloseBtn({
      onClick: () => {
        this.manager.setValue("setVisibleModal", false);
      },
      position: { x: 0, y: 80 },
      textureName: "closeModalBtn-m",
    });
    closeBtn.interactive = true;

    this.titles = new Titles({
      position: { x: 0, y: 205 },
      fontSize: 90,
      manager,
    });

    this.content = new MobileContent({
      contentW: maskSize.w,
      manager,
    });

    this.scrollContainer = new ScrollContainer({
      canvasWrapper,
      content: this.content,
      maskSize,
      screenVersion: ScreenVersion.MOBILE,
    });
    this.wrapperContent.addChild(this.scrollContainer);

    const modalBg = createSprite({
      textureName: "modalBg-m",
      anchor: { x: 0.5, y: 0 },
    });

    const tabs = new Tabs({
      onClick: (tabKey) => {
        manager.setValue("setActiveModalTab", tabKey);
      },
      position: { x: -160, y: 1060 },
      mragin: { x: 155, y: 0 },
      scaleSize: 1,
    });

    const tabsPanelBg = createSprite({
      textureName: "tabsField-m",
      anchor: { x: 0.5, y: 0 },
      position: { x: 0, y: 965 },
    });

    closeBtn.on("pointerdown", () => {
      canvasWrapper.removeEventListener("wheel", this.scrollContainer.onWheel);
    });

    this.addChild(modalBg, this.wrapperContent, this.titles, closeBtn, tabsPanelBg, tabs);
  }

  destroy = () => {
    this.modalController.destroy();
    this.scrollContainer.destroy();
  };
}
