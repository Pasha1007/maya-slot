import { MayaManager } from "../../../../../manager";
import { SectionKey } from "../../../Modal/type";

export function checkAutoModeConditions(manager: MayaManager) {


  const { state } = manager.state.autoMode;

  if (state) {
    Object.keys(state).forEach((sectionKey) => {
      switch (sectionKey) {
        case SectionKey.SPINS:
          state[SectionKey.SPINS] -= 1;
          const spinAmount = state[SectionKey.SPINS];
          if (spinAmount < 0) {
            manager.setValue("setAutoMode", false);
          }

          break;
        case SectionKey.WIN_LIMIT:
          const winLimitValue = state[SectionKey.WIN_LIMIT];

          if (winLimitValue) {
            const winAmount = Number(manager.state.sesionResult?.game_result.win_amount);
            if (winAmount >= winLimitValue) {
              manager.setValue("setAutoMode", false);
            }
          }

          break;
        case SectionKey.INCREASE:
          const increaseValue = state[SectionKey.INCREASE];

          if (increaseValue) {
            const balance = Number(manager.state.gameState.balance);
            if (balance >= increaseValue) {
              manager.setValue("setAutoMode", false);
            }
          }

          break;
        case SectionKey.DECREASE:
          const decreaseValue = state[SectionKey.DECREASE];
          if (decreaseValue) {
            const balance = Number(manager.state.gameState.balance);
            if (balance <= decreaseValue) {
              manager.setValue("setAutoMode", false);
            }
          }

          break;

        default:
          break;
      }
    });
  }
}
