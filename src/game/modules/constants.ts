import { ScreenVersion } from "./types";

export const screenSizes = {
  [ScreenVersion.MOBILE]: {
    width: 640,
    height: 1150,
    breakpoint: 480,
  },
  [ScreenVersion.DESKTOP]: {
    width: 1920,
    height: 1080,
    breakpoint: 1920,
  },
};

export const TOTAL_REELS = 8;
export const TOTAL_ROWS = 8;

export const slotsFieldSizes = {
  desktop: {
    w: 900,
    h: 890,
  },
  mobile: {
    w: 620,
    h: 600,
  },
};
