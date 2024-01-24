import { Container, Renderer } from "pixi.js-legacy";
import { PixiApp } from "../../App";
import { DesktopGamePanel } from "./GamePanel";
import { SlotsField } from "../entities/SlotsField";
import { ScreenVersion } from "../../types";
import { DesktopModal } from "./DesktopModal";
import { BlackoutBg } from "../entities/BlackoutBg";
import { screenSizes } from "../../constants";
import { GameNotification } from "../entities/Notification";
import { SpineBg } from "../entities/SpineBg";

export class Desktop extends Container {
  private modal: DesktopModal;
  private gameControl: DesktopGamePanel;
  public slotsField: SlotsField;
  private blackoutBg: BlackoutBg;
  private app: PixiApp;
  private spineGameBg: SpineBg;

  constructor(app: PixiApp) {
    super();
    this.app = app;
    this.spineGameBg = new SpineBg({
      manager: app.manager,
      resouses: app.state.resources,
    });

    this.gameControl = new DesktopGamePanel({
      position: { x: 0, y: 920 },
      manager: app.manager,
    });

    this.modal = new DesktopModal({
      position: { x: -2, y: 28 },
      manager: app.manager,
      canvasWrapper: app.canvasWrapper,
    });

    this.blackoutBg = new BlackoutBg({
      sizes: { w: screenSizes.desktop.width, h: screenSizes.desktop.height },
      manager: app.manager,
      screenVersion: ScreenVersion.DESKTOP,
    });

    const notification = new GameNotification({
      screenVersion: ScreenVersion.DESKTOP,
      resources: app.state.resources,
    });

    this.slotsField = new SlotsField({
      slotsFieldTextureName: "slotsField-d",
      position: {
        x: 0,
        y: 0,
      },
      manager: app.manager,
      resources: app.state.resources,
      screenVersion: ScreenVersion.DESKTOP,
      notification,
      renderer: app.app?.renderer as Renderer,
    });

    this.addChild(
      this.spineGameBg,
      this.gameControl,
      this.slotsField,
      this.blackoutBg,
      this.modal,
      notification
    );
  }

  destroy = () => {
    this.modal.destroy();
    this.gameControl.destroy();
    this.blackoutBg.destroy();
    this.spineGameBg.destroy();
    this.slotsField.destroy();
    this.app.manager.setValue("setVisibleModal", false);
    this.app.manager.setValue("setAutoMode", false);
    this.app.manager.setValue("setRunRotateAnimation", false);
    this.app.manager.setValue("setRunSteps", false);
    this.app.manager.setValue("setRunSpin", false);
  };
}
