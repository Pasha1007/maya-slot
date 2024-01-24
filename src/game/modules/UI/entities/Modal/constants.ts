import { ResourceNames } from "../../../types";
import {
  AutoModeSettingsType,
  AutoplaySectionsType,
  SectionKey,
  StartAutomodeBlockType,
} from "./type";

const fontSizesD = {
  button: 32,
  title: 28,
};

const fontSizesM = {
  button: 50,
  title: 35,
};

export const autoplaySections: AutoplaySectionsType = {
  [SectionKey.SPINS]: {
    type: "radioButton",
    values: [10, 25, 50, 100, 150, 300, Infinity],
    text: ["10", "25", "50", "100", "150", "300", "infinity"],
    textureNameForButton: ["modalButton", "modalButtonHover"],
    title: "SETUP YOUR BEST AUTOPLAY CONDITIONS",
    key: SectionKey.SPINS,
    screenConfig: {
      mobile: {
        fontSizes: fontSizesM,
        columnsAmout: 2,
        buttonSizes: { w: 300, h: 100 },
      },
      desktop: {
        fontSizes: fontSizesD,
        columnsAmout: 5,
      },
    },
  },
  [SectionKey.WIN_LIMIT]: {
    type: "checkbox",
    values: [50, 100],
    text: ["BIG WIN", "EPIC WIN"],
    textureNameForButton: ["modalButton", "modalButtonHover"],
    title: "STOP AUTOPLAY",
    key: SectionKey.WIN_LIMIT,
    additionalBlock: {
      text: "IF WIN",
    },
    screenConfig: {
      mobile: {
        fontSizes: fontSizesM,
        columnsAmout: 2,
        buttonSizes: { w: 300, h: 100 },
      },
      desktop: {
        fontSizes: fontSizesD,
        columnsAmout: 5,
        buttonSizes: { w: 180, h: 65 },
      },
    },
  },
  [SectionKey.INCREASE]: {
    type: "checkbox",
    values: [0.1, 0.25, 0.5, 0.75, 1],
    text: ["10%", "25%", "50%", "75%", "100%"],
    textureNameForButton: ["modalButton", "modalButtonHover"],
    title: "IF BALANCE INCREASE BY",
    key: SectionKey.INCREASE,
    screenConfig: {
      mobile: {
        fontSizes: fontSizesM,
        columnsAmout: 2,
        buttonSizes: { w: 300, h: 100 },
      },
      desktop: {
        fontSizes: fontSizesD,
        columnsAmout: 5,
      },
    },
  },
  [SectionKey.DECREASE]: {
    type: "checkbox",
    textureNameForButton: ["modalButton", "modalButtonHover"],
    values: [0.1, 0.25, 0.5, 0.75, 1],
    text: ["10%", "25%", "50%", "75%", "100%"],
    title: "IF BALANCE DECREASE BY",
    key: SectionKey.DECREASE,
    screenConfig: {
      mobile: {
        fontSizes: fontSizesM,
        columnsAmout: 2,
        buttonSizes: { w: 300, h: 100 },
      },
      desktop: {
        fontSizes: fontSizesD,
        columnsAmout: 5,
      },
    },
  },
};

export const startAutomodeBlock: StartAutomodeBlockType[] = [
  {
    text: "START",
    key: "start",
    fontSize: {
      desktop: 35,
      mobile: 50,
    },
    buttonSizes: { desktop: { w: 320, h: 60 }, mobile: { w: 100, h: 100 } },
  },
  {
    text: "RESET",
    key: "reset",
    fontSize: {
      desktop: 35,
      mobile: 50,
    },
    buttonSizes: { desktop: { w: 320, h: 60 }, mobile: { w: 590, h: 100 } },
  },
];

export const defaultAutoSettings: AutoModeSettingsType = {
  [SectionKey.SPINS]: { value: autoplaySections[SectionKey.SPINS].values[0] },
  [SectionKey.INCREASE]: { value: null },
  [SectionKey.DECREASE]: { value: null },
  [SectionKey.WIN_LIMIT]: {
    value: null,
  },
};

