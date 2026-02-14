import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motion, MotionAnimations } from '@my-lib/motion-core';
import { MyButton } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-motion-demo',
  standalone: true,
  imports: [CommonModule, MyButton],
  template: `
    <div class="demo-container">
      <h1 class="text-3xl font-bold mb-4">Motion Demo</h1>
      <p class="mb-8 text-gray-600">Framework-agnostic animation library demo.</p>

      <!-- Enter / Leave Section -->
      <section class="demo-section border border-gray-200 rounded p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Enter / Leave</h2>
        <div class="flex gap-4 mb-4">
          <my-button (click)="enterBox()">Enter (Fade In)</my-button>
          <my-button variant="outline" (click)="leaveBox()">Leave (Fade Out)</my-button>
        </div>

        <div class="h-32 flex items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div #enterLeaveBox class="bg-blue-500 text-white p-4 rounded shadow-lg" style="display: none;">
            I appear and disappear!
          </div>
        </div>
      </section>

      <!-- Slide Section -->
      <section class="demo-section border border-gray-200 rounded p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Slide Animations</h2>
        <div class="flex gap-4 mb-4 flex-wrap">
          <my-button (click)="slideIn('top')">Slide Top</my-button>
          <my-button (click)="slideIn('bottom')">Slide Bottom</my-button>
          <my-button (click)="slideIn('left')">Slide Left</my-button>
          <my-button (click)="slideIn('right')">Slide Right</my-button>
        </div>

        <div class="h-32 flex items-center justify-center border border-dashed border-gray-300 rounded-lg overflow-hidden relative bg-gray-50">
          <div #slideBox class="bg-green-500 text-white p-4 rounded shadow-lg" style="display: none;">
            I slide in!
          </div>
        </div>
      </section>

      <!-- Interaction Section -->
      <section class="demo-section border border-gray-200 rounded p-6">
        <h2 class="text-xl font-semibold mb-4">Interactions (Tap)</h2>
        <div class="flex gap-8 justify-center">

          <div class="flex flex-col items-center gap-2">
            <h3 class="font-medium">Tap Me</h3>
            <div #tapBox class="bg-purple-500 text-white w-24 h-24 rounded-lg flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-shadow select-none">
              Tap
            </div>
          </div>

        </div>
      </section>

    </div>
  `,
  styles: [`
    .demo-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
  `]
})
export default class MotionDemoComponent implements AfterViewInit {
  @ViewChild('enterLeaveBox') enterLeaveBox!: ElementRef<HTMLElement>;
  @ViewChild('slideBox') slideBox!: ElementRef<HTMLElement>;
  @ViewChild('tapBox') tapBox!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    // Bind Tap -> Scale In (0.9 -> 1) gives a nice "press" release effect if handled right.
    // Actually scale-in is 0.9 -> 1. So it "pops" in.
    if (this.tapBox) {
      Motion.bindTap(this.tapBox.nativeElement, MotionAnimations.ScaleIn, { duration: 150 });
    }
  }

  async enterBox() {
    await Motion.enter(this.enterLeaveBox.nativeElement, MotionAnimations.FadeIn);
  }

  async leaveBox() {
    await Motion.leave(this.enterLeaveBox.nativeElement, MotionAnimations.FadeOut);
  }

  async slideIn(direction: 'top' | 'bottom' | 'left' | 'right') {
    let anim: string = MotionAnimations.SlideInTop;
    switch(direction) {
      case 'bottom': anim = MotionAnimations.SlideInBottom; break;
      case 'left': anim = MotionAnimations.SlideInLeft; break;
      case 'right': anim = MotionAnimations.SlideInRight; break;
    }

    // Force reset for demo purposes
    this.slideBox.nativeElement.style.display = 'none';
    this.slideBox.nativeElement.classList.remove('motion-slide-in-top', 'motion-slide-in-bottom', 'motion-slide-in-left', 'motion-slide-in-right');

    // Allow browser to repaint
    setTimeout(async () => {
      await Motion.enter(this.slideBox.nativeElement, anim);
    }, 50);
  }
}
