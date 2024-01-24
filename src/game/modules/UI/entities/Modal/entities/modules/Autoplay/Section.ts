import { Container, Text, TextStyle, Sprite } from "pixi.js-legacy";
import { SectionKey, SectionsCofigType } from "../../../type";
import { IfWinBlock } from "./IfWinBlock";
import { ScreenVersion, SizesType } from "../../../../../../types";
import { GridContainer } from "../../GridContainer";
import { TextComponent } from "../../TextComponent";
import { createSprite } from "../../../../../../../utils/createSprite";
import { theme } from "../../../../../style";
import { ButtonVariantType, ContentButton } from "../../ContentButton";

type SectionType = {
  buttonSizes: SizesType
  config: SectionsCofigType;
  contentW: number;
  ifWinBlock?: IfWinBlock | null;
  alignItemsCenter?: boolean;
  screenVersion: ScreenVersion;
  onClick?: (sectionKey: SectionKey, value: number | null) => void;
};

export class Section extends Container {
  private buttons: ContentButton[] = [];
  private ifWinBlock?: IfWinBlock | null;
  private buttonSizes?: SizesType;
  public key: SectionKey;

  constructor({
    config,
    contentW,
    screenVersion,
    ifWinBlock,
    alignItemsCenter,
    onClick,
    buttonSizes
  }: SectionType) {
    super();
    this.key = config.key;
    this.ifWinBlock = ifWinBlock;
    this.buttonSizes = buttonSizes
    const { screenConfig, key, values, text, type, } = config;
    const currentScreenConfig = screenConfig[screenVersion]
    const title = this.createTitle(config.title, contentW, currentScreenConfig.fontSizes.title, alignItemsCenter);

    const buttonsArr = values.map((value, i) =>
      this.createButton(value, text[i], currentScreenConfig.fontSizes.button, onClick, key, type)
    );
    this.buttons = buttonsArr;

    const buttonsContainer = new Container();
    const buttons = new GridContainer({
      columns: currentScreenConfig.columnsAmout,
      gap: 15,
      items: buttonsArr,
      alignItemsCenter: true
    });
    buttonsContainer.addChild(buttons);

    if (!!ifWinBlock) {
      if (alignItemsCenter) {
        buttonsContainer.addChild(ifWinBlock);
        ifWinBlock.x = (buttonsContainer.width - ifWinBlock.width) / 2;
        buttons.y = ifWinBlock.height + 15;
      } else {
        buttonsContainer.addChild(ifWinBlock);
        ifWinBlock.y = (buttonsContainer.height - ifWinBlock.height) / 2;
        buttons.x = ifWinBlock.width * 1.2;
      }
    }

    buttonsContainer.y = title.y + title.height * 1.5;
    this.addChild(title, buttonsContainer);
    if (alignItemsCenter) {
      title.x = (this.width - title.width) / 2;
      buttonsContainer.x = (this.width - buttonsContainer.width) / 2;
    }
  }

  setActiveButton(value: number | null) {
    if (!!this.ifWinBlock) {
      this.ifWinBlock.setActive(!!value);
    }
    this.buttons.forEach((button) => {
      button.setActive(value === button.value);
    });
  }

  private createTitle(
    text: string,
    wordWrapWidth: number,
    fontSize: number,
    alignItemsCenter?: boolean
  ) {
    return new TextComponent({
      body: text,
      wordWrapWidth,
      fontSize,
      style: {
        align: alignItemsCenter ? "center" : "left",
      } as TextStyle,
    });
  }

  private createButton(
    value: number,
    text: string,
    fontSize: number,
    onClick: ((sectionKey: SectionKey, value: number | null) => void) | undefined,
    sectionKey: SectionKey,
    type: ButtonVariantType
  ): ContentButton {
    let contentContainer: Text | Sprite;

    if (value === Infinity) {
      contentContainer = createSprite({
        textureName: "infinity",
        anchor: { x: 0, y: 0 },
      });
    } else {
      contentContainer = new Text(text, {
        fontFamily: theme.fontFamily.primary,
        fill: theme.color.white,
        fontWeight: "600",
        fontSize,
      });
    }

    const button = new ContentButton({
      content: contentContainer,
      onClick: (value) => {
        // this.audios.play("betMax")
        onClick && onClick(sectionKey, value);
      },
      value,
      type,
      sizes: this.buttonSizes,
    });

    return button;
  }

  setDraging = (isDraging: boolean) => {
    this.buttons.forEach((btn) => {
      btn.setDraging(isDraging);
    });
  };
}
