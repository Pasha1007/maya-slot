import { Sprite, Texture } from "pixi.js-legacy";
import { ResourceNames, Position } from "../modules/types";

type CreateSpriteArgsType = {
  textureName?: ResourceNames;
  position?: Position;
  anchor?: Position;
  size?: number;
  sizes?: {
    w: number;
    h: number;
  };
  emptyTexture?: boolean;
};

export const createSprite = ({
  textureName,
  position = { x: 0, y: 0 },
  anchor = { x: 0.5, y: 0.5 },
  size,
  sizes,
  emptyTexture,
}: CreateSpriteArgsType) => {
  const texture = emptyTexture ? Texture.WHITE : Texture.from(textureName || "");
  const sprite = new Sprite(texture);

  sprite.position.copyFrom(position);
  sprite.anchor.copyFrom(anchor);

  if (size) {
    const scaleFactor = size / Math.max(sprite.width, sprite.height);
    sprite.scale.set(scaleFactor);
  }

  if (sizes) {
    sprite.scale.x = sizes.w / sprite.width;
    sprite.scale.y = sizes.h / sprite.height;
  }

  return sprite;
};
