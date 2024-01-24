import { Container } from "pixi.js-legacy";
import { ResourceState } from "../../../types";
import { CustomSpine } from "../Spine";
import { SpineBgController } from "./contloller";
import { MayaManager } from "../../../manager";

type SpineBgPropsType = {
  resouses: ResourceState;
  manager: MayaManager;
};

export class SpineBg extends Container {
  private spineGameBg: CustomSpine;
  private spineGameFrame: CustomSpine;
  private controller: SpineBgController;

  constructor({ resouses, manager }: SpineBgPropsType) {
    super();
    this.controller = new SpineBgController(this, manager);
    this.spineGameBg = new CustomSpine({
      spineResource: resouses["background"],
    });
    this.spineGameFrame = new CustomSpine({
      spineResource: resouses["slot_frame"],
    });
    this.spineGameBg.resize(1925);
    this.spineGameFrame.sizes(1050, 990);
    this.spineGameBg.move({ x: 0, y: 535 });
    this.spineGameFrame.move({ x: 0, y: 960 });

    const animationNames1 = this.spineGameBg.spine.spineData.animations.map((animation) => animation.name);
    const animationNames2 = this.spineGameFrame.spine.spineData.animations.map((animation) => animation.name);

    if (animationNames1.length > 0) {
      const firstAnimation = animationNames1[0]
      this.spineGameBg.startAnimation({
        animationName: firstAnimation,
        loop: true,
      });

    } else {
      console.error('No animations found in Spine data.');

    }

    if (animationNames2.length > 0) {
      const firstAnimation = animationNames2[0]
      this.spineGameFrame.startAnimation({
        animationName: firstAnimation,
        loop: true,
      });

    } else {
      console.error('No animations found in Spine data.');

    }
    this.addChild(this.spineGameBg, this.spineGameFrame)
  }

  startAnimation = (animationName: string) => {
    this.spineGameBg.startAnimation({
      animationName,
      loop: true,
    });
    this.spineGameFrame.startAnimation({
      animationName,
      loop: true
    })
  };

  // startAnimation = (animationName: string) => {
  //   // Assuming `this.spineGameBg` is your Spine instance

  //   // Find the animation in the Spine data
  //   const animation = this.spineGameBg.spine.spineData.findAnimation(animationName);

  //   // Check if the animation is found
  //   if (animation) {
  //     // Clear any existing animation
  //     this.spineGameBg.clearAnimation();

  //     // Start the specified animation with looping
  //     this.spineGameBg.startAnimation({
  //       animationName,
  //       loop: true,
  //     });
  //   } else {
  //     console.error(`Animation '${animationName}' not found.`);
  //   }
  // };
  destroy = () => {
    this.controller.destroy();
  };
}
