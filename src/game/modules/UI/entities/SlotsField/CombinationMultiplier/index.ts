import { Container, Text } from "pixi.js-legacy";
import { Easing, Tween, remove } from "@tweenjs/tween.js";
import { theme } from "../../../style";
import { ClusterCombinations } from "../../../../manager/type";
import { convertStringToCoordinations } from "../../../../manager/utils/convertStringToObject";
import { TOTAL_REELS } from "../../../../constants";
import { MayaManager } from "../../../../manager";
import { formatNumber } from "../../../../../utils/formatNumber";
import { ScreenVersion } from "../../../../types";
import { getWildMultAmount } from "./utils.ts/getWildMultAmount";
import { hasWild } from "./utils.ts/divideAllComb";
import { Reel } from "../Reel";
import { BurstedSlots } from "../BurstedSlots";

type WildsType = {
  pos: string;
  mult: number;
};

type CombinationMultiplierType = {
  slotSize: { w: number; h: number };
  manager: MayaManager;
  screenVersion: ScreenVersion;
  reels: Reel[];
  burstedSlots: BurstedSlots;
};

export class CombinationMultiplier extends Container {
  private slotSize: { w: number; h: number };
  private manager: MayaManager;
  private screenVersion: ScreenVersion;
  private moveTween!: Tween<{ x: number; y: number }>;
  private burstedSlots: BurstedSlots;
  private reels: Reel[];

  constructor({
    slotSize,
    manager,
    screenVersion,
    reels,
    burstedSlots,
  }: CombinationMultiplierType) {
    super();
    this.screenVersion = screenVersion;
    this.slotSize = slotSize;
    this.manager = manager;
    this.reels = reels;
    this.burstedSlots = burstedSlots;
  }

  private createMultiplayer = (multiplayer: string) => {
    const fontSize = ScreenVersion.MOBILE === this.screenVersion ? 25 : 45;

    const multiplayerText = new Text(multiplayer, {
      fontFamily: theme.fontFamily.primary,
      fontSize,
      fontWeight: "700",
      stroke: theme.color.gold,
      strokeThickness: 5,
      fill: theme.color.white,
    });
    multiplayerText.anchor.set(0, 0.5);

    return multiplayerText;
  };

  showMultiplier = async (
    allCombinations: ClusterCombinations[],
    setDimming: (dim: boolean) => void
  ) => {
    const { totalBetForFetch } = this.manager.state.gameState;
    if (this.children.length) this.removeChildren();

    const showCombination = async (combination: ClusterCombinations, i: number) => {
      const { elements, wild_mults, symbol_mult } = combination;
      const startWinAmount = Number(symbol_mult) * totalBetForFetch;

      const multiplayer = this.createMultiplayer(formatNumber(startWinAmount, 8));
      multiplayer.alpha = 0;
      multiplayer.pivot.x = multiplayer.width / 2;
      const middleIndex = Math.floor(elements.length / 2);
      const { c, r } = convertStringToCoordinations(elements[middleIndex]);
      const { w, h } = this.slotSize;

      const coordinationX = r * w + (w - multiplayer.width) / 2 + multiplayer.width / 2;
      const coordinationY = (c + 0.5) * h;

      let additionalRightOffsetX = coordinationX + multiplayer.width / 2 - w * TOTAL_REELS;
      let additionalLeftOffsetX =
        multiplayer.width > coordinationX ? multiplayer.width / 2 - coordinationX : 0;

      multiplayer.y = -coordinationY;
      multiplayer.x = coordinationX - Math.max(0, additionalRightOffsetX) + additionalLeftOffsetX;
      const target = -coordinationY - h / 2;
      this.addChild(multiplayer);

      const wildMultAmount = getWildMultAmount(combination);
      await this.animateMultiplayer(multiplayer, target, wild_mults, wildMultAmount, i);
    };

    const hasWildComb = hasWild(allCombinations);

    if (hasWildComb) {
      for (let i = 0; i < allCombinations.length; i++) {
        const burstDelay = i === 0 ? 1300 : 700;
        this.burstedSlots.showBurstedElemens(allCombinations[i], burstDelay);

        const resumeDelay = i === 0 ? 900 : 0;
        this.resumeSlotAnimation(allCombinations[i], resumeDelay);

        await showCombination(allCombinations[i], i);
      }
    } else {
      await Promise.all(allCombinations.map((comb, i) => showCombination(comb, i)));
    }

    if (hasWildComb) setDimming(false);
  };

