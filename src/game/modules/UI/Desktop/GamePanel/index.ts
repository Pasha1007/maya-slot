import { Container, Sprite } from "pixi.js-legacy";
import { createSprite } from "../../../../utils/createSprite";
import { SpinButton } from "../../entities/SpinButton";
import { AutoButton } from "../../entities/AutoButton";
import { TextFieldAdorment } from "../../entities/TextFieldAdorment";
import { theme } from "../../style";
import { TextField } from "../../entities/TextField";
import { TotalBetButton } from "../../entities/TotalBetButton";
import { Menu } from "../../entities/Menu";
import { SoundButton } from "../../entities/SoundButton";
import { Position, ScreenVersion } from "../../../types";
import { MayaManager } from "../../../manager";
import { GameController } from "../../gamePanelController";
import { FreeGamesCounter } from "../../entities/FreeGamesCounter";
import { TotalBetBlock } from "../../entities/TotalBetBlock";

type GameControlType = {
  position: Position;
  manager: MayaManager;
};

export class DesktopGamePanel extends Container {
  public spinButton: SpinButton;
  public balanceAdorment: TextFieldAdorment;
  public balance: TextField;
  public winAmountAdorment: TextFieldAdorment;
  public autoButton: AutoButton;
  public totalBetBtn: TotalBetButton;
  public winAmount: TextField;
  public menu: Menu;
  public soundButton: SoundButton;
  public freeGameCounter: FreeGamesCounter;
  public freeGameCounterBg: Sprite;
  public totalBetBlock: TotalBetBlock;
  private contoller: GameController;

  constructor({ position, manager }: GameControlType) {
    super();
    const { balance } = manager.state.gameState;
    this.position.set(position.x, position.y);
    this.contoller = new GameController({
      manager,
      ui: this,
    });

    this.spinButton = new SpinButton({
      position: { x: 635, y: 40 },
      scaleSize: 0.53,
      manager,
      onClick() {
        const { isRunSpin, isRunRotateAnimation } = manager.state.gameState;
        if (!isRunSpin) {
          manager.spin();
        }

        if (isRunRotateAnimation) {
          manager.emitter.spiningSpeedUp();
        }
      },
    });
    const btnBackground = createSprite({
      position: { x: 640, y: 40 },
      textureName: "spinButtonBckg",
      size: 270
    })
    this.autoButton = new AutoButton({
      position: { x: 578, y: 30 },
      onClick: () => {
        const { isAutoMode } = manager.getValue("autoMode");
        if (isAutoMode) {
          manager.setValue("setAutoMode", false);
          return;
        }
        const { isOpenModal } = manager.getValue("gameState");
        manager.setValue("setVisibleModal", !isOpenModal);
        manager.setValue("setActiveModalTab", "auto");
      },
      scaleSize: 0.7,
    });

    this.totalBetBtn = new TotalBetButton({
      textureName: "totalBet-d",
      position: { x: 105, y: 87 },
      onClick: () => {
        const { isOpenModal } = manager.getValue("gameState");
        manager.setValue("setVisibleModal", !isOpenModal);
        manager.setValue("setActiveModalTab", "bet");
      },
    });

    this.soundButton = new SoundButton({
      position: { x: -550, y: 85 },
    });

    this.menu = new Menu({
      position: { x: -650, y: 85 },
      onClick: () => {
        const { isOpenModal } = manager.getValue("gameState");
        manager.setValue("setVisibleModal", !isOpenModal);
        manager.setValue("setActiveModalTab", "table");
      },
    });

    this.balanceAdorment = new TextFieldAdorment({
      body: "BALANCE",
      //currencyName: manager.state.init.game_state.currency,
      fontSize: theme.desktop.fontSize.secondory,
    });

    this.balance = new TextField({
      position: { x: -420, y: 50 },
      defaultValue: balance,
      adornment: this.balanceAdorment,
      valueStyle: {
        fontSize: theme.desktop.fontSize.secondory,
      },
    });

    this.winAmountAdorment = new TextFieldAdorment({
      body: "WIN",
      //currencyName: manager.state.init.game_state.currency,
      fontSize: theme.desktop.fontSize.secondory,
    });

    this.winAmount = new TextField({
      position: { x: -155, y: 50 },
      defaultValue: Number(manager.state.sesionResult?.game_result.win_amount) || 0,
      adornment: this.winAmountAdorment,
      valueStyle: {
        fontSize: theme.desktop.fontSize.secondory,
      },
    });

    this.freeGameCounter = new FreeGamesCounter({
      position: { x: 470, y: -25 },
      screenVersion: ScreenVersion.DESKTOP,
    });

    const panel = createSprite({
      textureName: "panel-d",
      anchor: { x: 0.5, y: 0 },
      sizes: { w: 1920, h: 160 },
    });

    this.freeGameCounterBg = createSprite({
      textureName: "freeCounterBg",
      position: { x: 580, y: 0 },
    });
    this.freeGameCounterBg.visible = false;

    this.totalBetBlock = new TotalBetBlock({
      position: { x: 170, y: 40 },
      manager,
      scaleSize: 0.5,
      onClick(byttonKey) {
        manager.setValue("setTotalBet", { byttonKey });
      },
    });

    this.addChild(
      this.freeGameCounterBg,
      this.freeGameCounter,
      panel,
      this.totalBetBlock,
      btnBackground,
      this.spinButton,
      this.balance,
      this.autoButton,
      this.totalBetBtn,
      this.winAmount,
      this.menu,
      this.soundButton
    );
  }

  destroy = () => {
    this.contoller.destroy();
    this.spinButton.destroy();
  };
}
