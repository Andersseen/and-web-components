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

export interface TooltipConfig {
  /** Text content of the tooltip. Can also be set via the `and-tooltip` attribute. */
  content: string;
  /** Preferred placement relative to the anchor element. Default: 'top'. */
  placement: TooltipPlacement;
  /** Delay in ms before showing the tooltip. Default: 200. */
  showDelay: number;
  /** Delay in ms before hiding the tooltip. Default: 0. */
  hideDelay: number;
  /** Offset in px between the anchor and the tooltip. Default: 8. */
  offset: number;
  /** When true the tooltip will not be shown. Default: false. */
  disabled: boolean;
  /** Whether to allow hovering the tooltip content. Default: false. */
  interactive: boolean;
}

export const DEFAULT_TOOLTIP_CONFIG: TooltipConfig = {
  content: '',
  placement: 'top',
  showDelay: 200,
  hideDelay: 0,
  offset: 8,
  disabled: false,
  interactive: false,
};
