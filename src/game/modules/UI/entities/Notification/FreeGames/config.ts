import { screenSizes } from "../../../../constants";

export type FreeGamesBookConfigType = {
  offsetX: number;
  offsetY: number;
  size: number;
};

type FreeGamesConfigVersionType = {
  mobile: FreeGamesBookConfigType;
  desktop: FreeGamesBookConfigType;
};

export const config: FreeGamesConfigVersionType = {
  mobile: {
    offsetX: 0,
    offsetY: 750,
    size: screenSizes.mobile.width * 0.95,
  },
  desktop: {
    offsetX: 0,
    offsetY: 940,
    size: screenSizes.desktop.width * 0.55,
  },
};
