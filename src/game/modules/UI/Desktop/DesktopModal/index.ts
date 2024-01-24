import { Container } from "pixi.js-legacy";
import { Position, ScreenVersion } from "../../../types";
import { createSprite } from "../../../../utils/createSprite";
import { MayaManager } from "../../../manager";
import { CloseBtn } from "../../entities/Modal/entities/CloseButton";
import { ModalController } from "../../entities/Modal/controller";
import { Tabs } from "../../entities/Modal/entities/Tabs";
import { Titles } from "../../entities/Modal/entities/Titles";
import { DesktopContent } from "./Content";
import { ScrollContainer } from "../../entities/Modal/entities/ScrollContainer";

type DesktopModalType = {
  position: Position;
  manager: MayaManager;
  canvasWrapper: HTMLDivElement;
};

export class DesktopModal extends Container {
  private manager: MayaManager;
  private modalController: ModalController;
  private wrapperContent = new Container();
  public scrollContainer: ScrollContainer;
  public content: DesktopContent;
  public titles: Titles;

  constructor({ position, manager, canvasWrapper }: DesktopModalType) {
    super();
    this.manager = manager;
    this.interactive = true;
    this.position.set(position.x, position.y);
    this.modalController = new ModalController({
      manager,
      ui: this,
    });
    const maskSize = { w: 675, h: 700 };
    const wrapperContentOffset = { x: -300, y: 180 };
    this.wrapperContent.position.set(wrapperContentOffset.x, wrapperContentOffset.y);

    const modalBg = createSprite({
      textureName: "modalBg-d",
      anchor: { x: 0.5, y: 0 },
    });

    const closeBtn = new CloseBtn({
      onClick: () => {
        this.manager.setValue("setVisibleModal", false);
      },
      position: { x: (modalBg.width / 2) * 0.95, y: 15 },
      textureName: "closeModalBtn-d",
    });
    closeBtn.interactive = true;

    this.titles = new Titles({
      position: { x: 30, y: 80 },
      fontSize: 90,
      manager,
    });

    this.content = new DesktopContent({
      contentW: maskSize.w,
      manager,
    });

    this.scrollContainer = new ScrollContainer({
      canvasWrapper,
      content: this.content,
      maskSize,
      screenVersion: ScreenVersion.DESKTOP,
    });
    this.wrapperContent.addChild(this.scrollContainer);

    const tabs = new Tabs({
      onClick: (tabKey) => {
        this.manager.setValue("setActiveModalTab", tabKey);
      },
      position: { x: -406 * 0.95, y: 65 },
      mragin: { x: 0, y: 100 },
      scaleSize: 0.65,
    });

    closeBtn.on("pointerdown", () => {
      canvasWrapper.removeEventListener("wheel", this.scrollContainer.onWheel);
    });

    this.addChild(modalBg, closeBtn, tabs, this.titles, this.wrapperContent);
  }

  destroy = () => {
    this.modalController.destroy();
    this.scrollContainer.destroy();
  };
}
