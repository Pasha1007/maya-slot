import { DesktopGamePanel } from "../Desktop/GamePanel";
import { MayaManager } from "../../manager";
import { EventEmitter } from "stream";
import { MobileGamePanel } from "../Mobile/GamePanel";

type ControllerType = {
  ui: DesktopGamePanel | MobileGamePanel;
  manager: MayaManager;
};

export class GameController {
  private gameControl: DesktopGamePanel | MobileGamePanel;
  private removeListeners: (void | (() => EventEmitter))[] = [];
  private manager: MayaManager;

  constructor({ ui, manager }: ControllerType) {
    this.manager = manager;
    this.gameControl = ui;

    const listenSetRunSpin = this.manager.listen("listenSetRunSpin", (isSpining) => {
      const { winAmount } = this.gameControl;
      if (isSpining) {
        winAmount.setValue(0);
      }
    });
    this.removeListeners.push(listenSetRunSpin);

    const spinig = this.manager.listen("listenSetRunRotateAnimation", (isRunRotate) => {
      const { spinButton } = this.gameControl;
      spinButton.setVisbleSkipIcon(isRunRotate);
    });
    this.removeListeners.push(spinig);

    const listenRunSteps = this.manager.listen("listenSetRunSteps", (isRun) => {
      this.gameControl.spinButton.setDisable(isRun);
    });
    this.removeListeners.push(listenRunSteps);

    const listenSetAutoMode = this.manager.listen("listenSetAutoMode", (isAutoMode) => {
      const { state } = this.manager.state.autoMode;

      this.gameControl.autoButton.setRestSpinAmount(state?.spins || 0);
      this.gameControl.autoButton.setVisibleSpinsCounter(isAutoMode);
      this.gameControl.totalBetBlock.setAllDisabled(isAutoMode)
    });
    this.removeListeners.push(listenSetAutoMode);

    const listenRestAutoSpins = this.manager.listen("listenRestAutoSpins", (restSpins) => {
      this.gameControl.autoButton.setRestSpinAmount(restSpins);
    });
    this.removeListeners.push(listenRestAutoSpins);

    const currency = this.manager.listen("listensetCurrency", (currency) => {
      const { winAmountAdorment, balanceAdorment } = this.gameControl;
      winAmountAdorment.setCurrency(currency);
      balanceAdorment.setCurrency(currency);
    });
    this.removeListeners.push(currency);

    const setBalance = this.manager.listen("listenSetBalance", (balanceValue) => {
      const { balance } = this.gameControl;
      balance.setValue(Number(balanceValue));
    });
    this.removeListeners.push(setBalance);

    const clusterFinished = this.manager.listen("listenClusterFinished", (mult) => {
      const { winAmount } = this.gameControl;
      const cuurenWin = Number(winAmount.getValue());
      const winAmountValue = Number(mult) * this.manager.state.gameState.totalBet;
      this.gameControl.winAmount.setValue(cuurenWin + winAmountValue);
    });
    this.removeListeners.push(clusterFinished);

    const listenSetTotalBet = this.manager.listen("listenSetTotalBet", (bet) => {
      this.gameControl.totalBetBlock.setTotalBet(bet.totalBet);
    });
    this.removeListeners.push(listenSetTotalBet);

    const freeGames = this.manager.listen("listenFreeGames", (freeFames) => {
      const { isFreeGame, amount, numberOfSpin } = freeFames;
      const { freeGameCounter } = this.gameControl;

      this.gameControl.autoButton.visible = !isFreeGame;
      freeGameCounter.setVisible(isFreeGame);

      if (isFreeGame) {
        this.gameControl.freeGameCounter.setFreeGames(Number(numberOfSpin), Number(amount));
      }
    });
    this.removeListeners.push(freeGames);
  }

  destroy = () => {
    this.removeListeners.forEach((removeListener: () => EventEmitter) => {
      removeListener();
    });
  };
}
