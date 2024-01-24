import { SlotKeys } from "../../UI/entities/SlotsField/Reel/SlotPool/Slot/constants";

export const CHANGE_STATE = "CHANGE_STATE",
  CREATED_UI = "CREATED_UI",
  SET_TOTAL_BET = "SET_TOTAL_BET",
  SET_AUTO_MODE = "SET_AUTO_MODE",
  CHANGE_GAME_TABLE = "CHANGE_GAME_TABLE",
  PLAY_EVENT = "PLAY_EVENT",
  SET_FREE_GAME = "SET_FREE_GAME",
  CHANGE_FREE_GAMES = "CHANGE_FREE_GAMES",
  SET_ACTIVE_MODAL_TAB = "SET_ACTIVE_MODAL_TAB",
  SET_MODAL_VIVSIBLE = "SET_MODAL_VIVSIBLE",
  SHOW_NOTIFICATION = "SHOW_NOTIFICATION",
  SET_SPINING = "SET_SPINING",
  CLUSTER_FINISHED = "CLUSTER_FINISHED",
  SET_CURRENCY = "SET_CURRENCY",
  SPINING_SPEED_UP = "SPINING_SPEED_UP",
  SET_RUN_STEPS = "SET_RUN_STEPS",
  SET_BALANCE = "SET_BALANCE",
  RUN_AUTO_SPIN = "RUN_AUTO_SPIN",
  SET_RUN_ROTATE = "SET_RUN_ROTATE",
  SET_AUTOPLAY_SETTINGS = "SET_AUTOPLAY_SETTINGS";


export type FreeGamesType = { isFreeGame: boolean; amount?: number; numberOfSpin?: number };

export type SetGameTableType = {
  gameTable: SlotKeys[][];
  destroyedElements?: string[];
}
