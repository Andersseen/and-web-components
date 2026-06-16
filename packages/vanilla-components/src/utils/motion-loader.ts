/**
 * Optional motion loader.
 *
 * @andersseen/motion is a peer dependency. If the consumer installs it and
 * adds the `animated` attribute, components will dynamically import it and
 * play animations. Otherwise the components work without motion.
 */

export interface MotionPlayerLike {
  play(name: string): Promise<void>;
  stop(): void;
  destroy(): void;
}

let motionModule: typeof import('@andersseen/motion') | null = null;

export async function loadMotionPlayer(element: HTMLElement): Promise<MotionPlayerLike | null> {
  if (motionModule) {
    return motionModule.createMotionPlayer(element);
  }

  try {
    motionModule = await import('@andersseen/motion');
    return motionModule.createMotionPlayer(element);
  } catch {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'test') {
      console.warn('[@andersseen/vanilla-components] Install @andersseen/motion to use the `animated` attribute.');
    }
    return null;
  }
}
