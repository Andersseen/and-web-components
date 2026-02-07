import { Component, Prop, h, Host } from '@stencil/core';
import { icons, IconName } from './icons';

@Component({
  tag: 'my-icon',
  styleUrl: 'my-icon.css',
  shadow: true,
})
export class MyIcon {
  /**
   * The name of the icon to render
   */
  @Prop() name: IconName;

  /**
   * The size of the icon (default: 24)
   */
  @Prop() size: string | number = 24;

  /**
   * The color of the icon (default: currentColor)
   */
  @Prop() color: string = 'currentColor';

  /**
   * Stroke width (default: 2)
   */
  @Prop() strokeWidth: string | number = 2;

  render() {
    const iconContent = icons[this.name];

    if (!iconContent) {
      console.warn(`Icon "${this.name}\" not found.`);
      return null;
    }

    const sizeInPx = typeof this.size === 'number' ? `${this.size}px` : this.size;

    return (
      <Host>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={sizeInPx}
          height={sizeInPx}
          viewBox="0 0 24 24"
          fill="none"
          stroke={this.color}
          stroke-width={this.strokeWidth}
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {iconContent}
        </svg>
      </Host>
    );
  }
}
