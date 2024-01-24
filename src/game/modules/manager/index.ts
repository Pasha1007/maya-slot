import { Maya } from "../..";
import { defaultAutoSettings } from "../UI/entities/Modal/constants";
import { slotsKeys } from "../UI/entities/SlotsField/Reel/SlotPool/Slot/config";
import { SlotKeys } from "../UI/entities/SlotsField/Reel/SlotPool/Slot/constants";
import { TOTAL_REELS } from "../constants";
import { MayaEmitter } from "./MayaEmitter";
import { MayaState, InitFetchResult, SpinFetchResult } from "./type";
import { generateRandomString } from "./utils/generateRandomString";
import { postFetch } from "./utils/postFetch";
import { shuffleSlotKeys } from "./utils/shuffleSlotKeys";

export class MayaManager {
  public emitter = new MayaEmitter(this);
  private ticket: string;
  private main: Maya;
  private isInit: boolean = true;

  state: MayaState = {
    init: {
      session_token: "",
      available_bets: [0.2, 0.4, 0.6, 1, 2, 3, 4, 5, 6, 7, 8, 10],
      game_state: {
        balance: "",
        currency: "EURO",
      },
    },
    autoMode: { settings: defaultAutoSettings, isAutoMode: false },
    gameState: {
      isRunRotateAnimation: false,
      isRunSpin: false,
      totalBet: 0.2,
      totalBetForFetch: 0.2,
      activeModalTab: "auto",
      isOpenModal: false,
      gameTable: [],
      clientSeed: generateRandomString(10),
      balance: 100,
    },
  };

  constructor(ticket: string, main: Maya) {
    this.ticket = ticket;
    this.main = main;
    const startGameTable: SlotKeys[][] = [];

    for (let i = 0; i < TOTAL_REELS; i++) {
      startGameTable.push(shuffleSlotKeys(slotsKeys as SlotKeys[]));
    }

    this.state.gameState.gameTable = startGameTable;

    this.listen("listenInit", () => {
      if (this.isInit) return;

      this.init();
    });
  }

  actionFinished = () => {
    postFetch("api/sessions/animation-finished", {
      variables: {
        session_token: this.state.init.session_token,
        bet_id: this.state.sesionResult?.game_result.bet_id,
      },
    });
  };

  private init = async () => {
    const { data, error } = await postFetch<InitFetchResult>("api/sessions/init-jam-session", {
      variables: { ticket: this.ticket },
    });
    if (error) {
      this.main.options?.onError(error);
    }
    if (!!data) {
      this.isInit = true;
      this.state.init = data;
      this.state.init.available_bets = data.available_bets.map((bet) => Number(bet));

      this.setValue("setTotalBet", { totalBet: Number(data.available_bets[0]), isInit: true });
      this.setValue("setBalance", Number(data.game_state.balance));
      this.setValue("setCurrency", data.game_state.currency);
    }
  };

  public spin = async () => {
    if (this.state.gameState.isRunSpin) return;
    this.setValue("setRunSpin", true);

    if (this.state.autoMode.isAutoMode) {
      this.emitter.runAutoSpin();
    }

    const { data, error } = await postFetch<SpinFetchResult>("api/egyptian-lands/spin", {
      variables: {
        session_token: this.state.init.session_token,
        bet_amount: this.state.gameState.totalBet,
        client_seed: this.state.gameState.clientSeed,
      },
    });
    if (error) {
      this.main.options?.onError(error);
      this.setValue("setRunSpin", false);
    }
    if (!!data) {
      this.state.gameState.totalBetForFetch = this.state.gameState.totalBet;
      this.state.sesionResult = data;
      this.setValue("setTargetGameTable", {
        gameTable: this.state.sesionResult.game_result.steps[0].game_field,
      });
      this.setValue("setBalance", this.state.gameState.balance - this.state.gameState.totalBet);
      this.emitter.play();
    }
  };

  listen<
    Listeners extends typeof this.emitter.listeners,
    K extends keyof typeof this.emitter.listeners
  >(key: K, callBack: Parameters<Listeners[K]>[0]) {
    const listener = this.emitter.listeners[key];
    //@ts-ignore
    return listener(callBack);
  }
  setValue<
    Setters extends typeof this.emitter.setters,
    K extends keyof typeof this.emitter.setters
  >(key: K, value: Parameters<Setters[K]>[0]) {
    const setter = this.emitter.setters[key];
    //@ts-ignore
    setter(value);
  }

  getValue<K extends keyof MayaState>(key: K) {
    return this.state[key];
  }
}
