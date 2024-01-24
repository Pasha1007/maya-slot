import { Container, Renderer } from "pixi.js-legacy";
import { Position, ResourceNames, ResourceState, ScreenVersion } from "../../../types";
import { createSprite } from "../../../../utils/createSprite";
import { MayaManager } from "../../../manager";
import { Controller } from "./controller";
import { TOTAL_REELS, TOTAL_ROWS, slotsFieldSizes } from "../../../constants";
import { Reel } from "./Reel";
import { Tween, remove } from "@tweenjs/tween.js";
import { GameNotification } from "../Notification";
import { CombinationMultiplier } from "./CombinationMultiplier";
import { getPowIn } from "./controller/utils/getPowIn";
import { BurstedSlots } from "./BurstedSlots";

type EasingFunction = (t: number) => number;

type MoveSlotsType = {
  startRange: number;
  endRange: number;
  reelIndex: number[];
  movePositionY: number;
  spawnedMargin?: number;
  isSpinTween?: boolean;
  movePositionX?: number;
  isIncreaseDistanceBetweenSLot?: boolean;
  time?: number;
  easing?: EasingFunction;
  delay?: number;
};

type SlotsFieldType = {
  slotsFieldTextureName: ResourceNames;
  position: Position;
  manager: MayaManager;
  screenVersion: ScreenVersion;
  resources: ResourceState;
  notification: GameNotification;
  renderer: Renderer
};

type PositionObjectType = { slotPositionY: number; slotPositionX: number; spawnedMargin: number };

export class SlotsField extends Container {
  private manager: MayaManager;
  private controller: Controller;
  private reelsContainer = new Container();
  private rowH: number;
  private columnW: number;
  public multiplayers: CombinationMultiplier;
  public burstedSlots: BurstedSlots;
  public notification: GameNotification;
  private spinTweens: Tween<PositionObjectType>[] = [];
  private resolve!: (value: unknown) => void;
  public reelsRunning: boolean = false;
  private isSpeedUp: boolean = false;
  private spawnedMargin = 0;
  public reels: Reel[] = [];

  constructor({
    slotsFieldTextureName: borderTextureName,
    position,
    manager,
    screenVersion,
    resources,
    notification,
    renderer
  }: SlotsFieldType) {
    super();
    this.controller = new Controller({ manager, ui: this, screenVersion });
    this.manager = manager;
    this.notification = notification;
    this.position.set(position.x, position.y);
    const slotsFieldH = slotsFieldSizes[screenVersion].h;
    const slotsFieldW = slotsFieldSizes[screenVersion].w;
    const fillGap = 10;
    this.rowH = slotsFieldH / TOTAL_ROWS;
    this.columnW = slotsFieldW / TOTAL_REELS;

    const slotsFieldSprite = createSprite({
      textureName: borderTextureName,
      anchor: { x: 0.5, y: 0 },
    });
    const marginTopForSlots =
      ScreenVersion.DESKTOP === screenVersion ? slotsFieldSprite.height * 0.039 : 24;

    this.reelsContainer.x = -slotsFieldW / 2;
    this.reelsContainer.y = (screenVersion === ScreenVersion.DESKTOP)
      ? marginTopForSlots + slotsFieldH - fillGap
      : marginTopForSlots + slotsFieldH;


    for (let i = 0; i < TOTAL_REELS; i++) {
      const reel = new Reel({
        screenVersion,
        resources: resources as ResourceState,
        slotsOrder: this.manager.state.gameState.gameTable[i],
        manager,
        renderer,
      });

      reel.x = (slotsFieldW / TOTAL_REELS) * i;
      this.reels.push(reel);
      this.reelsContainer.sortableChildren = true;
      this.reelsContainer.addChild(reel);
    }

    const reelsContainerMask = createSprite({
      emptyTexture: true,
      sizes: {
        w: slotsFieldW,
        h: slotsFieldH,
      },
      anchor: { x: 0, y: 0 },
      position: { x: 0, y: -slotsFieldH - 2 },
    });

    this.reelsContainer.mask = reelsContainerMask;
    this.reelsContainer.addChild(reelsContainerMask);

    this.burstedSlots = new BurstedSlots({
      slotSize: { w: this.columnW, h: this.rowH },
      reels: this.reels,
    });

    this.multiplayers = new CombinationMultiplier({
      slotSize: { w: this.columnW, h: this.rowH },
      manager,
      screenVersion,
      reels: this.reels,
      burstedSlots: this.burstedSlots
    });

    this.multiplayers.x = -slotsFieldW / 2;
    this.multiplayers.y = marginTopForSlots + slotsFieldH;



    this.burstedSlots.x = -slotsFieldW / 2;
    this.burstedSlots.y = marginTopForSlots + slotsFieldH;

    this.addChild(slotsFieldSprite, this.reelsContainer, this.burstedSlots, this.multiplayers);
  }

