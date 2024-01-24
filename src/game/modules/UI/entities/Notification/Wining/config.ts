import { Position, WinsType } from "../../../../types";

export type WinAmountConfigType = {
  start: number;
  finish: number;
  animationDelay: number;
  moveTweenDuration: number;
  startScale?: number;
  fontSize?: number;
};

type ScreenVersionConfigType = {
  size: number;
  position: Position;
  winAmount: WinAmountConfigType;
};

type ConfigType = {
  animationType: WinsType;
  animationName: string;
  mobile: ScreenVersionConfigType;
  desktop: ScreenVersionConfigType;
};

export const winingConfigs: ConfigType[] = [
  {
    animationName: "animation",
    animationType: "win",
    desktop: {
      position: { x: 0, y: 900 },
      size: 1700,
      winAmount: {
        finish: 328,
        start: 270,
        fontSize: 54,
        startScale: 0,
        animationDelay: 1550,
        moveTweenDuration: 200,
      },
    },
    mobile: {
      position: { x: 0, y: 600 },
      size: 800,
      winAmount: {
        finish: 330,
        start: 300,
        fontSize: 32,
        startScale: 0,
        animationDelay: 1550,
        moveTweenDuration: 200,
      },
    },
  },
  {
    animationName: "animation",
    animationType: "bigWin",
    desktop: {
      position: { x: 0, y: 900 },
      size: 1700,
      winAmount: {
        finish: 245,
        start: 167,
        fontSize: 54,
        startScale: 0.5,
        animationDelay: 1850,
        moveTweenDuration: 200,
      },
    },
    mobile: {
      position: { x: 0, y: 650 },
      size: 800,
      winAmount: {
        finish: 342,
        start: 225,
        fontSize: 32,
        startScale: 0.5,
        animationDelay: 1850,
        moveTweenDuration: 200,
      },
    },
  },
  {
    animationName: "animation",
    animationType: "epicWin",
    desktop: {
      position: { x: 0, y: 900 },
      size: 1700,
      winAmount: {
        finish: 208,
        start: 130,
        fontSize: 54,
        startScale: 0.5,
        animationDelay: 1850,
        moveTweenDuration: 200,
      },
    },
    mobile: {
      position: { x: 0, y: 650 },
      size: 800,
      winAmount: {
        finish: 323,
        start: 202,
        fontSize: 32,
        startScale: 0.5,
        animationDelay: 1850,
        moveTweenDuration: 200,
      },
    },
  },
];
