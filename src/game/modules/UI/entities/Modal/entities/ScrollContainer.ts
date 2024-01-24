import { Container, Graphics, InteractionEvent } from "pixi.js-legacy";
import { DesktopContent } from "../../../Desktop/DesktopModal/Content";
import { MobileContent } from "../../../Mobile/MobileModal/Content";
import { ScreenVersion } from "../../../../types";

type ScrollContainerType = {
  content: DesktopContent | MobileContent;
  maskSize: { w: number; h: number };
  canvasWrapper: HTMLDivElement;
  screenVersion: ScreenVersion
};

export class ScrollContainer extends Container {
  private screenVersion: ScreenVersion
  private contentMask = new Graphics();
  private slider = new Graphics();
  private sliderTrack = new Graphics();
  private isDragging: boolean = false;
  private trackH: number;
  private clickOnSliderPosition!: number;
  private prev: number = 0;
  public content: DesktopContent | MobileContent;

  constructor({ content, maskSize, canvasWrapper, screenVersion }: ScrollContainerType) {
    super();
    this.screenVersion = screenVersion
    this.trackH = maskSize.h;
    this.content = content;
    this.interactive = true;
    this.contentMask = this.contentMask.beginFill(0xfff, 0.3).drawRect(0, 0, maskSize.w, maskSize.h);

    const scrollBarOffsetX = 35;
    this.slider
      .beginFill(0x2D7E89)
      .lineStyle(1.5, 0xFCEF68)
      .drawRoundedRect(maskSize.w + scrollBarOffsetX, 0, 7, 100, 8)
      .endFill();

    this.slider.position.x =
      this.slider.position.x - this.slider.width / 2 + this.slider.line.width / 2;
    this.slider.interactive = true;
    this.slider.buttonMode = true;

    this.sliderTrack
      .lineStyle(2, 0x535f66)
      .moveTo(maskSize.w + scrollBarOffsetX, 0)
      .lineTo(maskSize.w + scrollBarOffsetX, maskSize.h);

    this.addChild(this.content, this.sliderTrack, this.slider, this.contentMask);
    this.content.mask = this.contentMask;

    this.on("pointerover", () => {
      canvasWrapper.addEventListener("wheel", this.onWheel);
    });
    this.on("pointerout", () => {
      canvasWrapper.removeEventListener("wheel", this.onWheel);
    });

    this.slider
      .on("mousedown", this.onScrollbarDown)
      .on("mouseup", this.onScrollbarUp)
      .on("mousemove", (event) => {
        this.onScrollbarMove({ direction: -1, event });
      })
      .on("pointerupoutside", this.onScrollbarUp);

    this.on("touchstart", this.onScrollbarDown)
      .on("touchend", this.onScrollbarUp)
      .on("touchmove", (event) => {
        this.onScrollbarMove({ direction: 1, event });
      })
      .on("touchendoutside", this.onScrollbarUp);
  }

  public onWheel = (event: WheelEvent) => {
    event.preventDefault();
    this.onScrollbarMove({ direction: -1, wheel: event.deltaY * 0.8 });
  };

  private onScrollbarDown = (event: InteractionEvent) => {
    this.isDragging = true;
    const localPos = event.data.getLocalPosition(this.contentMask);
    this.clickOnSliderPosition = localPos.y;
  };

  private onScrollbarUp = () => {
    this.isDragging = false;
    this.prev = this.content.position.y;
  };

  private onScrollbarMove = ({
    direction,
    event,
    wheel,
  }: {
    direction: number;
    event?: InteractionEvent;
    wheel?: number;
  }) => {
    if (this.isDragging || !!wheel) {
      const coeff = this.screenVersion === ScreenVersion.MOBILE ? this.trackH / this.content.height : 1

      const newPosition = !wheel ? event?.data.getLocalPosition(this).y : 0;
      const newScrollbarY = !wheel ? ((newPosition || 0) - this.clickOnSliderPosition) * coeff : wheel;

      const scrollPercentage = newScrollbarY / (this.trackH - this.slider.height);
      const newContentY =
        direction * (scrollPercentage * (this.content.height - this.contentMask.height)) +
        this.prev;

      const minContentY = this.contentMask.height - this.content.height;
      const maxContentY = this.contentMask.y;

      this.content.position.y = Math.min(maxContentY, Math.max(minContentY, newContentY));
      if (!!wheel) this.prev = this.content.position.y;

      const contentYPercentage =
        -this.content.position.y / (this.content.height - this.contentMask.height);

      const newSliderY = contentYPercentage * (this.trackH - this.slider.height);
      this.slider.position.y = newSliderY;
    }
  };

  scrollToTop() {
    this.prev = 0
    this.clickOnSliderPosition = 0
    this.content.position.y = 0;
    this.slider.position.y = 0;
  }

  updateScrollbarVisibility() {
    if (this.content.height <= this.contentMask.height) {
      this.slider.visible = false;
      this.sliderTrack.visible = false;
    } else {
      this.slider.visible = true;
      this.sliderTrack.visible = true;
    }
  }

  destroy = () => {
    this.slider.off("mousedown", this.onScrollbarDown);
    this.slider.off("mouseup", this.onScrollbarUp);
    this.slider.off("pointermove", this.onScrollbarMove);
    this.slider.off("pointerupoutside", this.onScrollbarUp);
    this.contentMask.off("touchstart", this.onScrollbarDown);
    this.contentMask.off("touchend", this.onScrollbarUp);
    this.contentMask.off("touchmove", this.onScrollbarMove);
    this.contentMask.off("touchendoutside", this.onScrollbarUp);
  };
}
