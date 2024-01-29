import { Container } from "pixi.js-legacy";
import { SpinButton } from "../../entities/SpinButton";
import { TextFieldAdorment } from "../../entities/TextFieldAdorment";
import { theme } from "../../style";
import { TextField } from "../../entities/TextField";
import { SoundButton } from "../../entities/SoundButton";
import { Position, ScreenVersion } from "../../../types";
import { MayaManager } from "../../../manager";
import { GameController } from "../../gamePanelController";
import { FreeGamesCounter } from "../../entities/FreeGamesCounter";
import { TotalBetBlock } from "../../entities/TotalBetBlock";
import { Menu } from "../../entities/Menu";
import { AutoButton } from "../../entities/AutoButton";

type GameControlType = {
  position: Position;
  manager: MayaManager;
};

export class MobileGamePanel extends Container {
  public spinButton: SpinButton;
  public balanceAdorment: TextFieldAdorment;
  public balance: TextField;
  public winAmountAdorment: TextFieldAdorment;
  public winAmount: TextField;
  public soundButton: SoundButton;
  public freeGameCounter: FreeGamesCounter;
  public totalBetBlock!: TotalBetBlock;
  public menu: Menu;
  public autoButton: AutoButton;
  private controller: GameController;


  constructor({ position, manager }: GameControlType) {
    super();
    this.position.set(position.x, position.y);
    const { balance } = manager.state.gameState;
    this.controller = new GameController({
      manager,
      ui: this,
    });

    this.spinButton = new SpinButton({
      position: { x: 37, y: 850 },
      onClick() {
        const { isRunSpin, isRunRotateAnimation } = manager.state.gameState;
        if (!isRunSpin) {
          manager.spin();
        }

        if (isRunRotateAnimation) {
          manager.emitter.spiningSpeedUp();
        }
      },
      scaleSize: 0.63,
      manager,
    });
    this.autoButton = new AutoButton({
      position: { x: 180, y: 920 },
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
      scaleSize: 0.2,

    });
    this.autoButton.scale.set(0.45)
    this.autoButton.position.set(200, 865)
    this.autoButton.visible = true;

    this.soundButton = new SoundButton({
      position: { x: -165, y: 920 },
    });
    this.soundButton.scale.set(0.9)
    this.menu = new Menu({
      position: { x: -250, y: 920 },
      onClick: () => {
        const { isOpenModal } = manager.getValue("gameState");
        manager.setValue("setVisibleModal", !isOpenModal);
        manager.setValue("setActiveModalTab", "bet");
      },
    });
    this.menu.scale.set(0.9)

    this.balanceAdorment = new TextFieldAdorment({
      body: "BALANCE",
      fontSize: theme.mobile.fontSize.modalTitle,
    });

    this.balance = new TextField({
      position: { x: -300, y: 20 },
      defaultValue: balance,
      adornment: this.balanceAdorment,
      valueStyle: {
        fontSize: theme.mobile.fontSize.primary,
      },
    });

    this.winAmountAdorment = new TextFieldAdorment({
      body: "WIN",
      fontSize: theme.mobile.fontSize.modalTitle,
    });

    this.winAmount = new TextField({
      position: { x: 0, y: 20 },
      defaultValue: Number(manager.state.sesionResult?.game_result.win_amount) || 0,
      adornment: this.winAmountAdorment,
      valueStyle: {
        fontSize: theme.mobile.fontSize.primary,
      },
    });

    this.freeGameCounter = new FreeGamesCounter({
      position: { x: 0, y: 738 },
      screenVersion: ScreenVersion.MOBILE,
    });
    this.freeGameCounter.position.set(0, 720)

    this.totalBetBlock = new TotalBetBlock({
      position: { x: -247, y: 1020 },
      manager,
      scaleSize: 0.65,
      onClick(byttonKey) {
        manager.setValue("setTotalBet", { byttonKey });
      },
    });

    this.addChild(
      this.soundButton,
      this.menu,
      this.balance,
      this.winAmount,
      this.freeGameCounter,
      this.totalBetBlock,
      this.spinButton,
      this.autoButton,

    );
  }

  destroy = () => {
    this.controller.destroy();
    this.spinButton.destroy();
  };
}
