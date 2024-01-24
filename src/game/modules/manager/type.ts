import { AutoModeSettingsType, ModalTabsType, SectionKey } from "../UI/entities/Modal/type";
import { SlotKeys } from "../UI/entities/SlotsField/Reel/SlotPool/Slot/constants";

export type WiningType = "win" | "bigWin" | "epicWin";

type GameType = "base_game" | "free_game";

export type CoordinationsType = {
  r: number;
  c: number;
};

type SessionWalletType = {
  balance: string;
  currency: string;
};

export type InitFetchResult = {
  available_bets: number[];
  game_state: SessionWalletType;
  session_token: string;
};

export type SpinFetchResult = {
  session_wallet: SessionWalletType;
  game_result: {
    bet_id: string;
    free_games_won: string;
    steps: StepType[];
    total_multtiplier: string;
    win_amount: string;
  };
};

export type WildSymbolsChanges = {
  prev_pos: string;
  prev_mult: number;
  new_mult: number;
  new_pos: string;
};

export type ClusterCombinations = {
  elements: string[];
  wild_mult: number,
  symbol_mult: string;
  total_mult: string;
  wild_mults: Array<{
    pos: string;
    mult: number;
  }>;
};

export type ClusterType = {
  destroyed_elements: string[];
  wild_symbols_changes: WildSymbolsChanges[];
  spawned_symbols: Record<string, string[]>;
  cluster_mult: string;
  all_combinations: ClusterCombinations[];
};

export type StepType = {
  game_type: GameType;
  game_field: SlotKeys[][];
  step_total_mult: string;
  clusters: ClusterType[];
  wild_symbols: { pos: string; mult: number };
};

type GameStateType = {
  totalBet: number;
  totalBetForFetch: number;
  isRunSpin: boolean;
  isRunRotateAnimation: boolean;
  gameTable: SlotKeys[][];
  activeModalTab: ModalTabsType;
  isOpenModal: boolean;
  clientSeed: string;
  balance: number;
  runSteps?: boolean;
};

export type AutoModeStateType = {
  [SectionKey.SPINS]: number;
  [SectionKey.WIN_LIMIT]: number | null;
  [SectionKey.DECREASE]: number | null;
  [SectionKey.INCREASE]: number | null;
};

type AutoModeType = {
  isAutoMode: boolean;
  settings: AutoModeSettingsType;
  isOpenModal?: boolean;
  state?: AutoModeStateType;
};

export type MayaState = {
  autoMode: AutoModeType;
  gameState: GameStateType;
  init: InitFetchResult;
  sesionResult?: SpinFetchResult;
};
