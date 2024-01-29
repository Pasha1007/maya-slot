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
      position: { x: 0, y: 450 },
      size: 800,
      winAmount: {
        finish: 758,
        start: 700,
        fontSize: 54,
        startScale: 0,
        animationDelay: 1550,
        moveTweenDuration: 200,
      },
    },
    mobile: {
      position: { x: 0, y: 400 },
      size: 500,
      winAmount: {
        finish: 590,
        start: 560,
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
      position: { x: 0, y: 420 },
      size: 900,
      winAmount: {
        finish: 828,
        start: 770,
        fontSize: 54,
        startScale: 0.5,
        animationDelay: 1850,
        moveTweenDuration: 200,
      },
    },
    mobile: {
      position: { x: 0, y: 400 },
      size: 700,
      winAmount: {
        finish: 710,
        start: 680,
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
      position: { x: 0, y: 420 },
      size: 900,
      winAmount: {
        finish: 828,
        start: 770,
        fontSize: 54,
        startScale: 0.5,
        animationDelay: 1850,
        moveTweenDuration: 200,
      },
    },
    mobile: {
      position: { x: 0, y: 400 },
      size: 620,
      winAmount: {
        finish: 680,
        start: 650,
        fontSize: 32,
        startScale: 0.5,
        animationDelay: 1850,
        moveTweenDuration: 200,
      },
    },
  },
];
