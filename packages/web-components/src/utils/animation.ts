import { createMotionPlayer, type MotionPlayer } from '@andersseen/motion';

type AnimationName =
  | 'fade-in'
  | 'fade-out'
  | 'fade-zoom-in'
  | 'fade-zoom-out'
  | 'slide-in-from-top'
  | 'slide-in-from-bottom'
  | 'slide-in-from-left'
  | 'slide-in-from-right'
  | 'slide-out-to-top'
  | 'slide-out-to-bottom'
  | 'slide-out-to-left'
  | 'slide-out-to-right';

export interface AnimationController {
  enter(): Promise<void>;
  exit(): Promise<void>;
  destroy(): void;
}

const ENTRANCE_MAP: Record<string, AnimationName> = {
  modal: 'fade-zoom-in',
  drawer: 'slide-in-from-right',
  dropdown: 'fade-in',
  tooltip: 'fade-in',
  toast: 'slide-in-from-right',
  accordion: 'fade-in',
  alert: 'fade-in',
};

const EXIT_MAP: Record<string, AnimationName> = {
  modal: 'fade-zoom-out',
  drawer: 'slide-out-to-right',
  dropdown: 'fade-out',
  tooltip: 'fade-out',
  toast: 'slide-out-to-right',
  accordion: 'fade-out',
  alert: 'fade-out',
};

/**
 * Attach an imperative entrance/exit animation player to an element.
 * The keyframe names must exist in @andersseen/motion/style.css.
 */
export function attachAnimation(element: HTMLElement, component: keyof typeof ENTRANCE_MAP): AnimationController {
  const player: MotionPlayer = createMotionPlayer(element);

  return {
    async enter(): Promise<void> {
      await player.play(ENTRANCE_MAP[component]);
    },
    async exit(): Promise<void> {
      await player.play(EXIT_MAP[component]);
    },
    destroy(): void {
      player.destroy();
    },
  };
}

/**
 * Helper for components that need to keep rendering while an exit
 * animation plays. Returns a controller with `requestOpen` and
 * `requestClose` methods that handle the closing flag automatically.
 */
export function createOpenCloseAnimation(
  getElement: () => HTMLElement | null,
  component: keyof typeof ENTRANCE_MAP,
  options: {
    onEnter?: () => void;
    onExitStart?: () => void;
    onExitEnd?: () => void;
  } = {},
): {
  enter(): Promise<void>;
  exit(): Promise<void>;
  destroy(): void;
} {
  let player: AnimationController | null = null;

  const getPlayer = (): AnimationController => {
    if (!player) {
      const el = getElement();
      if (!el) {
        throw new Error(`No element available for ${component} animation`);
      }
      player = attachAnimation(el, component);
    }
    return player;
  };

  return {
    async enter(): Promise<void> {
      options.onEnter?.();
      await getPlayer().enter();
    },
    async exit(): Promise<void> {
      options.onExitStart?.();
      await getPlayer().exit();
      options.onExitEnd?.();
    },
    destroy(): void {
      player?.destroy();
      player = null;
    },
  };
}
