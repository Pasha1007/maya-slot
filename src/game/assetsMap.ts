import { ScreenVersion } from "./modules/types";

const baseMobilePath = "./assets/UI/mobile";
const baseDesktopPath = "./assets/UI/desktop";
const commonTextures = "./assets/UI/common";
const baseSpinePath = "./assets";

export const fonts = ["Berenika"];

export const assetsMap = {
  common: [
    {
      name: "totalBetArrow",
      url: `${commonTextures}/total_bet_btn_arrow.webp`,
    },
    {
      name: "totalBetBlockButton",
      url: `${commonTextures}/totalBetBlockButton.webp`,
    },
    {
      name: "minButton",
      url: `${commonTextures}/minButton.webp`,
    },
    {
      name: "minButtonHover",
      url: `${commonTextures}/minButtonHover.webp`,
    },
    {
      name: "maxButton",
      url: `${commonTextures}/maxButton.webp`,
    },
    {
      name: "maxButtonHover",
      url: `${commonTextures}/maxButtonHover.webp`,
    },
    {
      name: "totalBetBlockButtonHover",
      url: `${commonTextures}/totalBetBlockButtonHover.webp`,
    },
    {
      name: "totalBetField",
      url: `${commonTextures}/totalBetField.webp`,
    },
    {
      name: "freeCounterBg",
      url: `${commonTextures}/freeCounterBg.webp`,
    },
    {
      name: "infinity",
      url: `${commonTextures}/modal/infinity.webp`,
    },
    {
      name: "ifWinIcon",
      url: `${commonTextures}/modal/ifWinIcon.webp`,
    },
    {
      name: "modalButtonHover",
      url: `${commonTextures}/modal/modalButtonHover.webp`,
    },
    {
      name: "modalButton",
      url: `${commonTextures}/modal/modalButton.webp`,
    },
    {
      name: "skipIcon",
      url: `${commonTextures}/skip.webp`,
    },
    {
      name: "slotParticle",
      url: `${commonTextures}/slotParticle.webp`,
    },
    {
      name: "autoButtonArrow",
      url: `${commonTextures}/auto_button_arrow.webp`,
    },
    {
      name: "slotDimming",
      url: `${commonTextures}/slotDimming.webp`,
    },
    {
      name: "greenFlask",
      url: `${commonTextures}/greenFlask.webp`,
    },
    {
      name: "papyrusScroll",
      url: `${commonTextures}/papyrusScroll.webp`,
    },
    {
      name: "yellowMedallion",
      url: `${commonTextures}/yellowMedallion.webp`,
    },
    {
      name: "wildIcon",
      url: `${commonTextures}/multiplayer.webp`,
    },
    {
      name: "wildIconX",
      url: `${commonTextures}/wildIconWithX.webp`,
    },
    {
      name: "wildRow",
      url: `${commonTextures}/wildsRow.webp`,
    },
    {
      name: "miniSlot",
      url: `${commonTextures}/miniSlot.webp`,
    },
    {
      name: "redMedallion",
      url: `${commonTextures}/redMedallion.webp`,
    },
    {
      name: "purpleMedallion",
      url: `${commonTextures}/purpleMedallion.webp`,
    },
    {
      name: "rune",
      url: `${commonTextures}/rune.webp`,
    },
    {
      name: "ring",
      url: `${commonTextures}/ring.webp`,
    },
    {
      name: "magicScroll",
      url: `${commonTextures}/magicScroll.webp`,
    },
    {
      name: "blackoutBg",
      url: `${commonTextures}/blackout_bg.webp`,
    },
    {
      name: "soundBtn",
      url: `${commonTextures}/sound_btn.webp`,
    },
    {
      name: "soundBtnHover",
      url: `${commonTextures}/sound_btn_hover.webp`,
    },
    {
      name: "soundOn",
      url: `${commonTextures}/sound_on.webp`,
    },
    {
      name: "soundOff",
      url: `${commonTextures}/sound_off.webp`,
    },
    {
      name: "menuBtn",
      url: `${commonTextures}/menu_btn.webp`,
    },
    {
      name: "menuHover",
      url: `${commonTextures}/menu_hover.webp`,
    },
    {
      name: "spinButton",
      url: `${commonTextures}/spinButton.webp`,
    },
    {
      name: "spinButtonBckg",
      url: `${commonTextures}/spinButtonBckg.webp`,
    },
    {
      name: "spinArrow",
      url: `${commonTextures}/spin_arrow.webp`,
    },
    {
      name: "spinButtonHover",
      url: `${commonTextures}/spinButtonHover.webp`,
    },
    {
      name: "autoBtn",
      url: `${commonTextures}/auto_mode_btn.webp`,
    },
    {
      name: "autoButtonHover",
      url: `${commonTextures}/auto_button_hover.webp`,
    },
    {
      name: "autoModalBtnHover",
      url: `${commonTextures}/modal/auto_btn_hover.webp`,
    },
    {
      name: "autoModalBtn",
      url: `${commonTextures}/modal/auto_btn.webp`,
    },
    {
      name: "modalAutoBtnHover",
      url: `${commonTextures}/modal/modalAutoBtnHover.webp`,
    },
    {
      name: "modalBetBtnHover",
      url: `${commonTextures}/modal/modalBetBtnHover.webp`,
    },
    {
      name: "modalTableBtnHover",
      url: `${commonTextures}/modal/modalTableBtnHover.webp`,
    },
    {
      name: "infoModalBtn",
      url: `${commonTextures}/modal/info_btn.webp`,
    },
    {
      name: "tableModalBtn",
      url: `${commonTextures}/modal/table_btn.webp`,
    },
    {
      name: "totalBetModalBtn",
      url: `${commonTextures}/modal/total_bet.webp`,
    },
  ],
  spines: [
    {
      name: "freeSpins",
      url: `${baseSpinePath}/notification/Maya_Free/Free_1.json`,
    },
    {
      name: "background",
      url: `${baseSpinePath}/notification/Background/Background Egypt.json`,
    },
    {
      name: "slot_frame",
      url: `${baseSpinePath}/notification/Frame/Maya_Frame.json`,
    },
    {
      name: "win",
      url: `${baseSpinePath}/notification/Maya_W/Maya_W.json`,
    },
    {
      name: "bigWin",
      url: `${baseSpinePath}/notification/Maya_BW/Maya_BW.json`,
    },
    {
      name: "epicWin",
      url: `${baseSpinePath}/notification/Maya_EW/Maya_EW.json`,
    },
    {
      name: "wild",
      url: `${baseSpinePath}/slots/Multi/Multi.json`,
    },
    {
      name: "magicScroll-s",
      url: `${baseSpinePath}/slots/Maya_Item_8/Maya_Item_8.json`,
    },
    {
      name: "purpleMedallion-s",
      url: `${baseSpinePath}/slots/Maya_Item_3/Maya_Item_3.json`,
    },
    {
      name: "rune-s",
      url: `${baseSpinePath}/slots/Maya_Item_4/Maya_Item_4.json`,
    },
    {
      name: "greenFlask-s",
      url: `${baseSpinePath}/slots/Maya_Item_6/Maya_Item_6.json`,
    },
    {
      name: "redMedallion-s",
      url: `${baseSpinePath}/slots/Maya_Item_2/Maya_Item_2.json`,
    },
    {
      name: "yellowMedallion-s",
      url: `${baseSpinePath}/slots/Maya_Item_5/Maya_Item_5.json`,
    },
    {
      name: "ring-s",
      url: `${baseSpinePath}/slots/Maya_Item_1/Maya_Item_1.json`,
    },
    {
      name: "papyrusScroll-s",
      url: `${baseSpinePath}/slots/Maya_Item_7/Maya_Item_7.json`,
    },
  ],
  [ScreenVersion.DESKTOP]: [
    {
      name: "closeModalBtn-d",
      url: `${baseDesktopPath}/close_btn.webp`,
    },
    {
      name: "modalBg-d",
      url: `${baseDesktopPath}/modal_bg.webp`,
    },
    {
      name: "panel-d",
      url: `${baseDesktopPath}/panel.webp`,
    },
    {
      name: "slotsField-d",
      url: `${baseDesktopPath}/slots_bg2.webp`,
    },
    {
      name: "totalBet-d",
      url: `${baseDesktopPath}/total_bet_btn.webp`,
    },
    {
      name: "totalBetHover-d",
      url: `${baseDesktopPath}/total_bet_btn_hover.webp`,
    },
  ],
  [ScreenVersion.MOBILE]: [
    {
      name: "slotsField-m",
      url: `${baseMobilePath}/slots_bg.webp`,
    },
    {
      name: "spinButtonBg",
      url: `${baseMobilePath}/spinButtonBg.webp`,
    },
    {
      name: "closeModalBtn-m",
      url: `${baseMobilePath}/close_btn.webp`,
    },
    {
      name: "modalBg-m",
      url: `${baseMobilePath}/modal_bg.webp`,
    },
    {
      name: "gameBg-m",
      url: `${baseMobilePath}/mobile_bg.webp`,
    },
    {
      name: "tabsField-m",
      url: `${baseMobilePath}/tabsField.webp`,
    },
  ],
} as const;
