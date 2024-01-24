import { ModalTabsType, TabsTitleType } from "../../type";

type TitlesConfigType = {
  title: TabsTitleType;
  tabKey: ModalTabsType;
};

export const titlesConfig: TitlesConfigType[] = [
  {
    tabKey: "auto",
    title: "AUTOPLAYS",
  },
  {
    tabKey: "bet",
    title: "TOTAL BET",
  },
  {
    tabKey: "table",
    title: "PAYTABLE",
  },
];
