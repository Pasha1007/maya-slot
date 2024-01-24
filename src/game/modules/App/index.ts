import * as PIXI from "pixi.js-legacy";
import { Application } from "pixi.js-legacy";
import { MainState, ScreenVersion } from "../types";
import { assetsMap, fonts } from "../../assetsMap";
import { Preloader } from "./Loader";
import { Desktop } from "../UI/Desktop";
import TWEEN from "@tweenjs/tween.js";
import FontFaceObserver from "fontfaceobserver";
import { MayaManager } from "../manager";
import { screenSizes } from "../constants";
import { Mobile } from "../UI/Mobile";

export class PixiApp {
  public app: PIXI.Application | null = null;
  private screenSize!: ScreenVersion;
  private prevScreenSize!: ScreenVersion;
  public canvasWrapper: HTMLDivElement;
  private loader!: Preloader;
  private ui!: Desktop | Mobile;
  public manager: MayaManager;

  public state: MainState = {
    resources: {},
  };

  constructor(canvasWrapper: HTMLDivElement, manager: MayaManager) {
    this.canvasWrapper = canvasWrapper;
    this.manager = manager;
    const loadFonts = fonts.map((font) => new FontFaceObserver(font).load());

    // this.audios = new Audios();
    Promise.all(loadFonts).then(() => {
      this.loader = new Preloader();
      this.state.resources = this.loader.resources;
      this.loadAssets();
    });

    window.addEventListener("resize", () => {
      if (!this.loader) return;

      this.loadAssets();
    });
  }

  private createApp = () => {
    const { width, height } = screenSizes[this.screenSize];

    if (this.app) {
      this.destroy();
    }

    this.app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x1d1f23,
    });

    this.canvasWrapper.appendChild(this.app.view);
    this.checkScreenSize();
    this.app.stage.position.set(width / 2, 0);
  };

  private loadAssets = () => {
    this.checkScreenSize();

    if (this.prevScreenSize !== this.screenSize) {
      this.prevScreenSize = this.screenSize;
      this.createApp();

      this.loader.load(
        this.screenSize,
        this.app as Application,
        [...assetsMap[this.screenSize], ...assetsMap.common, ...assetsMap.spines],
        () => {
          this.init();
        }
      );
    }
  };

  private init = () => {
    switch (this.screenSize) {
      case ScreenVersion.MOBILE:
        this.ui = new Mobile(this);
        break;
      case ScreenVersion.DESKTOP:
        this.ui = new Desktop(this);
        break;
      default:
        break;
    }
    this.app?.stage.addChild(this.ui);
    this.manager.emitter.init();

    this.app?.ticker.add(() => {
      TWEEN.update();

      const { gameState } = this.manager.state

      if (gameState.runSteps) {
        this.ui.slotsField.reels.forEach((reel) => {
          reel.slots.forEach((slot) => {
            slot.redraw();
          });
        });
      }
    });
  };

  private checkScreenSize = () => {
    const windowWidth = window.innerWidth;

    if (windowWidth > screenSizes.desktop.width && this.app) {
      const scaleW = Math.max(
        this.canvasWrapper.offsetWidth / (screenSizes.desktop.width * this.app.renderer.resolution),
        1
      );
      const scaleH = Math.max(
        this.canvasWrapper.clientHeight /
        (screenSizes.desktop.height * this.app.renderer.resolution),
        1
      );
      this.canvasWrapper.style.transform = `scale(${Math.min(scaleW, scaleH)})`;
    } else {
      this.canvasWrapper.style.transform = `scale(1)`;
    }

    if (windowWidth <= screenSizes.mobile.breakpoint) {
      this.screenSize = ScreenVersion.MOBILE;
    } else {
      this.screenSize = ScreenVersion.DESKTOP;
    }
  };

  public destroy = () => {
    if (this.ui) this.ui.destroy();
    this.app?.destroy(true, { baseTexture: true, children: true });
    this.manager.emitter.removeAllListeners();
    this.loader.destroy();
    // this.audios.stopAll();
  };
}
