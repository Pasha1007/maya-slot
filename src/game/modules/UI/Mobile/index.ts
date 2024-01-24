import { Container, Renderer } from "pixi.js-legacy";
import { PixiApp } from "../../App";
import { createSprite } from "../../../utils/createSprite";
import { MobileGamePanel } from "./GamePanel";
import { MobileModal } from "./MobileModal";
import { SlotsField } from "../entities/SlotsField";
import { ScreenVersion } from "../../types";
import { BlackoutBg } from "../entities/BlackoutBg";
import { screenSizes } from "../../constants";
import { GameNotification } from "../entities/Notification";

export class Mobile extends Container {
  private modal: MobileModal;
  private gameControl: MobileGamePanel;
  public slotsField: SlotsField;
  private blackoutBg: BlackoutBg;
  private app: PixiApp;

  constructor(app: PixiApp) {
    super();
    this.app = app;
    const gameBg = createSprite({
      textureName: "gameBg-m",
      anchor: { x: 0.5, y: 0 },
    });

    this.gameControl = new MobileGamePanel({
      position: { x: 0, y: 0 },
      manager: app.manager,
    });

    this.modal = new MobileModal({
      canvasWrapper: app.canvasWrapper,
      manager: app.manager,
      position: { x: 0, y: 0 },
    });

    const notification = new GameNotification({
      screenVersion: ScreenVersion.MOBILE,
      resources: app.state.resources,
    });

    this.slotsField = new SlotsField({
      slotsFieldTextureName: "slotsField-m",
      position: {
        x: 0,
        y: 100,
      },
      manager: app.manager,
      resources: app.state.resources,
      screenVersion: ScreenVersion.MOBILE,
      notification,
      renderer: app.app?.renderer as Renderer,
    });
    this.slotsField.scale.set(0.9)
    const spinButtonBg = createSprite({
      textureName: "spinButtonBg",
      anchor: { x: 0.5, y: 0 },
      position: { x: 0, y: 860 },
    });

    this.blackoutBg = new BlackoutBg({
      sizes: { w: screenSizes.mobile.width, h: screenSizes.mobile.height },
      manager: app.manager,
      screenVersion: ScreenVersion.MOBILE,
    });

    this.addChild(
      gameBg,
      spinButtonBg,
      this.gameControl,
      this.slotsField,
      this.blackoutBg,
      notification,
      this.modal
    );
  }

  destroy = () => {
    this.modal.destroy();
    this.gameControl.destroy();
    this.blackoutBg.destroy();
    this.slotsField.destroy();
    this.app.manager.setValue("setVisibleModal", false);
    this.app.manager.setValue("setAutoMode", false);
    this.app.manager.setValue("setRunRotateAnimation", false);
    this.app.manager.setValue("setRunSteps", false);
    this.app.manager.setValue("setRunSpin", false);
  };
}
