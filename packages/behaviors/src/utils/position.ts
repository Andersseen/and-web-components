export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface OverlayPosition {
  top: number;
  left: number;
  placement: TooltipPlacement;
}

const FLIP_MAP: Record<TooltipPlacement, TooltipPlacement> = {
  'top': 'bottom',
  'top-start': 'bottom-start',
  'top-end': 'bottom-end',
  'bottom': 'top',
  'bottom-start': 'top-start',
  'bottom-end': 'top-end',
  'left': 'right',
  'left-start': 'right-start',
  'left-end': 'right-end',
  'right': 'left',
  'right-start': 'left-start',
  'right-end': 'left-end',
};

function computeRaw(
  anchor: DOMRect,
  overlay: { width: number; height: number },
  placement: TooltipPlacement,
  offset: number,
): { top: number; left: number } {
  const { top, bottom, left, right, width, height } = anchor;
  const ow = overlay.width;
  const oh = overlay.height;

  switch (placement) {
    case 'bottom':
      return { top: bottom + offset, left: left + width / 2 - ow / 2 };
    case 'bottom-start':
      return { top: bottom + offset, left };
    case 'bottom-end':
      return { top: bottom + offset, left: right - ow };
    case 'top':
      return { top: top - oh - offset, left: left + width / 2 - ow / 2 };
    case 'top-start':
      return { top: top - oh - offset, left };
    case 'top-end':
      return { top: top - oh - offset, left: right - ow };
    case 'left':
      return { top: top + height / 2 - oh / 2, left: left - ow - offset };
    case 'left-start':
      return { top, left: left - ow - offset };
    case 'left-end':
      return { top: bottom - oh, left: left - ow - offset };
    case 'right':
      return { top: top + height / 2 - oh / 2, left: right + offset };
    case 'right-start':
      return { top, left: right + offset };
    case 'right-end':
      return { top: bottom - oh, left: right + offset };
  }
}

function fitsInViewport(
  pos: { top: number; left: number },
  overlay: { width: number; height: number },
  viewport: { width: number; height: number },
  margin = 8,
): boolean {
  return (
    pos.top >= margin &&
    pos.left >= margin &&
    pos.top + overlay.height <= viewport.height - margin &&
    pos.left + overlay.width <= viewport.width - margin
  );
}

/** Anything with a width/height, so callers aren't forced to own an element. */
export interface OverlaySize {
  width: number;
  height: number;
}

export function calculatePosition(
  anchorRect: DOMRect,
  /**
   * The overlay, either as a live element (its offset box is measured) or as
   * a plain size. The size form keeps this function pure and usable from a
   * component that hasn't mounted its popover yet — or from a unit test with
   * no DOM at all.
   */
  overlayEl: HTMLElement | OverlaySize,
  placement: TooltipPlacement,
  offset: number,
  flip: boolean,
  viewport: { width: number; height: number } = {
    width: globalThis.window?.innerWidth ?? 0,
    height: globalThis.window?.innerHeight ?? 0,
  },
): OverlayPosition {
  const overlay: OverlaySize =
    'offsetWidth' in overlayEl
      ? { width: overlayEl.offsetWidth, height: overlayEl.offsetHeight }
      : { width: overlayEl.width, height: overlayEl.height };
  const { width: ow, height: oh } = overlay;

  let resolvedPlacement = placement;
  let pos = computeRaw(anchorRect, overlay, placement, offset);

  if (flip && !fitsInViewport(pos, overlay, viewport)) {
    const flipped = FLIP_MAP[placement];
    const flippedPos = computeRaw(anchorRect, overlay, flipped, offset);
    if (fitsInViewport(flippedPos, overlay, viewport)) {
      pos = flippedPos;
      resolvedPlacement = flipped;
    }
  }

  // Clamp to viewport with margin
  const margin = 8;
  pos.left = Math.max(margin, Math.min(pos.left, viewport.width - ow - margin));
  pos.top = Math.max(margin, Math.min(pos.top, viewport.height - oh - margin));

  return { top: pos.top, left: pos.left, placement: resolvedPlacement };
}
