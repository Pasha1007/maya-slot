import { PixiApp } from "./modules/App";
import { MayaManager } from "./modules/manager";
import { PostError } from "./modules/manager/utils/postFetch";
import { getTicketValueFromUrl } from "./utils/getTicketValueFromUrl";

type OptionsType = {
  onError: (error: PostError) => void;
};

type MayaSlotType = {
  canvasWrapper: HTMLDivElement;
  options?: OptionsType;
};

export class Maya {
  private app: PixiApp;
  private manager: MayaManager;
  public options: OptionsType;

  constructor({ canvasWrapper, options }: MayaSlotType) {
    const ticket = getTicketValueFromUrl(window.location.href) || "Something went wrong";
    this.options = options as OptionsType;
    this.manager = new MayaManager(ticket, this);
    this.app = new PixiApp(canvasWrapper, this.manager);
  }

  destroy = () => {
    this.app.destroy();
  };
}
