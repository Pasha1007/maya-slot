import { Renderer } from "pixi.js-legacy";
import { ResourceState, ScreenVersion } from "../../../../../types";
import { Slot } from "./Slot";
import { slotsConfig } from "./Slot/config";
import { SlotKeys } from "./Slot/constants";

type SlotPoolType = {
  resources: ResourceState;
  screenVersion: ScreenVersion;
  renderer: Renderer;
};

export class SlotPool {
  private resources: ResourceState;
  private screenVersion: ScreenVersion;
  private renderer: Renderer;
  private slotPool: { [key: string]: Slot[] } = {};

  constructor({ resources, screenVersion, renderer }: SlotPoolType) {
    this.resources = resources;
    this.screenVersion = screenVersion;
    this.renderer = renderer;
    this.slotPool = this.createSlotPool();
  }

  createSlotPool() {
    const slotPool: { [key in SlotKeys]?: Slot[] } = {};

    for (const slotConfig of slotsConfig) {
      const slots: Slot[] = [];
      if (!(slotConfig.key in slotPool)) {
        const slotKey = slotConfig.key;

        for (let i = 0; i < 8; i++) {
          const slot = new Slot({
            resources: this.resources,
            screenVersion: this.screenVersion,
            slotConfig: slotConfig,
            renderer: this.renderer,
          });
          slots.push(slot);
        }

        slotPool[slotKey] = slots;
      }
    }

    return slotPool;
  }

  getSlot = (slotKey: SlotKeys) => {
    if (!this.slotPool[slotKey]) {
      this.slotPool[slotKey] = [];
    }

    const slot = this.slotPool[slotKey].pop();

    if (slot) {
      return slot;
    } else {
      const slotConfig = slotsConfig.find((elem) => elem.key === slotKey);
      return new Slot({
        resources: this.resources,
        screenVersion: this.screenVersion,
        slotConfig: slotConfig || "EMPTY",
        renderer: this.renderer,
      });
    }
  };

  returnSlot(slot: Slot) {
    let slotsArr = this.slotPool[slot.slotKey];
    if (!slotsArr) {
      slotsArr = [];
    }

    if (slotsArr.length <= 8) {
      this.slotPool[slot.slotKey].push(slot);
    } else {
      slot.destroy();
    }
  }
}
