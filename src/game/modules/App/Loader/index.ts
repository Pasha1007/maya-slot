import { Application, Loader, Graphics, filters } from "pixi.js-legacy";
import { ConfigType, configs, loaderResources } from "./config";
import { sleep } from "../../../utils/sleep";
import { ResourceNames, ResourceState, ScreenVersion } from "../../types";
import { screenSizes } from "../../constants";
import { CustomSpine } from "../../UI/entities/Spine";

export class Preloader {
  private app!: Application;
  private loader: Loader = new Loader();
  public resources: ResourceState = {};
  private screenVersion!: ScreenVersion;
  private loaderBG: Graphics | null = null;
  private progressBg: Graphics | null = null;
  private progressBorder: Graphics | null = null;
  private basiliskSpine: CustomSpine | null = null;
  private progress: Graphics | null = null;
  private progressValue: number = 0;
  // private audios: Audios;
  private basiliskAnimationFinished: boolean = false;
  private resourcesLoaded: boolean = false;
  private allowedAuidio: boolean = false;

  private config!: ConfigType;

  constructor() {
    document.body.addEventListener("click", this.allowAudio);
    // this.audios = audios;
  }

  private allowAudio = () => {
    this.allowedAuidio = true;
  };

  public load = async (
    screenVersion: ScreenVersion,
    app: Application,
    resources: { name: string; url: string }[],
    onComplete: () => void
  ) => {
    this.screenVersion = screenVersion;
    this.config = configs[this.screenVersion];
    this.app = app;
    this.resourcesLoaded = false;

    await this.createBodyPreloader();
    const promise = this.startBasiliskAnimation();
    // this.audios.load(sounds);

    if (this.loader.loading) {
      this.loader.reset();
    }

    resources.forEach(({ name, url }) => {
      if (this.loader.resources[name]) {
        this.resources[name as ResourceNames] = this.loader.resources[name];
      } else {
        this.loader.add(name, url);
      }
    });
    this.createProgressBar(this.config.progressBarW, this.config.progressBarH);
    this.loader.load(async (loader) => {
      Object.values(loader.resources).forEach((content) => {
        this.resources[content.name as ResourceNames] = content;
      });

      if (this.progress) this.progress.width = this.config.progressBarW;
      if (this.basiliskAnimationFinished) await sleep(150);
      if (!this.basiliskAnimationFinished) await promise;

      this.destroy();
      onComplete();

      this.resourcesLoaded = true;
    });
    
    this.loader.onProgress.add(this.onProgress);
  };

  private startBasiliskAnimation = () => {
    const animation = this.basiliskSpine?.startAnimation({
      animationName: "animation",
      loop: false,
      onComplete: () => {
        this.basiliskAnimationFinished = true;
      },
    });

    return animation;
  };

  private onProgress = (loader: Loader) => {
    this.progressValue = this.config.progressBarW * (loader.progress / 100);
    this.updateProgress();
  };

  private updateProgress = () => {
    if (this.progress && this.progressBorder) {
      this.progress.width = this.progressValue;
      this.progressBorder.width = this.progressValue;
    }
  };

  private createProgressBar = (width: number, height: number) => {
    this.progressBg = new Graphics()
      .beginFill(0x696969)
      .drawRect(0, 0, width, height * 0.75)
      .endFill();
    this.progressBg.x = -this.progressBg.width / 2;
    this.progressBg.y = this.config.progressBarOffsetY;

    this.progressBorder = new Graphics()
      .beginFill(0xff6464)
      .drawRect(0, 0, width, height)
      .endFill();
    this.progressBorder.filters = [new filters.BlurFilter(10)];
    this.progressBorder.x = -this.progressBorder.width / 2;
    this.progressBorder.y =
      -(this.progressBorder.height - this.progressBg.height) / 2 + this.config.progressBarOffsetY;

    this.progress = new Graphics()
      .beginFill(0xffffff)
      .lineStyle(1, 0xff6464)
      .drawRect(0, 0, width, height)
      .endFill();

    this.progress.x = -this.progress.width / 2;
    this.progress.y =
      -(this.progress.height - this.progressBg.height) / 2 + this.config.progressBarOffsetY;

    this.app.stage.addChild(this.progressBg, this.progressBorder, this.progress);
    this.updateProgress();
  };

  private createBodyPreloader = async () => {
    this.basiliskAnimationFinished = false;
    this.resourcesLoaded = false;

    const width = screenSizes[this.screenVersion].width;
    const height = screenSizes[this.screenVersion].height;

    this.loaderBG = new Graphics().beginFill(0x010527).drawRect(0, 0, width, height).endFill();
    this.loaderBG.position.set(-this.loaderBG.width / 2, 0);

    this.app.stage.addChild(this.loaderBG);

    loaderResources.forEach(({ name, url }) => {
      if (this.loader.resources[name]) {
        this.resources[name as ResourceNames] = this.loader.resources[name];
      } else {
        this.loader.add(name, url);
      }
    });

    await new Promise<void>((resolve) => {
      this.loader.load((loader) => {
        Object.values(loader.resources).forEach((content) => {
          this.resources[content.name as ResourceNames] = content;
        });
        
        this.basiliskSpine = new CustomSpine({ spineResource: this.resources["loader"], alpha: 0 });
        this.basiliskSpine.move({
          x: this.config.basilisklAnimationOffsetX,
          y: this.config.basilisklAnimationOffsetY,
        });
        this.basiliskSpine.resize(this.config.basilisklAnimationSize);
        this.app.stage.addChild(this.basiliskSpine);
        resolve();
      });
    });
  };

  destroy = async () => {
    if (this.progressBg && this.progress && this.basiliskSpine && this.progressBorder) {
      this.app.stage?.removeChildren();
      this.progressBorder = null;
      this.progressBg = null;
      this.progress = null;
      this.basiliskSpine = null;
      this.basiliskSpine = null;
      this.loaderBG = null;
      this.progressValue = 0;
    }
  };
}