export const amountWinSlots: string[] = [
  "5",
  "6",
  "7",
  "8",
  "9",
  "10-11",
  "12-14",
  "15-19",
  "20-24",
  "25+",
].reverse();

export const multipliers = {
  H1: [1, 1.5, 2, 2.5, 3, 5, 5, 10, 10, 10, 20, 20, 20, 20, 20, 40, 40, 40, 40, 40, 100],
  H2: [
    0.5, 0.75, 1.25, 2, 2.5, 3, 3, 6.25, 6.25, 6.25, 10, 10, 10, 10, 10, 25, 25, 25, 25, 25, 62.5,
  ],
  H3: [0.25, 0.5, 0.75, 1, 1.25, 2, 2, 4, 4, 4, 7.5, 7.5, 7.5, 7.5, 7.5, 15, 15, 15, 15, 15, 37.5],
  H4: [0.25, 0.5, 0.75, 1, 1.25, 2, 2, 4, 4, 4, 7.5, 7.5, 7.5, 7.5, 7.5, 15, 15, 15, 15, 15, 37.5],
  N1: [0.15, 0.2, 0.4, 0.6, 0.8, 1, 1, 3, 3, 3, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 25],
  N2: [0.15, 0.2, 0.4, 0.6, 0.8, 1, 1, 3, 3, 3, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 25],
  N3: [0.1, 0.15, 0.2, 0.3, 0.6, 0.8, 0.8, 1, 1, 1, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 10],
  N4: [0.1, 0.15, 0.2, 0.3, 0.6, 0.8, 0.8, 1, 1, 1, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 10],
};

type SymbolsDecription = {
  symbolName: ResourceNames;
  description: string;
};
type WildDecription = {
  wildName: ResourceNames;
  description: string;
  wildSize: number;
};
export const wildDescription: WildDecription[] = [
  {
    wildName: "wildIcon",
    description: "The Jar symbol is a wild symbol that can replace any other symbol.\n\nIf a Jar symbol contributes to a winning cluster, it will randomly move to an adjacent empty space before the next collapse.\n\nDuring a collapse, all Jar symbols remain in place.",
    wildSize: 200
  },
  {
    wildName: "wildIconX",
    description: "Every Jar symbol has a multiplier, which starts at 1x. The current multiplier value is applied to any win that the Jar symbol contributes to.\n\nEach time a Jar symbol contributes to a winning cluster, its multiplier increases by 1.",
    wildSize: 250
  },
  {
    wildName: "wildRow",
    description: "The Jar symbol is also a scatter symbol. Landing 3 or more Jar symbols anywhere on the reels triggers the free games feature.",
    wildSize: 215
  },
  {
    wildName: "miniSlot",
    description: "Land 3 or more Jar symbols anywhere to trigger the free games feature, which awards 6 free spins.\n\nIf a Jar symbol contributes to a winning cluster, it will randomly move to an empty space next to it before the next collapse.",
    wildSize: 350
  },
]
export const symbolsDecription: SymbolsDecription[] = [
  {
    symbolName: "magicScroll",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummytext ever since the 1500sLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
  },
  {
    symbolName: "rune",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummytext ever since the 1500sLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
  },
  {
    symbolName: "purpleMedallion",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummytext ever since the 1500sLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
  },
  {
    symbolName: "redMedallion",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummytext ever since the 1500sLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
  },
  {
    symbolName: "yellowMedallion",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummytext ever since the 1500sLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
  },
  {
    symbolName: "papyrusScroll",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummytext ever since the 1500sLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
  },
  {
    symbolName: "greenFlask",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummytext ever since the 1500sLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
  },
  {
    symbolName: "ring",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummytext ever since the 1500sLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
  },
];
