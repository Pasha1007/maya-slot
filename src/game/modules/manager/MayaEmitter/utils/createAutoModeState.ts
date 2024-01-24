import { MayaManager } from "../..";
import { SectionKey } from "../../../UI/entities/Modal/type";
import { AutoModeStateType } from "../../type";

export function createAutoModeState(manager: MayaManager): AutoModeStateType {
  const { settings } = manager.state.autoMode;
  const res = {} as AutoModeStateType;

  Object.keys(settings).forEach((sectionKey) => {
    switch (sectionKey) {
      case SectionKey.SPINS:
        res.spins = settings[SectionKey.SPINS].value;
        break;
      case SectionKey.WIN_LIMIT:
        const { value: winLimitValue } = settings[SectionKey.WIN_LIMIT];

        if (winLimitValue) {
          const winAmount = Number(manager.state.gameState.totalBet) * winLimitValue;
          res.winLimit = winAmount;
        } else {
          res.winLimit = null;
        }

        break;
      case SectionKey.INCREASE:
        const { value: increaseValue } = settings[SectionKey.INCREASE];
        if (increaseValue) {
          const balanceForStopAuto = Number(manager.state.gameState.balance) * (1 + increaseValue);
          res.increase = balanceForStopAuto;
        } else {
          res.increase = null;
        }

        break;
      case SectionKey.DECREASE:
        const { value: decreaseValue } = settings[SectionKey.DECREASE];
        if (decreaseValue) {
          const balanceForStopAuto = Number(manager.state.gameState.balance) * (1 - decreaseValue);

          res.decrease = balanceForStopAuto;
        } else {
          res.decrease = null;
        }

        break;

      default:
        break;
    }
  });

  return res;
}
