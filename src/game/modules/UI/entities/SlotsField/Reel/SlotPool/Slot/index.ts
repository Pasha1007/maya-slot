import { Container, RenderTexture, Renderer, Sprite } from "pixi.js-legacy";
import { ResourceState, ScreenVersion } from "../../../../../../types";
import { Tween } from "@tweenjs/tween.js";
import { SlotsConfigType } from "./config";
import { SlotKeys } from "./constants";
import { CustomSpine } from "../../../../Spine";
import { TOTAL_REELS, TOTAL_ROWS, slotsFieldSizes } from "../../../../../../constants";
import { generateUniqueId } from "../../../../../../../utils/generateUniqueId";
import { createSprite } from "../../../../../../../utils/createSprite";
import { WildMultiplier } from "./WildMultiplier";

type StartAnimationType = {
  animationName: string;
  repeat?: number;
  loop?: boolean;
  onComplete?: () => void;
};

type SlotType = {
  resources: ResourceState;
  screenVersion: ScreenVersion;
  slotConfig: SlotsConfigType | "EMPTY";
  renderer: Renderer;
};

export class Slot extends Container {
  public isWild: boolean = false;
  public slotH: number;
  public slotW: number;
  public slotKey!: SlotKeys;
  public wildMultiplier: null | WildMultiplier = null;
  public isDestroyed: boolean = false;
  public spineSlot!: CustomSpine;
  public isEmpty: boolean = false;
  public id: string = generateUniqueId();
  public isHold?: boolean;
  public renderer: Renderer;
  public staticWildMultiplier: null | WildMultiplier = null;
  private slotDimming?: Sprite;
  private screenVersion: ScreenVersion;
  private dimmingAppearTeween?: Tween<Sprite>;
  private dimmingDisappearTeween?: Tween<Sprite>;
  private rendererTexture!: RenderTexture;
  private isAnimating: boolean = false;

  constructor({ resources, screenVersion, slotConfig, renderer }: SlotType) {
    super();
    this.screenVersion = screenVersion;
    this.slotH = slotsFieldSizes[this.screenVersion].h / TOTAL_ROWS;
    this.slotW = slotsFieldSizes[this.screenVersion].w / TOTAL_REELS;
    this.pivot.y = this.slotH;
    this.renderer = renderer;

    if (slotConfig !== "EMPTY") {
      this.slotKey = slotConfig.key as SlotKeys;
      this.isWild = this.slotKey === SlotKeys.WILD;
      console.log("CREATE SLOT");

      const screenConfig = slotConfig[this.screenVersion];

      this.spineSlot = new CustomSpine({ spineResource: resources[slotConfig.name] });
      this.spineSlot.setSpineFirstFrame = (animationName: string) => {
        const animation = this.spineSlot.spine.spineData.findAnimation(animationName);
        if (!animation) {
          console.error(`Animation not found: ${animationName}`);
          return;
        }
      };


      this.spineSlot.resize(screenConfig.spineSize);

      const defaultOffsetX = this.spineSlot.width / 2;
      const defaultOffsetY = (ScreenVersion.MOBILE)
        ? this.spineSlot.h + screenConfig.offsetY + 12
        : this.spineSlot.h + screenConfig.offsetY

      this.spineSlot.move({
        x: (this.slotW - this.spineSlot.width) / 3 + defaultOffsetX,
        y: (this.slotH - this.spineSlot.height) / 1.6 + defaultOffsetY + this.spineSlot.height,
      });

      this.rendererTexture = RenderTexture.create(
        this.spineSlot.width * 2,
        this.spineSlot.height * 2,
        undefined,
        window.devicePixelRatio || 1
      );
      const sprite = new Sprite(this.rendererTexture);
      sprite.y = -this.spineSlot.height
      this.spineSlot.cullable = true

      this.slotDimming = createSprite({
        textureName: "slotDimming",
        sizes: { w: this.slotW, h: this.slotH + 2 },
        anchor: { x: 0, y: 0 },
      });
      this.slotDimming.alpha = 0;
      this.slotDimming.y = -2;

      if (this.slotDimming) {
        this.dimmingAppearTeween = this.createDimmingTween(this.slotDimming, 0.8, 250);
        this.dimmingDisappearTeween = this.createDimmingTween(this.slotDimming, 0, 250);
      }

      this.addChild(sprite);

      if (this.isWild) {
        this.zIndex = 10;
        this.wildMultiplier = new WildMultiplier({ screenVersion });
        this.staticWildMultiplier = new WildMultiplier({ screenVersion });

        this.staticWildMultiplier.x = this.slotW / 2;
        this.staticWildMultiplier.y = this.slotH * 0.48;

        this.wildMultiplier.x = this.slotW / 2;
        this.wildMultiplier.y = this.slotH * 0.48;
        this.addChild(this.staticWildMultiplier, this.wildMultiplier);
      }
      this.addChild(this.slotDimming);
      this.redraw(true);
    } else {
      this.isEmpty = true;
      this.visible = false;
      const eptySprite = createSprite({
        emptyTexture: true,
      });

      this.addChild(eptySprite);
    }
  }

  public redraw = (isNeedRedraw?: boolean) => {
    if (this.isAnimating || isNeedRedraw) {
      this.renderer.render(this.spineSlot, {
        renderTexture: this.rendererTexture
      });
    }
  };

  public startAnimation = ({
    repeat,
    animationName,
    loop = false,
    onComplete,
  }: StartAnimationType) => {
    this.isAnimating = true;

    return new Promise((resolve) => {
      this.spineSlot.setAnimationSpeed(1);
      this.spineSlot.startAnimation({
        animationName,
        loop,
        onComplete: () => {
          onComplete && onComplete();
          resolve(true);
          this.isAnimating = false;
        },
        repeat,
      });
    });
  };

  setDimming = (time: number, isShow: boolean) => {
    if (isShow) {
      if (this.dimmingAppearTeween) {
        this.dimmingAppearTeween.duration(time).start();
      }
    } else {
      if (this.dimmingDisappearTeween) {
        this.dimmingDisappearTeween.duration(time).start();
      }
    }
  };

  private createDimmingTween = (obj: Sprite, alpha: number, time: number) => {
    return new Tween(obj).to(
      {
        alpha,
      },
      time
    );
  };

  destroySlot = () => {
    this.destroy({ baseTexture: true, children: true });
    this.rendererTexture.destroy(true);
  }
}
