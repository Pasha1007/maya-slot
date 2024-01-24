import { ScreenVersion } from "../../types";

export type ConfigType = {
  progressBarW: number;
  progressBarH: number;
  basilisklAnimationSize: number;
  basilisklAnimationOffsetY: number;
  basilisklAnimationOffsetX: number;
  progressBarOffsetY: number;
};

type ConfingsType = {
  [ScreenVersion.MOBILE]: ConfigType;
  [ScreenVersion.DESKTOP]: ConfigType;
};

export const configs: ConfingsType = {
  mobile: {
    progressBarW: 495,
    progressBarH: 10,
    basilisklAnimationSize: 500,
    basilisklAnimationOffsetY: 600,
    basilisklAnimationOffsetX: 12,
    progressBarOffsetY: 490,
  },
  desktop: {
    progressBarW: 1480,
    progressBarH: 15,
    basilisklAnimationSize: 1500,
    basilisklAnimationOffsetY: 700,
    basilisklAnimationOffsetX: 35,
    progressBarOffsetY: 425,
  },
};
const baseSpine = "./assets/notification";

export const loaderResources = [
  { name: "loader", url: `${baseSpine}/loader/Basilisk Gaming.json` },
];

