import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createTabs } from '@andersseen/headless-core';

@Component({
  selector: 'app-tabs-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-page">
      <!-- Header -->
      <header class="demo-header">
        <h1 class="demo-title">Tabs</h1>
        <p class="demo-description">
          A set of layered sections of content — known as tab panels — that are
          displayed one at a time.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="demo-section">
        <h2 class="section-title">Preview</h2>
        <div class="preview-card">
          <div class="tabs-root">
            <!-- Tab List -->
            <div class="tabs-list">
              <button
                class="tab-trigger"
                [class.is-active]="activeTab() === 'account'"
                (click)="selectTab('account')"
              >
                Account
              </button>
              <button
                class="tab-trigger"
                [class.is-active]="activeTab() === 'password'"
                (click)="selectTab('password')"
              >
                Password
              </button>
            </div>

            <!-- Account Panel -->
            @if (activeTab() === 'account') {
              <div class="tab-content">
                <h3 class="tab-content-title">Account</h3>
                <p class="tab-content-desc">
                  Make changes to your account here. Click save when you're
                  done.
                </p>

                <div class="form-group">
                  <label class="form-label">Name</label>
                  <input class="form-input" type="text" value="Pedro Duarte" />
                </div>

                <div class="form-group">
                  <label class="form-label">Username</label>
                  <input class="form-input" type="text" value="@peduarte" />
                </div>

                <div class="form-actions">
                  <button class="btn-save">Save changes</button>
                </div>
              </div>
            }

            <!-- Password Panel -->
            @if (activeTab() === 'password') {
              <div class="tab-content">
                <h3 class="tab-content-title">Password</h3>
                <p class="tab-content-desc">
                  Change your password here. After saving, you'll be logged out.
                </p>

                <div class="form-group">
                  <label class="form-label">Current password</label>
                  <input class="form-input" type="password" />
                </div>

                <div class="form-group">
                  <label class="form-label">New password</label>
                  <input class="form-input" type="password" />
                </div>

                <div class="form-group">
                  <label class="form-label">Confirm password</label>
                  <input class="form-input" type="password" />
                </div>

                <div class="form-actions">
                  <button class="btn-save">Update password</button>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="demo-section">
        <h2 class="section-title">Usage</h2>
        <div class="code-block">
          <pre><code>import {{ '{' }} createTabs {{ '}' }} from '@andersseen/headless-core';

const tabs = createTabs({{ '{' }}
    defaultValue: 'account'
{{ '}' }});

// Select a tab
tabs.actions.selectTab('account');

// Check if selected
tabs.queries.isSelected('account'); // true</code></pre>
        </div>
      </section>

      <!-- Raw Example -->
      <section class="demo-section">
        <div class="headless-header">
          <h2 class="section-title">Headless Implementation</h2>
          <span class="badge">Zero Styles</span>
        </div>

        <p class="demo-description" style="margin-bottom: 1.5rem;">
          Manages tab selection, ARIA roles, and keyboard navigation — you
          control the rendering.
        </p>

        <div class="headless-area">
          <div>
            <div style="display: flex; gap: 4px; margin-bottom: 8px;">
              <button
                [style.font-weight]="
                  activeTab() === 'account' ? 'bold' : 'normal'
                "
                (click)="selectTab('account')"
              >
                Account
              </button>
              <button
                [style.font-weight]="
                  activeTab() === 'password' ? 'bold' : 'normal'
                "
                (click)="selectTab('password')"
              >
                Password
              </button>
            </div>
            <div style="border: 1px solid #999; padding: 12px;">
              @if (activeTab() === 'account') {
                <p style="margin: 0;">Account panel content goes here.</p>
              }
              @if (activeTab() === 'password') {
                <p style="margin: 0;">Password panel content goes here.</p>
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .demo-page {
        max-width: 56rem;
        margin: 0 auto;
        padding-bottom: 3rem;
      }

      .demo-header {
        margin-bottom: 2.5rem;
        border-bottom: 1px solid hsl(var(--border));
        padding-bottom: 2.5rem;
      }

      .demo-title {
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: hsl(var(--foreground));
        margin: 0;
      }

      .demo-description {
        margin-top: 1rem;
        font-size: 1.125rem;
        color: hsl(var(--muted-foreground));
        max-width: 42rem;
        line-height: 1.7;
      }

      .demo-section {
        margin-bottom: 3rem;
      }

      .section-title {
        font-size: 1.375rem;
        font-weight: 600;
        letter-spacing: -0.015em;
        color: hsl(var(--foreground));
        margin: 0 0 1.25rem 0;
      }

      .preview-card {
        border-radius: 0.75rem;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--card));
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        padding: 2rem;
      }

      /* Tabs */
      .tabs-root {
        max-width: 28rem;
        margin: 0 auto;
      }

      .tabs-list {
        display: flex;
        background: hsl(var(--muted));
        border-radius: 0.5rem;
        padding: 0.25rem;
      }

      .tab-trigger {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        border: none;
        border-radius: 0.375rem;
        background: transparent;
        color: hsl(var(--muted-foreground));
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .tab-trigger:hover {
        color: hsl(var(--foreground));
      }

      .tab-trigger.is-active {
        background: hsl(var(--background));
        color: hsl(var(--foreground));
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      .tab-content {
        margin-top: 1.5rem;
      }

      .tab-content-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: hsl(var(--foreground));
        margin: 0 0 0.25rem 0;
      }

      .tab-content-desc {
        font-size: 0.875rem;
        color: hsl(var(--muted-foreground));
        margin: 0 0 1.25rem 0;
        line-height: 1.5;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: hsl(var(--foreground));
        margin-bottom: 0.375rem;
      }

      .form-input {
        width: 100%;
        height: 2.25rem;
        padding: 0 0.75rem;
        border: 1px solid hsl(var(--input));
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-family: inherit;
        background: transparent;
        color: hsl(var(--foreground));
        box-sizing: border-box;
        transition: border-color 0.15s ease;
      }

      .form-input:focus {
        outline: 2px solid hsl(var(--ring));
        outline-offset: -1px;
        border-color: transparent;
      }

      .form-actions {
        margin-top: 1.25rem;
      }

      .btn-save {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        height: 2.25rem;
        padding: 0 1rem;
        border: none;
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        cursor: pointer;
        transition: opacity 0.15s ease;
      }

      .btn-save:hover {
        opacity: 0.9;
      }

      .btn-save:focus-visible {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
      }

      /* Code block */
      .code-block {
        border-radius: 0.75rem;
        background: #0a0a0a;
        border: 1px solid #27272a;
        overflow-x: auto;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .code-block pre {
        margin: 0;
        padding: 1.25rem 1.5rem;
        font-family:
          'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
        font-size: 0.8125rem;
        line-height: 1.7;
        color: #e4e4e7;
      }

      /* Headless section */
      .headless-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .badge {
        font-size: 0.6875rem;
        font-weight: 500;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        background: hsl(var(--muted));
        color: hsl(var(--muted-foreground));
        border: 1px solid hsl(var(--border));
        letter-spacing: 0.025em;
      }

      .headless-area {
        border-radius: 0.75rem;
        border: 2px dashed hsl(var(--border));
        padding: 2rem;
        background: hsl(var(--muted) / 0.3);
      }
    `,
  ],
})
export default class TabsHeadlessDemo {
  private _tabs = createTabs({ defaultValue: 'account' });
  activeTab = signal('account');

  selectTab(tab: string) {
    this._tabs.actions.selectTab(tab);
    this.activeTab.set(tab);
  }
}
