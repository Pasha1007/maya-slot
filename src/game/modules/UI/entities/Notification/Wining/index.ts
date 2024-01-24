import { Container, Text } from "pixi.js-legacy";
import { ResourceState, ScreenVersion, WinsType } from "../../../../types";
import { CustomSpine } from "../../Spine";
import { WinAmountConfigType, winingConfigs } from "./config";
import { theme } from "../../../style";
import { remove, Tween } from "@tweenjs/tween.js";
import { formatNumber } from "../../../../../utils/formatNumber";

type FreeGamesType = {
  screenVersion: ScreenVersion;
  resources: ResourceState;
};

export class Wining extends Container {
  private winingAnimations = new Map<WinsType, CustomSpine>();
  private winAmountValues = new Map<WinsType, Text>();
  private winAmountConfigs = new Map<WinsType, WinAmountConfigType>();

  constructor({ resources, screenVersion }: FreeGamesType) {
    super();

    winingConfigs.forEach((config) => {
      const { position, size, winAmount } = config[screenVersion];
      const winSpine = new CustomSpine({
        spineResource: resources[config.animationType],
      });
      winSpine.alpha = 0;
      winSpine.resize(size);
      winSpine.move({
        x: position.x,
        y: position.y,
      });

      const winAmountText = new Text("9999999", {
        fontFamily: theme.fontFamily.primary,
        fontSize: winAmount.fontSize,
        fill: 0xffe690,
        fontWeight: "700",
        letterSpacing: 3,
      });
      winAmountText.alpha = 0;
      winAmountText.scale.set(winAmount.startScale);
      winAmountText.y = winAmount.start;
      winAmountText.anchor.set(0.5);

      this.addChild(winSpine, winAmountText);
      this.winingAnimations.set(config.animationType, winSpine);
      this.winAmountValues.set(config.animationType, winAmountText);
      this.winAmountConfigs.set(config.animationType, winAmount);
    });
  }

  createTween = (winValue: Text, winAmountConfig: WinAmountConfigType) => {
    const moveTween = new Tween(winValue)
      .to(
        {
          y: winAmountConfig.finish,
          scale: { x: 1, y: 1 },
          alpha: 1,
        },
        winAmountConfig.moveTweenDuration
      )
      .onComplete(() => {
        remove(moveTween);
      })
      .delay(winAmountConfig.animationDelay)
      .start();
  };

  startAnimation = async (winsType: WinsType, winAmount: number) => {
    const winSpine = this.winingAnimations.get(winsType);
    const winAmountValue = this.winAmountValues.get(winsType);
    const winAmountConfig = this.winAmountConfigs.get(winsType);

    if (!!winSpine && !!winAmountValue && !!winAmountConfig) {
      winAmountValue.text = formatNumber(winAmount, 8, true);
      winSpine.alpha = 1;
      this.createTween(winAmountValue, winAmountConfig);
      await winSpine.startAnimation({
        animationName: "animation",
      });
      winAmountValue.alpha = 0;
      winAmountValue.y = winAmountConfig.start;
      winAmountValue.scale.set(0);
      winSpine.alpha = 0;
    }
  };
}
