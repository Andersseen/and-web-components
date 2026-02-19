import {
  registerIcons,
  LAYERS,
  INFO,
  STAR,
  BOX,
  LAYOUT,
  IMAGE,
  CHEVRON_DOWN,
  FILE_TEXT,
  LIST_ORDERED,
  BELL,
  MESSAGE_SQUARE,
  EYE,
  MAXIMIZE,
  MOVE_HORIZONTAL,
  MOUSE_POINTER,
  POINTER,
  SLIDERS,
  LIST,
  CODE,
  SUN,
  MOON,
  ALL_ICONS,
} from '@andersseen/icon-library';

/**
 * Registers common icons used throughout the application.
 * This should be called before bootstrapping the application.
 */
export const initializeIcons = () => {
  // We can register specific icons for tree-shaking
  registerIcons({
    layers: LAYERS,
    info: INFO,
    star: STAR,
    box: BOX,
    layout: LAYOUT,
    image: IMAGE,
    'chevron-down': CHEVRON_DOWN,
    'file-text': FILE_TEXT,
    'list-ordered': LIST_ORDERED,
    bell: BELL,
    'message-square': MESSAGE_SQUARE,
    eye: EYE,
    maximize: MAXIMIZE,
    'move-horizontal': MOVE_HORIZONTAL,
    'mouse-pointer': MOUSE_POINTER,
    pointer: POINTER,
    sliders: SLIDERS,
    list: LIST,
    code: CODE,
    sun: SUN,
    moon: MOON,
  });

  // Since it's a demo app, we also register ALL_ICONS to support the icons demo page
};
