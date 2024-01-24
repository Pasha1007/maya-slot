import { Container, Renderer } from "pixi.js-legacy";
import { ResourceState, ScreenVersion } from "../../../../types";
import { Slot } from "./SlotPool/Slot";
import { SlotKeys } from "./SlotPool/Slot/constants";
import { SlotsConfigType, slotsConfig } from "./SlotPool/Slot/config";
import { MayaManager } from "../../../../manager";
import { SortedSlotsType } from "../controller";
import { TOTAL_ROWS } from "../../../../constants";
import { SlotPool } from "./SlotPool";

type UpdateSlotType = {
  startRange: number;
  endRange: number;
  slotPositionY: number;
  slotPositionX: number;
  keepWild?: boolean;
  spawnedMargin: number;
};

type ReelType = {
  screenVersion: ScreenVersion;
  slotsOrder: SlotKeys[];
  resources: ResourceState;
  manager: MayaManager;
  renderer: Renderer
};

export class Reel extends Container {
  private manager: MayaManager;
  private screenVersion: ScreenVersion;
  private resources: ResourceState;
  private renderer: Renderer
  private slotPool: SlotPool
  public slotsOrder: SlotKeys[];
  public slots: Slot[] = [];
  public slotH!: number;
  public slotW!: number;
  public slotPositionY: number = 0;
  public slotPositionX: number = 1;
  public betweenDistance: number = 0;
  public staticSpawnedMargin = 0;

  constructor({ resources, screenVersion, slotsOrder, manager, renderer }: ReelType) {
    super();
    this.sortableChildren = true;
    this.manager = manager;
    this.screenVersion = screenVersion;
    this.resources = resources;
    this.slotsOrder = slotsOrder;
    this.renderer = renderer
    this.slotPool = new SlotPool({ resources, screenVersion, renderer });
    this.buildReel(this.slotsOrder, []);
  }

  update = ({
    startRange,
    endRange,
    slotPositionY,
    slotPositionX,
    spawnedMargin,
  }: UpdateSlotType) => {
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i] as Slot;
      if (i >= startRange && i <= endRange && !slot.isHold) {
        slot.x = slotPositionX * -this.slotW;

        if (i <= TOTAL_ROWS - 1) {
          slot.y = (slotPositionY + i) * -this.slotH + spawnedMargin;
        } else {
          slot.y = (slotPositionY + i) * -this.slotH - this.staticSpawnedMargin + spawnedMargin;
        }
      }
    }
  };

  setWildSlotHold = (isHold: boolean) => {
    this.slots.forEach((slot) => {
      if (slot.slotKey === SlotKeys.WILD) {
        slot.isHold = isHold;
      }
    });
  };

  async buildReel(orderSlots: SlotKeys[], destroyedElements: number[]) {
    this.slotsOrder = orderSlots;
    const promises: Promise<unknown>[] = [];

    if (this.children.length) {
      this.buildSpawnedSlots(orderSlots);
    } else {
      await this.buildAllSlots(orderSlots);
    }

    await Promise.all(promises);
  }

  updateSlotsOrder(currentOrderConfig: SortedSlotsType[], reelIndex: number) {
    const updatedSlotsOrder = currentOrderConfig.map((slotConfig, i) => {
      if (this.slots[i].id === slotConfig.id) {
        return this.slots[i];
      } else {
        return this.findSlotById(slotConfig.id);
      }
    });
    const spawnedSymbols = this.slots.slice(TOTAL_ROWS);
    const current = updatedSlotsOrder.slice(0, TOTAL_ROWS);

    spawnedSymbols.forEach((slot, i) => {
      const indexToReplace = current.length - spawnedSymbols.length + i;
      if (!slot.isEmpty) {
        current[indexToReplace] = slot;
      }
    });

    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      if (slot.isDestroyed || slot.isEmpty) {
        this.removeChild(slot);
      }
    }

    this.slots = current;

    this.updateGameTable(reelIndex, current);
  }

  removeChildrenInRange(startRange: number, endRange: number, reelIndex: number) {
    for (let i = startRange; i <= endRange; i++) {
      const slot = this.slots[i];
      if (slot && !slot.isHold) {
        this.removeChild(slot);
        this.slotPool.returnSlot(slot)
      }
    }

    this.slots = this.slots.filter(
      (slot, i) => !(i >= startRange && i <= endRange && slot && !slot.isHold)
    );

    const table = this.slots.map((slot) => slot.slotKey);
    this.manager.state.gameState.gameTable[reelIndex] = table;
  }

  replaceSlotByIndex(cellIndex: number, key: SlotKeys, wildMult: number) {
    if (cellIndex < 0 || cellIndex >= this.slots.length) {
      return;
    }

    const slotConfig = slotsConfig.find((elem) => elem.key === key) as SlotsConfigType;

    const newSlot = new Slot({
      resources: this.resources,
      screenVersion: this.screenVersion,
      slotConfig,
      renderer: this.renderer
    });

    newSlot.y = cellIndex * -this.slotH;
    newSlot.wildMultiplier?.setWildMultiplier(wildMult);
    newSlot.staticWildMultiplier?.setWildMultiplier(wildMult);

    this.slots[cellIndex].destroy();
    this.removeChild(this.slots[cellIndex]);
    this.slots[cellIndex] = newSlot;
    this.addChildAt(newSlot, cellIndex);
    const table = this.slots.map((slot) => slot.slotKey);
    this.manager.state.gameState.gameTable[cellIndex] = table;
  }

  private addSlot(index: number, slotKey: SlotKeys) {
    const slot = this.slotPool.getSlot(slotKey)
    this.slotH = slot.slotH;
    this.slotW = slot.slotW;
    this.slots.push(slot);

    if (index <= TOTAL_ROWS - 1) {
      slot.y = index * -this.slotH;
    } else {
      slot.y = index * -this.slotH - this.staticSpawnedMargin;
    }

    this.addChild(slot);
  }

  mergeSlotsForFreeGame = (reelIndex: number) => {
    const spawned_symbols = this.slots.slice(-TOTAL_ROWS);

    const newSlotsOrder = spawned_symbols.map((spawnedSlot, i) => {
      if (!spawnedSlot.isEmpty) {
        return spawnedSlot;
      } else {
        this.removeChild(spawnedSlot);

        const slot = this.slots[0];
        this.slots.splice(0, 1);

        return slot;
      }
    });

    this.slots = newSlotsOrder;
    this.updateGameTable(reelIndex, newSlotsOrder);
  };

  private async buildSpawnedSlots(orderSlots: SlotKeys[]) {
    for (let i = 0; i < orderSlots.length; i++) {
      if (i >= this.children.length) {
        const slotKey = orderSlots[i]
        this.addSlot(i, slotKey);
      }
    }
  }

  private async buildAllSlots(orderSlots: SlotKeys[]) {
    for (let i = 0; i < orderSlots.length; i++) {
      const slotKey = orderSlots[i]
      this.addSlot(i, slotKey);
    }
  }

  private findSlotById(id: string): Slot {
    return this.slots.find((slot) => slot.id === id) as Slot;
  }

  private updateGameTable(reelIndex: number, updatedSlots: Slot[]) {
    const table = updatedSlots.map((slot) => slot.slotKey);
    this.manager.state.gameState.gameTable[reelIndex] = table;
  }
}
