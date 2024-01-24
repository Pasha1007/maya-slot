import { Container, Text } from "pixi.js-legacy";
import { AutoModeSettingsType, SectionKey } from "../../../type";
import { Section } from "./Section";
import { MayaManager } from "../../../../../../manager";
import { autoplaySections, defaultAutoSettings, startAutomodeBlock } from "../../../constants";
import { IfWinBlock } from "./IfWinBlock";
import { ScreenVersion, SizesType } from "../../../../../../types";
import { theme } from "../../../../../style";
import { ContentButton } from "../../ContentButton";
import { GridContainer } from "../../GridContainer";

type AutoplayType = {
  contentW: number;
  manager: MayaManager;
  screenVersion: ScreenVersion
  buttonSizes: SizesType
  alignItemsCenter?: boolean;
  gap?: number;
};

export class Autoplay extends Container {
  private sections: Map<SectionKey, Section> = new Map();
  private isDraging: boolean = false;
  public startAndResetBtns: ContentButton[]

  constructor({
    contentW,
    manager,
    alignItemsCenter = false,
    screenVersion,
    buttonSizes
  }: AutoplayType) {
    super();
    const gap = 30;
    this.interactive = true;

    const sectionContainer = new Container()

    let sectionOffsetY = 0;
    Object.values(autoplaySections).forEach((config) => {

      const additionalBlock = !!config.additionalBlock
        ? new IfWinBlock({
          config: config.additionalBlock,
          circleRadius: 20,
        })
        : null;

      const section = new Section({
        buttonSizes: config.screenConfig[screenVersion].buttonSizes || buttonSizes,
        screenVersion,
        config,
        contentW,
        ifWinBlock: additionalBlock,
        alignItemsCenter,
        onClick(sectionKey, value) {
          const { autoMode } = manager.state;
          manager.setValue("setAutoplaySettings", {
            ...autoMode.settings,
            [sectionKey]: { ...autoMode.settings[sectionKey], value },
          });
        },
      });

      section.y = sectionOffsetY;
      sectionOffsetY += section.height + gap;
      this.sections.set(config.key, section);

      sectionContainer.addChild(section)
    });

    this.startAndResetBtns = startAutomodeBlock.map((config) => {
      const { key, text, fontSize } = config;

      const textForBtn = new Text(text, {
        fontFamily: theme.fontFamily.primary,
        fill: theme.color.white,
        fontSize: fontSize[screenVersion],
        fontWeight: "200",
      });

      return new ContentButton({
        sizes: { w: 190, h: 62 },
        content: textForBtn,
        isActiveMode: false,
        onClick: () => {
          if (key === "start") {
            manager.setValue("setAutoMode", true);
            manager.setValue("setVisibleModal", false);
          }
          if (key === "reset") {
            manager.setValue("setAutoplaySettings", defaultAutoSettings);
          }
        },
      });
    });

    const columnsAmount = ScreenVersion.DESKTOP === screenVersion ? 2 : 2

    const footerButtons = new GridContainer({
      columns: columnsAmount,
      gap: 10,
      items: this.startAndResetBtns,
      alignItemsCenter: false,
    });
    footerButtons.y = sectionContainer.height + gap
    footerButtons.x = (screenVersion === ScreenVersion.DESKTOP)
      ? sectionContainer.width / 5
      : sectionContainer.width / 5.5


    this.addChild(sectionContainer, footerButtons)

    this.on("touchmove", () => {
      if (!this.isDraging) {
        this.isDraging = true;
        this.setDraging(this.isDraging);
      }
    }).on("touchend", () => {
      this.isDraging = false;
      this.setDraging(this.isDraging);
    });
  }

  setAutoModeSettings = (settings: AutoModeSettingsType) => {
    this.sections.forEach((section) => {
      const { value } = settings[section.key];

      section.setActiveButton(value);
    });
  };

  private setDraging = (isDraging: boolean) => {
    this.sections.forEach((section) => {
      section.setDraging(isDraging);
    });
  };
}
