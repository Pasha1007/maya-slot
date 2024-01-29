import { Container, Sprite, Text } from "pixi.js-legacy";
import { theme } from "../../style";
import { Position, ScreenVersion } from "../../../types";
import { createSprite } from "../../../../utils/createSprite";

type FreeGamesCounterType = {
  position: Position;
  screenVersion: ScreenVersion;
};

export class FreeGamesCounter extends Container {
  private freeGamesTotal!: number;
  private counterText: Text;
  private freeSpinesBg: Sprite;

  constructor({ position, screenVersion }: FreeGamesCounterType) {
    super();

    this.position.set(600, -120);
    this.visible = false;
    const freeSpinsTextContainer = new Container();
    this.freeSpinesBg = createSprite({
      textureName: "freeCounterBg",
      sizes: { w: 270, h: 70 },
    });
    const freeGames = new Text("FREE SPINS", {
      fontFamily: theme.fontFamily.primary,
      fontSize: theme[screenVersion].fontSize.primary,
      fill: theme.color.purple,
      fontWeight: "500",
    });
    freeGames.anchor.set(0.5, 0.9)

    this.counterText = new Text("2/4", {
      fontFamily: theme.fontFamily.primary,
      fontSize: theme[screenVersion].fontSize.primary,
      fill: theme.color.purple,
      fontWeight: "700",
    });

    this.counterText.anchor.set(0.5, -0.1)
    freeSpinsTextContainer.addChild(this.freeSpinesBg, freeGames, this.counterText);
    // freeSpinsTextContainer.x = 850;
    // freeSpinsTextContainer.y = -70;
    this.addChild(freeSpinsTextContainer)
  }

  setFreeGames = (numberOfSpins: number, freeGamesTotal: number) => {
    if (freeGamesTotal) this.freeGamesTotal = freeGamesTotal;
    this.counterText.text = `${this.freeGamesTotal - numberOfSpins}/${this.freeGamesTotal}`;
  };

  setVisible = (visible: boolean) => {
    this.visible = visible;
  };
}
