import { SlotKeys } from "../../UI/entities/SlotsField/Reel/SlotPool/Slot/constants";

export const shuffleSlotKeys = (arr: SlotKeys[]): SlotKeys[] =>
  [...arr].sort(() => Math.random() - 0.5);
