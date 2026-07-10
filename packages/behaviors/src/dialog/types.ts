export type DialogPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface DialogConfig {
  /**
   * The position of the dialog on the screen.
   * @default 'center'
   */
  position: DialogPosition;

  /**
   * Whether to show a backdrop behind the dialog.
   * @default true
   */
  backdrop: boolean;

  /**
   * Whether the dialog should close when the backdrop is clicked.
   * @default true
   */
  closeOnBackdropClick: boolean;

  /**
   * Whether the dialog should close when the Escape key is pressed.
   * @default true
   */
  closeOnEscape: boolean;

  /**
   * Custom CSS class for the dialog container.
   */
  panelClass?: string | string[];

  /**
   * Custom CSS class for the backdrop.
   */
  backdropClass?: string | string[];

  /**
   * Width of the dialog.
   */
  width?: string;

  /**
   * Height of the dialog.
   */
  height?: string;
}

export const DEFAULT_DIALOG_CONFIG: DialogConfig = {
  position: 'center',
  backdrop: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
};
