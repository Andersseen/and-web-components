import { createAccordion, type AccordionReturn, type AccordionContentProps } from '@andersseen/headless-components';
import { createMotionPlayer, type MotionPlayer } from '@andersseen/motion';

const ATTR_ALLOW_MULTIPLE = 'allow-multiple';
const ATTR_ANIMATED = 'animated';

/**
 * `<and-accordion>` — Vanilla custom element accordion backed by the headless accordion.
 *
 * Items are provided as `<div title="..." value="...">...</div>` children.
 */
export class VanillaAccordion extends HTMLElement {
  static observedAttributes = [ATTR_ALLOW_MULTIPLE, ATTR_ANIMATED];

  private accordionLogic: AccordionReturn | null = null;
  private contentPlayers = new Map<string, MotionPlayer>();
  private originalItems: Element[] = [];

  connectedCallback(): void {
    this.originalItems = Array.from(this.children);
    this.innerHTML = '';

    this.accordionLogic = createAccordion({
      allowMultiple: this.hasAttribute(ATTR_ALLOW_MULTIPLE),
      onValueChange: () => {
        this.dispatchEvent(new CustomEvent('andValueChange', { bubbles: true, composed: true }));
        this.render();
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
                  <span aria-hidden="true">${isOpen ? '−' : '+'}</span>
                </button>
                <div class="and-accordion-content" ${this.attrString(contentAttrs)} ${isOpen ? '' : 'hidden'}>
                  ${item.innerHTML}
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
          const item = trigger.closest('.and-accordion-item');
          const content = item?.querySelector('.and-accordion-content') as HTMLElement | null;
          if (content) {
            this.ensurePlayer(value, content);
            void this.contentPlayers.get(value)?.play(wasOpen ? 'fade-out' : 'fade-in');
          }
        }
      });
    });

    if (this.hasAttribute(ATTR_ANIMATED)) {
      this.querySelectorAll<HTMLElement>('.and-accordion-content').forEach(content => {
        const item = content.closest('.and-accordion-item');
        const value = item?.getAttribute('data-value') ?? '';
        this.ensurePlayer(value, content);
      });
    }
  }

  private ensurePlayer(value: string, content: HTMLElement): void {
    if (!this.contentPlayers.has(value)) {
      this.contentPlayers.set(value, createMotionPlayer(content));
    }
  }

  private attrString(props: Record<string, string | boolean | number | undefined>): string {
    return Object.entries(props)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
      .join(' ');
  }
}
