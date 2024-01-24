import { DesktopModal } from "../../../Desktop/DesktopModal";
import { MayaManager } from "../../../../manager";
import { EventEmitter } from "stream";
import { MobileModal } from "../../../Mobile/MobileModal";

type ControllerType = {
  ui: DesktopModal | MobileModal;
  manager: MayaManager;
};

export class ModalController {
  private removeListeners: (void | (() => EventEmitter))[] = [];
  private modal: DesktopModal | MobileModal;
  private manager: MayaManager;

  constructor({ ui, manager }: ControllerType) {
    this.manager = manager;
    this.modal = ui;

    const currency = this.manager.listen("listensetCurrency", (currency) => {
      this.modal.content.gameTable.title.setBetInfo(currency);
    });
    this.removeListeners.push(currency);

    const listenInit = this.manager.listen("listenInit", (state) => {
      const { gameState } = state;
      this.manager.setValue("setVisibleModal", gameState.isOpenModal);
      this.modal.content.autoplay.setAutoModeSettings(state.autoMode.settings);
    });
    this.removeListeners.push(listenInit);

    const listenVisibleModal = this.manager.listen("listenVisibleModal", () => {
      const { isOpenModal } = this.manager.getValue("gameState");
      this.modal.scrollContainer.updateScrollbarVisibility();
      this.modal.visible = isOpenModal;
    });
    this.removeListeners.push(listenVisibleModal);

    const listenActiveModalTab = this.manager.listen("listenActiveModalTab", (tabKey) => {
      this.modal.titles.setTitleVisible(tabKey, true);
      this.modal.content.showTabContent(tabKey);
      this.modal.scrollContainer.updateScrollbarVisibility();
      this.modal.scrollContainer.scrollToTop();
    });
    this.removeListeners.push(listenActiveModalTab);

    const listenSetTotalBet = this.manager.listen("listenSetTotalBet", (bet) => {
      const { totalBet, gameTable } = this.modal.content;
      if (bet.isInit) {
        totalBet.setAvailableBets(this.manager.state.init.available_bets);
      }

      totalBet.setActiveBet(bet.totalBet);
      gameTable.setTotalBet(bet.totalBet);
      gameTable.title.setBetInfo(undefined, bet.totalBet);
    });
    this.removeListeners.push(listenSetTotalBet);

    const autoplaySettings = this.manager.listen("listenAutoplaySettings", (settings) => {
      this.modal.content.autoplay.setAutoModeSettings(settings);
    });
    this.removeListeners.push(autoplaySettings);

    const setAutoMode = this.manager.listen("listenSetAutoMode", (isAutoMode) => {
      const startBtn = this.modal.content.autoplay.startAndResetBtns[0];
      startBtn.onButtonOut();
      startBtn.setDisable(isAutoMode);
      this.modal.content.totalBet.setAllDisabled(isAutoMode)
    });
    this.removeListeners.push(setAutoMode);
  }

  destroy = () => {
    this.removeListeners.forEach((removeListener: () => EventEmitter) => {
      removeListener();
    });
  };
}
