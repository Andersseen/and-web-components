import { Component, Prop, h, Host, Watch, State, Element } from '@stencil/core';
import { getIcon, type IconName } from '@andersseen/icon';

@Component({
  tag: 'and-icon',
  styleUrl: 'and-icon.css',
  shadow: true,
})
export class MyIcon {
  @Element() el: HTMLElement;

  /**
   * The name of the icon to render.
   * Must be previously registered via `registerIcons()`.
   */
  @Prop() name: IconName;

  /**
   * The size of the icon in pixels (default: 24)
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

  @State() private svgContent: string | undefined;

  componentWillLoad() {
    this.loadIcon();
  }

  @Watch('name')
  nameChanged() {
    this.loadIcon();
  }

  componentDidRender() {
    const svg = this.el.shadowRoot?.querySelector('svg');
    if (svg && this.svgContent) {
      svg.innerHTML = this.svgContent;
    }
  }

  private loadIcon() {
    this.svgContent = this.name ? getIcon(this.name) : undefined;
  }

  render() {
    if (!this.svgContent) {
      return <Host aria-hidden="true"></Host>;
    }

    const size = typeof this.size === 'number' ? this.size : parseInt(this.size, 10) || 24;

    return (
      <Host aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={this.color}
          stroke-width={this.strokeWidth}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Host>
    );
  }
}
