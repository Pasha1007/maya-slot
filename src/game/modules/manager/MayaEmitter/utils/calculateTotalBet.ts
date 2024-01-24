import { MayaManager } from "../..";
import { ByttonKey } from "../../../UI/entities/TotalBetBlock/config";

export function calculateTotalBet(byttonKey: ByttonKey, manager: MayaManager): number {
  const { available_bets } = manager.state.init;
  const { totalBet } = manager.state.gameState;
  const currentTotalBetIndex = available_bets.indexOf(totalBet);

  const min = Number(available_bets[0]);
  const max = Number(available_bets.at(-1));

  switch (byttonKey) {
    case "min":
      return min;

    case "prev":
      const prevIndex = currentTotalBetIndex - 1;

      if (prevIndex <= 0) return min;

      return Number(available_bets[prevIndex]);

    case "next":
      const nextIndex = currentTotalBetIndex + 1;

      if (nextIndex >= available_bets.length - 1) return max;

      return Number(available_bets[nextIndex]);

    case "max":
      return max;

    default:
      return 0;
  }
}
