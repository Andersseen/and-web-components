import { Component, Prop, h, Host, Watch, State } from '@stencil/core';
import { getIcon, type IconName } from '@andersseen/icon';

/**
 * Renders an SVG icon registered via `registerIcons()`/`registerAllIcons()`
 * from `@andersseen/icon`. Always `aria-hidden="true"` — it's treated as
 * purely decorative, so any accessible name (e.g. "Close", "Copy") must
 * come from the interactive element it's inside of (`aria-label` on a
 * button, visible text, etc.), never from the icon itself.
 *
 * @example
 * ```html
 * <and-icon name="chevron-down" size="16"></and-icon>
 * ```
 */
@Component({
  tag: 'and-icon',
  styleUrl: 'and-icon.css',
  shadow: true,
})
export class AndIcon {
  /** The name of the icon to render (must be registered via `registerIcons()`). */
  @Prop({ reflect: true }) name!: IconName;

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
          ref={svg => {
            if (svg) {
              svg.innerHTML = this.svgContent ?? '';
            }
          }}
        />
      </Host>
    );
  }
}
