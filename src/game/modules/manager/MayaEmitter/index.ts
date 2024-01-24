import EventEmitter from "events";
import {
  CREATED_UI,
  SET_TOTAL_BET,
  CHANGE_GAME_TABLE,
  SET_AUTO_MODE,
  PLAY_EVENT,
  SET_FREE_GAME,
  SHOW_NOTIFICATION,
  SET_ACTIVE_MODAL_TAB,
  SET_MODAL_VIVSIBLE,
  FreeGamesType,
  SET_SPINING,
  CLUSTER_FINISHED,
  SET_BALANCE,
  SET_CURRENCY,
  SPINING_SPEED_UP,
  SET_RUN_STEPS,
  SET_AUTOPLAY_SETTINGS,
  RUN_AUTO_SPIN,
  SET_RUN_ROTATE,
  SetGameTableType,
} from "./config";
import { MayaManager } from "..";
import { mergeArrays } from "./utils";
import { TOTAL_ROWS } from "../../constants";
import { AutoModeSettingsType, ModalTabsType } from "../../UI/entities/Modal/type";
import { MayaState } from "../type";
import { createAutoModeState } from "./utils/createAutoModeState";
import { checkAutoModeConditions } from "../../UI/entities/SlotsField/controller/utils/checkAutoModeConditions";
import { ByttonKey } from "../../UI/entities/TotalBetBlock/config";
import { calculateTotalBet } from "./utils/calculateTotalBet";

export class MayaEmitter {
  private emitter = new EventEmitter();
  private manager: MayaManager;

  constructor(manager: MayaManager) {
    this.manager = manager;
  }

  removeAllListeners = this.emitter.removeAllListeners;

  private createListener = (event: string, callBack: (v?: any) => void) => {
    this.emitter.addListener(event, callBack);

    return () => this.emitter.removeListener(event, callBack);
  };

  runAutoSpin = () => {
    const { state } = this.manager.state.autoMode;

    const restSpins = state?.spins;
    this.emitter.emit(RUN_AUTO_SPIN, restSpins);
  };

  private listenRestAutoSpins = (callBack: (spins: number) => void) =>
    this.createListener(RUN_AUTO_SPIN, callBack);

  private setRunSteps = (isRun: boolean) => {
    this.manager.state.gameState.runSteps = isRun;

    this.emitter.emit(SET_RUN_STEPS, isRun);
  };

  private listenSetRunSteps = (callBack: (isRun: boolean) => void) =>
    this.createListener(SET_RUN_STEPS, callBack);

  spiningSpeedUp = () => {
    this.emitter.emit(SPINING_SPEED_UP);
  };

  private listensetSpiningSpeedUp = (callBack: () => void) =>
    this.createListener(SPINING_SPEED_UP, callBack);

  private setCurrency = (currency: string) => {
    this.emitter.emit(SET_CURRENCY, currency);
  };

  private listensetCurrency = (callBack: (currency: string) => void) =>
    this.createListener(SET_CURRENCY, callBack);

  private setBalance = (balance: number) => {
    this.manager.state.gameState.balance = balance;

    this.emitter.emit(SET_BALANCE, balance);
  };

  private listenSetBalance = (callBack: (balance: number) => void) =>
    this.createListener(SET_BALANCE, callBack);

  private setRunRotateAnimation = (isRunRotate: boolean) => {
    this.manager.state.gameState.isRunRotateAnimation = isRunRotate;

    this.emitter.emit(SET_RUN_ROTATE, isRunRotate);
  };

  private listenSetRunRotateAnimation = (callBack: (spining: boolean) => void) =>
    this.createListener(SET_RUN_ROTATE, callBack);

  private setRunSpin = (spining: boolean) => {
    this.manager.state.gameState.isRunSpin = spining;

    this.emitter.emit(SET_SPINING, spining);
  };

  private listenSetRunSpin = (callBack: (spining: boolean) => void) =>
    this.createListener(SET_SPINING, callBack);

  private listenClusterFinished = (callBack: (totalMult: string) => void) =>
    this.createListener(CLUSTER_FINISHED, callBack);

  clusterFinished = (totalMult: string) => {
    this.emitter.emit(CLUSTER_FINISHED, totalMult);
  };

  private setShowNotification = (show: boolean) => {
    this.emitter.emit(SHOW_NOTIFICATION, show);
  };

  private listenShowNotification = (callBack: (show: boolean) => void) =>
    this.createListener(SHOW_NOTIFICATION, callBack);

  private setFreeGames = ({ isFreeGame, amount, numberOfSpin }: FreeGamesType) => {
    this.emitter.emit(SET_FREE_GAME, { isFreeGame, amount, numberOfSpin });
  };

  private listenFreeGames = (callBack: (freeGames: FreeGamesType) => void) =>
    this.createListener(SET_FREE_GAME, callBack);

