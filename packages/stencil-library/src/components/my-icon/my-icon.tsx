import { Component, Prop, h, Host } from '@stencil/core';
import { getIcon, IconName } from '@andersseen/icon-library';

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

  private element?: SVGElement;

  componentDidRender() {
    console.log(`[MyIcon] componentDidRender for "${this.name}"`);
    if (this.element && this.name) {
      const iconContent = getIcon(this.name);
      if (iconContent) {
        this.element.innerHTML = iconContent;
      }
    }
  }

  render() {
    console.log(`[MyIcon] rendering "${this.name}"`);
    const iconContent = getIcon(this.name);

    if (!iconContent) {
      console.warn(`[MyIcon] Icon "${this.name}" not found in registry.`);
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
          <g ref={el => (this.element = el as SVGElement)}></g>
        </svg>
      </Host>
    );
  }
}
