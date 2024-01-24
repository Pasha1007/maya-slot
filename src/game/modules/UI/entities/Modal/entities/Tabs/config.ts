import { ResourceNames } from "../../../../../types";
import { ModalTabsType } from "../../type";

type TabsConfigType = {
  tabKey: ModalTabsType;
  texturesForBtn: ResourceNames[];
  //additionlText?: string
};

export const tabsConfig: TabsConfigType[] = [
  {
    tabKey: "auto",
    texturesForBtn: ["autoModalBtn", "modalAutoBtnHover"],
    //additionlText: "A"
  },
  {
    tabKey: "bet",
    texturesForBtn: ["totalBetModalBtn", "modalBetBtnHover"],
  },
  {
    tabKey: "table",
    texturesForBtn: ["tableModalBtn", "modalTableBtnHover"],
  },
];
