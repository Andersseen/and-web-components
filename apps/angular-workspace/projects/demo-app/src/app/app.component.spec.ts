import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { render } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  async function setup() {
    return render(AppComponent, {
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  }

  it('creates the app', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('exposes the demo title', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance.title).toBe('Andersseen Web Components Demo');
  });

  it('renders the router outlet', async () => {
    const { container } = await setup();
    expect(container.querySelector('router-outlet')).toBeInTheDocument();
  });
});
