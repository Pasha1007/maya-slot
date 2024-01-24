import { SlotKeys, SpineNames } from "./constants";

type SlotConfigVersionType = {
  slotSize: number;
  spineSize: number;
  offsetY: number;
  offsetX: number;
};

export type SlotsConfigType = {
  key: SlotKeys;
  borderColor?: number;
  name: SpineNames;
  mobile: SlotConfigVersionType;
  desktop: SlotConfigVersionType;
};

export const slotsSizes = {
  mobile: 78,
  desktop: 10,
} as const;

const desctopSpineSize = 120;
const mobileSpineSize = 80;

export const slotsConfig: SlotsConfigType[] = [
  {
    name: SpineNames.ANUBIS,
    key: SlotKeys.ANUBIS,
    borderColor: 0x22eaa0,
    mobile: {
      slotSize: slotsSizes.mobile,
      spineSize: mobileSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
    desktop: {
      slotSize: slotsSizes.desktop,
      spineSize: desctopSpineSize + 20,
      offsetY: 0,
      offsetX: 0,
    },
  },
  {
    name: SpineNames.EYE,
    key: SlotKeys.EYE,
    borderColor: 0xffffff,
    mobile: {
      slotSize: slotsSizes.mobile,
      spineSize: mobileSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
    desktop: {
      slotSize: slotsSizes.desktop,
      spineSize: desctopSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
  },
  {
    name: SpineNames.PHARAOH,
    key: SlotKeys.PHARAOH,
    mobile: {
      slotSize: slotsSizes.mobile,
      spineSize: mobileSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
    desktop: {
      slotSize: slotsSizes.desktop,
      spineSize: desctopSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
  },
  {
    name: SpineNames.PYRAMIDS,
    key: SlotKeys.PYRAMIDS,
    borderColor: 0xffffff,
    mobile: {
      slotSize: slotsSizes.mobile,
      spineSize: mobileSpineSize + 5,
      offsetY: 0,
      offsetX: 0,
    },
    desktop: {
      slotSize: slotsSizes.desktop,
      spineSize: desctopSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
  },
  {
    name: SpineNames.SCORPION,
    key: SlotKeys.SCORPION,
    borderColor: 0xa5a6a8,
    mobile: {
      slotSize: slotsSizes.mobile,
      spineSize: mobileSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
    desktop: {
      slotSize: slotsSizes.desktop,
      spineSize: desctopSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
  },
  {
    name: SpineNames.THOTH,
    key: SlotKeys.THOTH,
    mobile: {
      slotSize: slotsSizes.mobile,
      spineSize: mobileSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
    desktop: {
      slotSize: slotsSizes.desktop,
      spineSize: desctopSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
  },
  {
    name: SpineNames.TOMB,
    key: SlotKeys.TOMB,
    borderColor: 0xa5a6a8,
    mobile: {
      slotSize: slotsSizes.mobile,
      spineSize: mobileSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
    desktop: {
      slotSize: slotsSizes.desktop,
      spineSize: desctopSpineSize - 10,
      offsetY: 0,
      offsetX: 0,
    },
  },
  {
    name: SpineNames.TOPAZ,
    key: SlotKeys.TOPAZ,
    borderColor: 0x4deb76,
    mobile: {
      slotSize: slotsSizes.mobile,
      spineSize: mobileSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
    desktop: {
      slotSize: slotsSizes.desktop,
      spineSize: desctopSpineSize,
      offsetY: 0,
      offsetX: 0,
    },
  },
  {
    name: SpineNames.WILD,
    key: SlotKeys.WILD,
    mobile: {
      slotSize: slotsSizes.mobile,
      spineSize: 115,
      offsetY: 9,
      offsetX: 0,
    },
    desktop: {
      slotSize: slotsSizes.desktop,
      spineSize: 150,
      offsetY: 15,
      offsetX: 0,
    },
  },
];

const keys = slotsConfig.map((elem) => elem.key);
export const slotsKeys = [...keys.filter((key) => key !== SlotKeys.WILD)];