  private animateMultiplayer = async (
    multiplayer: Text,
    target: number,
    wilds: WildsType[],
    wildMultAmount: number,
    i: number
  ) => {
    let delay = 1000;

    if (wildMultAmount !== 0 && i !== 0) delay /= 2;

    return new Promise(async (resolve) => {
      if (wildMultAmount === 0) {
        const time = 1100;
        this.startAppearTween(multiplayer, delay);
        const moveTween = this.startMoveTween(multiplayer, target, time, delay, () => {
          remove(moveTween);
          resolve(true);
        });
      } else {
        const increaseTime = 350;
        const increaseDelay = 800;
        const time = 900 + increaseTime * wildMultAmount + increaseDelay * wildMultAmount;

        for (let i = 0; i < wilds.length; i++) {
          const wild = wilds[i];

          if (i === 0) {
            this.startAppearTween(multiplayer, delay);
            const moveTween = this.startMoveTween(multiplayer, target, time, delay, () => {
              remove(moveTween);
              resolve(true);
            });
          }

          const newDelay = increaseDelay + (i === 0 ? delay : 0);
          this.moveWildMult(wild, multiplayer, newDelay);
          await this.createIncreaseTween(multiplayer, wild.mult, newDelay, increaseTime);
        }
      }
    });
  };

  private createIncreaseTween = async (
    multiplayer: Text,
    wildMult: number,
    delay: number,
    time: number
  ) => {
    const startValue = Number(multiplayer.text);
    const endValue = startValue * wildMult;
    const scaleSize = multiplayer.scale.x;

    return new Promise((resolve) => {
      const increaseTween = new Tween({ progress: 0, scale: scaleSize })
        .to({ progress: 1, scale: scaleSize + 0.3 }, time)
        .onUpdate(({ progress, scale }) => {
          multiplayer.text = (Number(startValue) + (endValue - startValue) * progress).toFixed(2);
          multiplayer.scale.set(scale);
        })
        .onComplete(() => {
          resolve(true);
          remove(increaseTween);
        })
        .delay(delay)
        .start();
    });
  };

  private startMoveTween = (
    multiplayer: Text,
    target: number,
    time: number,
    delay?: number,
    onComplete?: () => void
  ) => {
    const moveTween = new Tween(multiplayer.position)
      .to({ y: target }, time)
      .delay(delay || 0)
      .start()
      .onComplete(() => {
        onComplete && onComplete();
        const desapperTween = new Tween(multiplayer)
          .to({ alpha: 0, scale: { x: 0.85, y: 0.85 } }, 250)
          .start()
          .delay(350)
          .onComplete(() => {
            remove(desapperTween);
          });
        remove(moveTween);
      });

    return moveTween;
  };

  private startAppearTween = (multiplayer: Text, delay: number) => {
    const appearTween = new Tween(multiplayer)
      .to({ alpha: 1 }, 250)
      .delay(delay)
      .start()
      .onComplete(() => {
        remove(appearTween);
      });
  };

  private resumeSlotAnimation = (comb: ClusterCombinations, delay: number) => {
    const { elements } = comb;

    const coordinations = elements.map((str) => convertStringToCoordinations(str));
    setTimeout(() => {
      coordinations.forEach((coordination) => {
        const { r, c } = coordination;
        const reel = this.reels[r];
        const slot = reel.slots[c];

        slot.spineSlot.pauseAnimation(false);
      });
    }, delay);
  };

  private moveWildMult = (wild: WildsType, multiplayer: Text, delay: number) => {
    const { r, c } = convertStringToCoordinations(wild.pos);
    const wildSlot = this.reels[r].slots[c];
    const reel = this.reels[r];
    reel.zIndex = 10;
    wildSlot.zIndex = 10;

    if (wildSlot.wildMultiplier) {
      const { x, y } = wildSlot.wildMultiplier.position;

      const currentWildMultPosX = r * wildSlot.slotW;
      const currentWildMultPosY = c * wildSlot.slotH;

      const multiplayerPosX = multiplayer.x;
      const multiplayerPosY = multiplayer.y;

      const targetX = multiplayerPosX - currentWildMultPosX;
      const targetY = multiplayerPosY + currentWildMultPosY + wildSlot.slotH / 2;

      const moveTween = new Tween(wildSlot.wildMultiplier)
        .to({ position: { x: targetX, y: targetY }, scale: { x: 2.2, y: 2.2 } }, 200)
        .delay(delay)
        .start()
        .onComplete(() => {
          if (wildSlot.wildMultiplier) {
            wildSlot.wildMultiplier.x = x;
            wildSlot.wildMultiplier.y = y;
            wildSlot.wildMultiplier.scale.set(1);
          }
          reel.zIndex = 0;
          wildSlot.zIndex = 0;

          remove(moveTween);
        });
    }
  };
}
