import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-pagination';
import '../and-icon/and-icon';

describe('and-pagination', () => {
  it('renders navigation landmark and page buttons', async () => {
    const { root } = await render(<and-pagination total-pages={5} current-page={1}></and-pagination>);

    const nav = root.shadowRoot.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav.getAttribute('aria-label')).toBe('Pagination');

    const buttons = root.shadowRoot.querySelectorAll('button');
    expect(buttons.length).toBe(7); // previous + 5 pages + next
  });

  it('disables previous button on first page and next on last page', async () => {
    const { root } = await render(<and-pagination total-pages={3} current-page={1}></and-pagination>);

    const buttons = root.shadowRoot.querySelectorAll('button');
    expect(buttons[0].hasAttribute('disabled')).toBe(true);
    expect(buttons[buttons.length - 1].hasAttribute('disabled')).toBe(false);
  });

  it('disables next button on last page', async () => {
    const { root } = await render(<and-pagination total-pages={3} current-page={3}></and-pagination>);

    const buttons = root.shadowRoot.querySelectorAll('button');
    expect(buttons[0].hasAttribute('disabled')).toBe(false);
    expect(buttons[buttons.length - 1].hasAttribute('disabled')).toBe(true);
  });

  it('marks current page with aria-current and active styles', async () => {
    const { root } = await render(<and-pagination total-pages={5} current-page={2}></and-pagination>);

    const activeButton = root.shadowRoot.querySelector('button[aria-current="page"]');
    expect(activeButton).toBeTruthy();
    expect(activeButton.textContent).toBe('2');
    expect(activeButton.className).toContain('bg-primary');
  });

  it('emits andPageChange when a page button is clicked', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <and-pagination total-pages={5} current-page={1}></and-pagination>,
    );

    const pageChangeSpy = spyOnEvent('andPageChange');
    const pageThree = root.shadowRoot.querySelector('button[aria-label="Page 3"]') as HTMLElement;
    pageThree.click();
    await waitForChanges();

    expect(pageChangeSpy).toHaveReceivedEventTimes(1);
    expect(pageChangeSpy).toHaveReceivedEventDetail(3);
  });

  it('emits andPageChange with previous page', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <and-pagination total-pages={5} current-page={3}></and-pagination>,
    );

    const pageChangeSpy = spyOnEvent('andPageChange');
    const prevButton = root.shadowRoot.querySelector('button[aria-label="Go to previous page"]') as HTMLElement;
    prevButton.click();
    await waitForChanges();

    expect(pageChangeSpy).toHaveReceivedEventTimes(1);
    expect(pageChangeSpy).toHaveReceivedEventDetail(2);
  });

  it('emits andPageChange with next page', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <and-pagination total-pages={5} current-page={3}></and-pagination>,
    );

    const pageChangeSpy = spyOnEvent('andPageChange');
    const nextButton = root.shadowRoot.querySelector('button[aria-label="Go to next page"]') as HTMLElement;
    nextButton.click();
    await waitForChanges();

    expect(pageChangeSpy).toHaveReceivedEventTimes(1);
    expect(pageChangeSpy).toHaveReceivedEventDetail(4);
  });
});
