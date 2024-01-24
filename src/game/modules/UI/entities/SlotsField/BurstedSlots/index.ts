import { Container } from "pixi.js-legacy";
import { ClusterCombinations, CoordinationsType } from "../../../../manager/type";
import { convertStringToCoordinations } from "../../../../manager/utils/convertStringToObject";
import { createSprite } from "../../../../../utils/createSprite";
import { Tween, remove } from "@tweenjs/tween.js";
import { Reel } from "../Reel";
import { sleep } from "../../../../../utils/sleep";
import { getRandomNumberInRange } from "../../../../../utils/randomNumber";

const BURST_ELEM_TOTAL = 3;

type BurstedSlotsType = {
  slotSize: { w: number; h: number };
  reels: Reel[];
};

export class BurstedSlots extends Container {
  private slotSize: { w: number; h: number };
  private reels: Reel[];

  constructor({ slotSize, reels }: BurstedSlotsType) {
    super();
    this.slotSize = slotSize;
    this.reels = reels;
  }

  showBurstedElemens = (comb: ClusterCombinations, delay: number) => {
    if (!!comb.wild_mults.length) {
      const wildPosStr = comb.wild_mults.map((wild) => wild.pos);
      const wildPosComb = wildPosStr.map((str) => convertStringToCoordinations(str));

      wildPosComb.forEach(async (wildComb) => {
        comb.elements.forEach((coordinationStr) => {
          const combCoordinations = convertStringToCoordinations(coordinationStr);
          if (!wildPosStr.includes(coordinationStr)) {
            for (let index = 0; index < BURST_ELEM_TOTAL; index++) {
              this.createBurstElem(combCoordinations, wildComb, delay);
            }
          }
        });
      });
    }
  };

  private createBurstElem = (
    coordination: CoordinationsType,
    wildComb: CoordinationsType,
    delay: number
  ) => {
    const spriteSize = this.slotSize.w / 8;
    const { r, c } = coordination;

    const sprite = createSprite({
      textureName: "slotParticle",
      size: spriteSize,
    });
    sprite.visible = false;

    const randomDistance = getRandomNumberInRange(this.slotSize.w / 2 - spriteSize);

    sprite.x = r * this.slotSize.w + this.slotSize.w / 2 + randomDistance;
    sprite.y = -c * this.slotSize.h - this.slotSize.h / 2 + randomDistance;

    this.addChild(sprite);

    this.animateBurstElem(sprite, wildComb, delay);
  };

  private animateBurstElem = (elem: Container, wildComb: CoordinationsType, delay: number) => {
    const { r, c } = wildComb;

    const targetX = r * this.slotSize.w + this.slotSize.w / 2;
    const targetY = -c * this.slotSize.h - this.slotSize.h / 2;

    const moveTween = new Tween(elem)
      .to({ x: targetX, y: targetY }, 350)
      .delay(delay)
      .onStart((obj) => {
        obj.visible = true;
      })
      .onComplete((obj) => {
        obj.visible = false;
        this.removeChildren();
        remove(moveTween);
      })
      .start();
  };
}
