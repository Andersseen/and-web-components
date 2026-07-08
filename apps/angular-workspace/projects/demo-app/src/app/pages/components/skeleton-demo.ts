import { DemoCodeBlockComponent } from '../../shared';
import { Component, signal } from '@angular/core';
import { AndSkeleton } from '@andersseen/angular-components';

@Component({
  selector: 'app-skeleton-demo',
  imports: [AndSkeleton, DemoCodeBlockComponent],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Skeleton</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Loading placeholder that mimics the shape of content while data is being fetched. Use it to reduce perceived
          loading time and prevent layout shifts.
        </p>
      </header>

      <!-- Variants Preview -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Variants</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-10 grid grid-cols-1 sm:grid-cols-3 gap-8 items-center justify-items-center min-h-[160px]">
            <div class="w-full max-w-[200px] space-y-2">
              <span class="text-xs text-muted-foreground uppercase tracking-wide">Default</span>
              <and-skeleton variant="default" width="100%" height="120px"></and-skeleton>
            </div>
            <div class="w-full max-w-[200px] space-y-2">
              <span class="text-xs text-muted-foreground uppercase tracking-wide">Circle</span>
              <and-skeleton variant="circle" width="64px" height="64px"></and-skeleton>
            </div>
            <div class="w-full max-w-[200px] space-y-2">
              <span class="text-xs text-muted-foreground uppercase tracking-wide">Text</span>
              <and-skeleton variant="text" width="100%" height="16px"></and-skeleton>
              <and-skeleton variant="text" width="80%" height="16px"></and-skeleton>
            </div>
          </div>
        </div>
      </section>

      <!-- Loading Card Preview -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Loading Card</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-6 max-w-md mx-auto min-h-[200px]">
            <div class="flex items-center gap-4 mb-4">
              <and-skeleton variant="circle" width="48px" height="48px"></and-skeleton>
              <div class="flex-1 space-y-2">
                <and-skeleton variant="text" width="60%" height="16px"></and-skeleton>
                <and-skeleton variant="text" width="40%" height="12px"></and-skeleton>
              </div>
            </div>
            <and-skeleton variant="default" width="100%" height="120px" class="mb-4"></and-skeleton>
            <and-skeleton variant="text" width="100%" height="14px" class="mb-2"></and-skeleton>
            <and-skeleton variant="text" width="90%" height="14px" class="mb-2"></and-skeleton>
            <and-skeleton variant="text" width="70%" height="14px"></and-skeleton>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <demo-code-block label="Template" [code]="templateCode" />
      </section>
    </div>
  `,
})
export default class SkeletonDemo {
  templateCode = `<!-- Variants -->
<and-skeleton variant="default" width="100%" height="120px"></and-skeleton>
<and-skeleton variant="circle" width="64px" height="64px"></and-skeleton>
<and-skeleton variant="text" width="100%" height="16px"></and-skeleton>

<!-- Loading card layout -->
<div class="flex items-center gap-4">
  <and-skeleton variant="circle" width="48px" height="48px"></and-skeleton>
  <div class="flex-1 space-y-2">
    <and-skeleton variant="text" width="60%" height="16px"></and-skeleton>
    <and-skeleton variant="text" width="40%" height="12px"></and-skeleton>
  </div>
</div>`;
}
