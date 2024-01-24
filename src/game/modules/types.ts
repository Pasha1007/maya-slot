import { LoaderResource } from "pixi.js-legacy";
import { assetsMap } from "../assetsMap";
import { loaderResources } from "./App/Loader/config";

export enum ScreenVersion {
  MOBILE = "mobile",
  DESKTOP = "desktop",
}

export type ResourceNames =
  | typeof assetsMap.desktop[any]["name"]
  | typeof assetsMap.mobile[any]["name"]
  | typeof assetsMap.common[any]["name"]
  | typeof assetsMap.spines[any]["name"]
  | typeof loaderResources[any]["name"];



export type Position = {
  x: number;
  y: number;
};

export type SizesType = {w: number, h: number}


export type ResourceState = {
  [key in ResourceNames]?: LoaderResource;
};

export interface MainState {
  resources: ResourceState;
}

export type WinsType = "win" | "bigWin" | "epicWin" ;
