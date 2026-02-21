import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-spacing-demo',
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">Spacing</h1>
        <p class="text-base text-muted-foreground">
          Control padding and margin through the
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">and-layout</code>
          attribute with directional and axis modifiers.
        </p>
      </div>

      <!-- Padding -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Padding</span>
          <h2 class="text-xl font-bold mb-1">Padding Scale</h2>
          <p class="text-sm text-muted-foreground">
            Tokens: <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">p:*</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">p-t:*</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">p-b:*</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">p-l:*</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">p-r:*</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">p-x:*</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">p-y:*</code>
          </p>
        </div>

        <div class="flex flex-col gap-3 border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          @for (size of spacingSizes; track size) {
            <div>
              <p class="text-xs text-muted-foreground font-mono mb-1">p:{{ size }}</p>
              <div class="inline-block border-2 border-dashed border-primary/30 rounded-lg">
                <div [attr.and-layout]="'p:' + size" class="bg-primary/15 rounded-lg">
                  <div class="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">Content</div>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="p:md"&gt;Content&lt;/div&gt;
&lt;div and-layout="p-x:lg p-y:sm"&gt;Content&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Directional Padding -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Directional</span>
          <h2 class="text-xl font-bold mb-1">Directional &amp; Axis Padding</h2>
          <p class="text-sm text-muted-foreground">
            Apply padding to specific sides or axes.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          <div>
            <p class="text-xs text-muted-foreground font-mono mb-1">p-t:lg</p>
            <div class="border-2 border-dashed border-primary/30 rounded-lg inline-block">
              <div and-layout="p-t:lg" class="bg-primary/15 rounded-lg">
                <div class="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">Top</div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-xs text-muted-foreground font-mono mb-1">p-l:xl</p>
            <div class="border-2 border-dashed border-primary/30 rounded-lg inline-block">
              <div and-layout="p-l:xl" class="bg-primary/15 rounded-lg">
                <div class="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">Left</div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-xs text-muted-foreground font-mono mb-1">p-x:xl</p>
            <div class="border-2 border-dashed border-primary/30 rounded-lg inline-block">
              <div and-layout="p-x:xl" class="bg-primary/15 rounded-lg">
                <div class="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">X-axis</div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-xs text-muted-foreground font-mono mb-1">p-y:lg</p>
            <div class="border-2 border-dashed border-primary/30 rounded-lg inline-block">
              <div and-layout="p-y:lg" class="bg-primary/15 rounded-lg">
                <div class="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">Y-axis</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="p-t:lg"&gt;Top padding&lt;/div&gt;
&lt;div and-layout="p-x:xl"&gt;Horizontal padding&lt;/div&gt;
&lt;div and-layout="p-y:lg"&gt;Vertical padding&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Margin -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Margin</span>
          <h2 class="text-xl font-bold mb-1">Margin Scale</h2>
          <p class="text-sm text-muted-foreground">
            Same token syntax: <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">m:*</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">m-t:*</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">m-x:*</code>, etc.
          </p>
        </div>

        <div class="flex flex-col gap-3 border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          @for (size of ['xs', 'sm', 'md', 'lg', 'xl']; track size) {
            <div class="bg-secondary/20 rounded-lg inline-block border border-dashed  border-secondary">
              <div [attr.and-layout]="'m:' + size" class="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded">
                m:{{ size }}
              </div>
            </div>
          }
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="m:md"&gt;Content&lt;/div&gt;
&lt;div and-layout="m-x:auto"&gt;Centered block&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Spacing Scale Reference -->
      <section class="border border-border rounded-xl p-6 bg-card">
        <h2 class="text-xl font-bold mb-4">Spacing Scale Reference</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead>
              <tr class="border-b border-border">
                <th class="py-2 px-3 font-semibold">Token</th>
                <th class="py-2 px-3 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody class="text-muted-foreground">
              @for (item of scaleItems; track item.token) {
                <tr class="border-b border-border/50">
                  <td class="py-2 px-3 font-mono text-xs">{{ item.token }}</td>
                  <td class="py-2 px-3 font-mono text-xs">{{ item.value }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
})
export default class LayoutSpacingDemoComponent {
  spacingSizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

  scaleItems = [
    { token: 'none', value: '0' },
    { token: 'xxxs', value: '0.125rem (2px)' },
    { token: 'xxs', value: '0.25rem (4px)' },
    { token: 'xs', value: '0.5rem (8px)' },
    { token: 'sm', value: '0.75rem (12px)' },
    { token: 'md', value: '1rem (16px)' },
    { token: 'lg', value: '1.5rem (24px)' },
    { token: 'xl', value: '2rem (32px)' },
    { token: 'xxl', value: '3rem (48px)' },
    { token: 'xxxl', value: '4rem (64px)' },
    { token: 'auto', value: 'auto' },
  ];
}
