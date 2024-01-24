import { MayaManager } from "../../../manager";
import { ResourceNames, SizesType } from "../../../types";
import { ButtonVariantType } from "./entities/ContentButton";

export type TabsTitleType = "AUTOPLAYS" | "TOTAL BET" | "PAYTABLE";
export type ModalTabsType = "auto" | "bet" | "table";

export type ModalContentType = {
  contentW: number;
  manager: MayaManager;
};

export enum SectionKey {
  SPINS = "spins",
  WIN_LIMIT = "winLimit",
  INCREASE = "increase",
  DECREASE = "decrease",
}

export type AutoModeSettingsType = {
  [SectionKey.SPINS]: { value: number };
  [SectionKey.WIN_LIMIT]: {
    value: number | null;
  };
  [SectionKey.INCREASE]: {
    value: number | null;
  };
  [SectionKey.DECREASE]: {
    value: number | null;
  };
};

export type StartAutomodeBlockType = {
  text: string;
  key: "start" | "reset";
  buttonSizes: { mobile: SizesType; desktop: SizesType };
  fontSize: {
    mobile: number;
    desktop: number;
  };
};

export type IfWinConfigType = {
  text: string;
};

type ScreenVersionConfig = {
  fontSizes: {
    button: number;
    title: number;
  };
  columnsAmout: number;
  buttonSizes?: SizesType;
};

export type SectionsCofigType = {
  type: ButtonVariantType;
  values: number[];
  text: string[];
  textureNameForButton: ResourceNames[];
  title: string;
  key: SectionKey;
  additionalBlock?: IfWinConfigType;
  screenConfig: {
    mobile: ScreenVersionConfig;
    desktop: ScreenVersionConfig;
  };
};

export type AutoplaySectionsType = {
  [SectionKey.SPINS]: SectionsCofigType;
  [SectionKey.WIN_LIMIT]: SectionsCofigType;
  [SectionKey.INCREASE]: SectionsCofigType;
  [SectionKey.DECREASE]: SectionsCofigType;
};
