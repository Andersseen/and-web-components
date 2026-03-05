import { Component, Prop, h, Host, Watch, State, Element } from '@stencil/core';
import { getIcon, type IconName } from '@andersseen/icon';

@Component({
  tag: 'and-icon',
  styleUrl: 'and-icon.css',
  shadow: true,
})
export class AndIcon {
  @Element() el: HTMLElement;

  /** The name of the icon to render (must be registered via `registerIcons()`). */
  @Prop({ reflect: true }) name: IconName;

  /** The size of the icon in pixels. */
  @Prop({ reflect: true }) size: string | number = 24;

  /** The stroke/fill color (defaults to currentColor for theme inheritance). */
  @Prop({ reflect: true }) color: string = 'currentColor';

  /** SVG stroke width. */
  @Prop({ reflect: true }) strokeWidth: string | number = 2;

  @State() private svgContent: string | undefined;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.loadIcon();
  }

  componentDidRender() {
    const svg = this.el.shadowRoot?.querySelector('svg');
    if (svg && this.svgContent) {
      svg.innerHTML = this.svgContent;
    }
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('name')
  nameChanged() {
    this.loadIcon();
  }

  /* ── Helpers ────────────────────────────────────────────────────── */

  private loadIcon() {
    this.svgContent = this.name ? getIcon(this.name) : undefined;
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    if (!this.svgContent) {
      return <Host aria-hidden="true" role="img" />;
    }

    const resolvedSize = typeof this.size === 'number' ? this.size : parseInt(this.size, 10) || 24;

    return (
      <Host aria-hidden="true" role="img">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={resolvedSize}
          height={resolvedSize}
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