  moveSlots = ({
    startRange,
    endRange,
    reelIndex,
    movePositionY,
    movePositionX,
    isSpinTween,
    time,
    easing = getPowIn(1.7),
    delay,
    spawnedMargin,
  }: MoveSlotsType) => {
    this.spinTweens.length = 0;
    this.spawnedMargin = spawnedMargin || 0;

    return new Promise((resolve) => {
      this.resolve = resolve;
      let finishedAnimationCount = 0;

      for (let i = 0; i < this.reels.length; i++) {
        if (!reelIndex.includes(i)) {
          continue;
        }

        let newDelay = 50 * i;
        if (delay && isSpinTween) {
          newDelay += delay;
        } else {
          if (delay) newDelay = delay;
        }

        const reel = this.reels[i];
        reel.staticSpawnedMargin = spawnedMargin || 0;

        const durationTween = time || 600;
        const postion = { slotPositionY: 0, slotPositionX: 0, spawnedMargin: 0 };

        const spinTween = new Tween(postion)
          .to(
            {
              slotPositionY: -movePositionY,
              slotPositionX: -(movePositionX || 0),
              betweenDistance: -this.rowH * 10,
              spawnedMargin,
            },
            durationTween
          )
          .delay(newDelay)
          .onUpdate(({ slotPositionY, slotPositionX, spawnedMargin }) => {
            reel.update({
              startRange,
              endRange,
              slotPositionY,
              slotPositionX,
              spawnedMargin,
            });
          })
          .easing(easing)
          // eslint-disable-next-line no-loop-func
          .onComplete((reel) => {
            finishedAnimationCount += 1;
            if (finishedAnimationCount === reelIndex.length) {
              resolve(true);
            }
          });

        spinTween.start();
        this.spinTweens.push(spinTween);
      }
    });
  };

  speedUp = async () => {
    if (!this.reelsRunning || this.isSpeedUp) return;
    this.isSpeedUp = true;
    let delayIndex = 0;
    await Promise.all(
      this.spinTweens.map(async (tween, i) => {
        let promise;
        tween.pause();
        tween
          .onStop((obj) => {
            promise = this.handleReelSpeedUp(obj, i, delayIndex);
            delayIndex += 1;
          })
          .stop();
        remove(tween);
        return promise;
      })
    );
    this.resolve(true);
    this.isSpeedUp = false;
  };

  private handleReelSpeedUp(obj: PositionObjectType, i: number, delayIndex: number) {
    const reel = this.reels[i];
    const addTime = delayIndex * 25;
    const duration = 35;
    const target = -8;

    const newTime = -(target - obj.slotPositionY) * duration;
    return new Promise((resolve) => {
      const spinTween = new Tween(obj)
        .to(
          {
            slotPositionY: target,
            slotPositionX: 0,
            betweenDistance: -this.rowH * 10,
            spawnedMargin: this.spawnedMargin,
          },
          newTime + addTime
        )
        .delay(0)
        .onUpdate(({ slotPositionY, spawnedMargin }) => {
          reel.update({
            startRange: 0,
            endRange: 15,
            slotPositionY,
            slotPositionX: 0,
            spawnedMargin,
          });
        })

        .onComplete(() => {
          resolve(true);
          remove(spinTween);
        });
      spinTween.start();
    });
  }

  destroy = () => {
    this.controller.destroy();
  };
}
