import { HTMLElementBase } from '../utils/env';
import { createAccordion, type AccordionReturn, type AccordionContentProps } from '@andersseen/headless-components';
import { loadMotionPlayer, type MotionPlayerLike } from '../utils/motion-loader';

const ATTR_ALLOW_MULTIPLE = 'allow-multiple';
const ATTR_ANIMATED = 'animated';

/**
 * `<and-accordion>` — Vanilla custom element accordion backed by the headless accordion.
 *
 * Items are provided as `<div title="..." value="...">...</div>` children.
 *
 * Motion is optional: add `animated` and install `@andersseen/motion`.
 */
export class VanillaAccordion extends HTMLElementBase {
  static observedAttributes = [ATTR_ALLOW_MULTIPLE, ATTR_ANIMATED];

  private accordionLogic: AccordionReturn | null = null;
  private contentPlayers = new Map<string, MotionPlayerLike>();
  private originalItems: Element[] = [];

  connectedCallback(): void {
    this.originalItems = Array.from(this.children);
    this.innerHTML = '';

    this.accordionLogic = createAccordion({
      allowMultiple: this.hasAttribute(ATTR_ALLOW_MULTIPLE),
      onValueChange: () => {
        this.dispatchEvent(new CustomEvent('andValueChange', { bubbles: true, composed: true }));
        if (!this.hasAttribute(ATTR_ANIMATED)) {
          this.render();
        }
      },
    });

    this.render();
  }

  disconnectedCallback(): void {
    for (const player of this.contentPlayers.values()) {
      player.destroy();
    }
    this.contentPlayers.clear();
  }

  attributeChangedCallback(name: string): void {
    if (!this.accordionLogic) {
      return;
    }
    if (name === ATTR_ALLOW_MULTIPLE) {
      this.accordionLogic.actions.setAllowMultiple(this.hasAttribute(ATTR_ALLOW_MULTIPLE));
    }
  }

  private getItemValue(item: Element): string {
    return item.getAttribute('value') ?? this.originalItems.indexOf(item).toString();
  }

  private render(): void {
    const state = this.accordionLogic?.state;
    const values = state ? Array.from(state.expandedItems) : [];

    this.innerHTML = `
      <style>
        :host { display: block; }
        .and-accordion { border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; }
        .and-accordion-item { border-bottom: 1px solid #e5e7eb; }
        .and-accordion-item:last-child { border-bottom: none; }
        .and-accordion-trigger {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 0.875rem 1rem; background: transparent; border: none; cursor: pointer;
          font-weight: 500; font-size: 0.9375rem; text-align: left;
        }
        .and-accordion-trigger:hover { background: #f9fafb; }
        .and-accordion-trigger:focus-visible { outline: 2px solid #171717; outline-offset: -2px; }
        .and-accordion-content { overflow: hidden; }
        .and-accordion-content[hidden] { display: none; }
        .and-accordion-content-inner { padding: 0 1rem 1rem; color: #4b5563; }
      </style>
      <div class="and-accordion" role="region">
        ${this.originalItems
          .map((item, index) => {
            const value = this.getItemValue(item);
            const isOpen = values.includes(value);
            const triggerProps = this.accordionLogic?.getTriggerProps(value) ?? {};
            const contentProps: AccordionContentProps =
              this.accordionLogic?.getContentProps(value) ?? ({} as AccordionContentProps);
            const title = item.getAttribute('title') ?? `Item ${index + 1}`;
            const { hidden: _hidden, ...contentAttrs } = contentProps;

            return `
              <div class="and-accordion-item" data-value="${value}">
                <button class="and-accordion-trigger" ${this.attrString(triggerProps)} data-value="${value}">
                  ${title}
                  <span class="and-accordion-icon" aria-hidden="true">${isOpen ? '−' : '+'}</span>
                </button>
                <div class="and-accordion-content" ${this.attrString(contentAttrs)} ${isOpen ? '' : 'hidden'} data-value="${value}">
                  <div class="and-accordion-content-inner">${item.innerHTML}</div>
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;

    this.querySelectorAll('.and-accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const value = trigger.getAttribute('data-value') ?? '';
        const wasOpen = values.includes(value);

        this.accordionLogic?.actions.toggle(value);

        if (this.hasAttribute(ATTR_ANIMATED)) {
          if (wasOpen) {
            this.render();
            const content = this.querySelector<HTMLElement>(`.and-accordion-content[data-value="${value}"]`);
            if (content) {
              this.ensurePlayer(value, content);
              void this.contentPlayers.get(value)?.play('fade-out');
            }
          } else {
            this.render();
            const content = this.querySelector<HTMLElement>(`.and-accordion-content[data-value="${value}"]`);
            if (content) {
              this.ensurePlayer(value, content);
              void this.contentPlayers.get(value)?.play('fade-in');
            }
          }
        }
      });
    });
  }

  private ensurePlayer(value: string, content: HTMLElement): void {
    if (!this.contentPlayers.has(value)) {
      loadMotionPlayer(content).then(player => {
        if (player) {
          this.contentPlayers.set(value, player);
        }
      });
    }
  }

  private attrString(props: Record<string, string | boolean | number | undefined>): string {
    return Object.entries(props)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
      .join(' ');
  }
}
