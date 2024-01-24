import { ISkeletonData, Spine } from "pixi-spine";
import { Container, LoaderResource } from "pixi.js-legacy";
import { Position } from "../../../types";


type StartAnimationType = {
  animationName: string;
  loop?: boolean;
  onComplete?: () => void;
  repeat?: number;
  visible?: true;
};

type CustomSpineType = {
  spineResource?: LoaderResource;
  alpha?: number;
};
export class CustomSpine extends Container {
  public spine!: Spine;
  public h!: number;
  public w!: number;

  constructor({ spineResource, alpha = 1 }: CustomSpineType) {
    super();
    console.log(spineResource)
    if (spineResource) {
      this.spine = new Spine(spineResource.spineData as ISkeletonData<any>);
      this.addChild(this.spine);
      this.spine.alpha = alpha;
    }
  }
  resize(size: number) {
    this.spine.scale.x = this.spine.scale.y = Math.min(
      size / this.spine.width,
      size / this.spine.height
    );

    this.h = this.spine.height / 2;
    this.w = this.spine.width;
  }
  sizes(w: number, h: number) {
    this.width = w
    this.height = h
  }

  move(position: Position) {
    this.spine.position.set(position.x, position.y);
  }

  public startAnimation = async ({
    animationName,
    loop = false,
    repeat = 0,
    onComplete,
    visible = true,
  }: StartAnimationType) => {
    await new Promise<void>((resolve) => {
      this.spine.alpha = visible ? 1 : 0;

      let counter = 1;
      this.clearAnimation();
      this.spine.state.addListener({
        complete: () => {
          if (counter < repeat) this.spine.state.setAnimation(0, animationName, loop);
          else {
            onComplete && onComplete();
            resolve();
          }
          counter++;
        },
      });

      this.spine.autoUpdate = true;
      this.spine.state.setAnimation(0, animationName, loop);
    });
  };

  clearAnimation = () => {
    this.spine.state.clearTracks();
    // @ts-ignore
    this.spine.lastTime = null;
    this.spine.state.listeners = [];
  };

  pauseAnimation(pause: boolean) {
    this.spine.state.timeScale = pause ? 0 : 1
  }

  setAnimationSpeed = (speed: number) => {
    this.spine.state.timeScale = speed;
  };

  setSpineFirstFrame = (animationName: string) => {
    this.spine.autoUpdate = false;
    this.spine?.state.setAnimation(0, animationName, false);
    this.spine?.update(0);
  };
}
