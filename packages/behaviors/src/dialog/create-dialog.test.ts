import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createDialog } from './create-dialog';

describe('createDialog', () => {
  let initialActiveElement: HTMLElement;

  beforeEach(() => {
    initialActiveElement = document.createElement('button');
    initialActiveElement.textContent = 'Trigger';
    document.body.appendChild(initialActiveElement);
    initialActiveElement.focus();
  });

  afterEach(() => {
    // Clean up any remaining dialog nodes in the DOM
    document.querySelectorAll('[data-and-dialog-backdrop]').forEach(el => el.remove());
    document.querySelectorAll('[data-and-dialog-wrapper]').forEach(el => el.remove());
    initialActiveElement.remove();
    document.body.style.overflow = '';
  });

  it('should render dialog from string content and apply classes', () => {
    const ref = createDialog('<button id="dialog-btn">Inside Dialog</button>', {
      panelClass: 'custom-panel',
      backdropClass: 'custom-backdrop',
    });

    const backdrop = document.querySelector('[data-and-dialog-backdrop]');
    const wrapper = document.querySelector('[data-and-dialog-wrapper]');
    const panel = document.querySelector('[role="dialog"]');

    expect(backdrop).not.toBeNull();
    expect(wrapper).not.toBeNull();
    expect(panel).not.toBeNull();
    expect(panel?.classList.contains('custom-panel')).toBe(true);
    expect(backdrop?.classList.contains('custom-backdrop')).toBe(true);

    ref.close();
  });

  it('should clone content from a template element', () => {
    const template = document.createElement('template');
    template.innerHTML = '<div class="tpl-content">Template Content</div>';
    document.body.appendChild(template);

    const ref = createDialog(template);
    const content = document.querySelector('.tpl-content');
    expect(content).not.toBeNull();
    expect(content?.textContent).toBe('Template Content');

    ref.close();
    template.remove();
  });

  it('should temporarily reparent and restore an existing HTMLElement content', () => {
    const container = document.createElement('div');
    container.id = 'orig-container';
    const dialogElement = document.createElement('div');
    dialogElement.id = 'target-dialog';
    dialogElement.textContent = 'Existing Element';
    container.appendChild(dialogElement);
    document.body.appendChild(container);

    expect(container.querySelector('#target-dialog')).not.toBeNull();

    const ref = createDialog(dialogElement);

    // Should be moved into the dialog
    expect(container.querySelector('#target-dialog')).toBeNull();
    expect(document.querySelector('[role="dialog"] #target-dialog')).not.toBeNull();

    ref.close();

    // Should be restored back to container
    expect(container.querySelector('#target-dialog')).not.toBeNull();
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    container.remove();
  });

  it('should lock and unlock body scrolling', () => {
    expect(document.body.style.overflow).toBe('');

    const ref = createDialog('<div>Content</div>');
    expect(document.body.style.overflow).toBe('hidden');

    ref.close();
    expect(document.body.style.overflow).toBe('');
  });

  it('should close on backdrop click when enabled', () => {
    createDialog('<div>Content</div>', { closeOnBackdropClick: true });
    const backdrop = document.querySelector('[data-and-dialog-backdrop]') as HTMLElement;

    backdrop.click();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should not close on backdrop click when disabled', () => {
    const ref = createDialog('<div>Content</div>', { closeOnBackdropClick: false });
    const backdrop = document.querySelector('[data-and-dialog-backdrop]') as HTMLElement;

    backdrop.click();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    ref.close();
  });

  it('should close on Escape key and restore focus', () => {
    createDialog('<button id="focus-me">Focus Me</button>', { closeOnEscape: true });

    // Focus should auto-move to the first focusable inside dialog
    expect(document.activeElement?.id).toBe('focus-me');

    // Press Escape
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);

    // Dialog should close and focus return to trigger
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(initialActiveElement);
  });

  it('should skip disabled controls when auto-focusing', () => {
    createDialog('<button id="disabled-btn" disabled>Disabled</button><button id="enabled-btn">Enabled</button>');

    expect(document.activeElement?.id).toBe('enabled-btn');
  });

  it('should close when a child element with [and-dialog-close] is clicked', () => {
    createDialog('<div><button and-dialog-close id="close-btn">Close</button></div>');
    const closeBtn = document.getElementById('close-btn');
    expect(closeBtn).not.toBeNull();
    closeBtn?.click();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
});