  private setAutoMode = (autoMode: boolean) => {
    this.manager.state.autoMode.isAutoMode = autoMode;
    const { runSteps } = this.manager.state.gameState;

    if (autoMode) {
      const state = createAutoModeState(this.manager);
      this.manager.state.autoMode.state = state;

      if (!runSteps) {
        checkAutoModeConditions(this.manager);
        this.manager.spin();
      }
    }
    this.emitter.emit(SET_AUTO_MODE, autoMode);
  };

  private listenSetAutoMode = (callBack: (autoMode: boolean) => void) =>
    this.createListener(SET_AUTO_MODE, callBack);

  private setAutoModeSettings = (settings: AutoModeSettingsType) => {
    this.manager.state.autoMode.settings = settings;
    this.emitter.emit(SET_AUTOPLAY_SETTINGS, settings);
  };

  private listenAutoplaySettings = (callBack: (settings: AutoModeSettingsType) => void) =>
    this.createListener(SET_AUTOPLAY_SETTINGS, callBack);

  private setTotalBet = (bet: { totalBet?: number; isInit?: boolean; byttonKey?: ByttonKey }) => {
    let newTotalBet = bet.totalBet || 0;
    if (!!bet.byttonKey) {
      newTotalBet = calculateTotalBet(bet.byttonKey, this.manager);
      bet.totalBet = newTotalBet;
    }

    this.manager.state.gameState.totalBet = newTotalBet;
    this.emitter.emit(SET_TOTAL_BET, bet);
  };

  private listenSetTotalBet = (callBack: (obj: { totalBet: number; isInit?: boolean }) => void) =>
    this.createListener(SET_TOTAL_BET, callBack);

  private setActiveModalTab = (activeModalType: ModalTabsType) => {
    this.manager.state.gameState.activeModalTab = activeModalType;

    this.emitter.emit(SET_ACTIVE_MODAL_TAB, activeModalType);
  };

  private listenActiveModalTab = (callBack: (activeModalType: ModalTabsType) => void) =>
    this.createListener(SET_ACTIVE_MODAL_TAB, callBack);

  private setVisibleModal = (isVisible: boolean) => {
    this.manager.state.gameState.isOpenModal = isVisible;

    this.emitter.emit(SET_MODAL_VIVSIBLE, isVisible);
  };

  private listenVisibleModal = (callBack: (isVisible: boolean) => void) =>
    this.createListener(SET_MODAL_VIVSIBLE, callBack);

  private listenTargetGameTable = (callBack: (value: SetGameTableType) => void) =>
    this.createListener(CHANGE_GAME_TABLE, callBack);

  private setTargetGameTable = ({ gameTable, destroyedElements }: SetGameTableType) => {
    const oldGameTable = this.manager.state.gameState.gameTable;
    const spawnedGameTable = gameTable.map((arr) => [...arr].reverse());
    const newGameTable = mergeArrays(oldGameTable, spawnedGameTable, TOTAL_ROWS);
    this.manager.state.gameState.gameTable = newGameTable;

    this.emitter.emit(CHANGE_GAME_TABLE, { gameTable: newGameTable, destroyedElements });
  };

  private listenPlay = (callBack: (value: string) => void) =>
    this.createListener(PLAY_EVENT, callBack);

  play = () => {
    this.emitter.emit(PLAY_EVENT);
  };

  init = () => {
    this.emitter.emit(CREATED_UI, this.manager.state);
  };

  private listenInit = (callBack: (state: MayaState) => void) =>
    this.createListener(CREATED_UI, callBack);

  listeners = {
    listenSetRunRotateAnimation: this.listenSetRunRotateAnimation,
    listenRestAutoSpins: this.listenRestAutoSpins,
    listenAutoplaySettings: this.listenAutoplaySettings,
    listenSetRunSteps: this.listenSetRunSteps,
    listenSetAutoMode: this.listenSetAutoMode,
    listensetSpiningSpeedUp: this.listensetSpiningSpeedUp,
    listensetCurrency: this.listensetCurrency,
    listenSetBalance: this.listenSetBalance,
    listenClusterFinished: this.listenClusterFinished,
    listenSetRunSpin: this.listenSetRunSpin,
    listenShowNotification: this.listenShowNotification,
    listenFreeGames: this.listenFreeGames,
    listenInit: this.listenInit,
    listenPlay: this.listenPlay,
    listenTargetGameTable: this.listenTargetGameTable,
    listenVisibleModal: this.listenVisibleModal,
    listenActiveModalTab: this.listenActiveModalTab,
    listenSetTotalBet: this.listenSetTotalBet,
  };

  setters = {
    setRunRotateAnimation: this.setRunRotateAnimation,
    setAutoplaySettings: this.setAutoModeSettings,
    setRunSteps: this.setRunSteps,
    setAutoMode: this.setAutoMode,
    setCurrency: this.setCurrency,
    setBalance: this.setBalance,
    setRunSpin: this.setRunSpin,
    setShowNotification: this.setShowNotification,
    setFreeGames: this.setFreeGames,
    setTargetGameTable: this.setTargetGameTable,
    setVisibleModal: this.setVisibleModal,
    setActiveModalTab: this.setActiveModalTab,
    setTotalBet: this.setTotalBet,
  };
}
