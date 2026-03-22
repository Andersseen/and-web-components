export const MOTION_PROMPT = `\\
<andersseen-motion-context>
## Library profile
Attribute-driven animation engine for the web.
Uses HTML attributes + CSS keyframes with a lightweight JS controller.
Supports triggers: enter (IntersectionObserver), hover, tap.
Respects prefers-reduced-motion in CSS and JS.

## Install
\`\`\`
npm i @andersseen/motion
\`\`\`

## Setup
\`\`\`ts
import { initMotion } from '@andersseen/motion';
import '@andersseen/motion/style.css';

// Creates MotionController + scans root. Returns cleanup function.
const cleanup = initMotion();

// Optional options:
const cleanup = initMotion({
  root: document.getElementById('page') as HTMLElement,
  threshold: 0.15,
  rootMargin: '0px',
  once: true,
});

// On SPA route change / component destroy:
cleanup();
\`\`\`

## Advanced: MotionController class
\`\`\`ts
import { MotionController } from '@andersseen/motion';

const mc = new MotionController({ root: document.body, threshold: 0.1, once: true });
mc.scan();     // re-scan root (call after dynamic content is added)
mc.destroy();  // remove all observers and event listeners
\`\`\`

Verified options:
- root?: HTMLElement (default document.body)
- threshold?: number (default 0.1)
- rootMargin?: string (default '0px')
- once?: boolean (default true)

## Attribute reference

| Attribute | Values | Notes |
|---|---|---|
| \`and-motion\` | animation name (required) | Marks the element and sets which animation to run |
| \`and-motion-trigger\` | \`enter\` · \`hover\` · \`tap\` | Default \`enter\`; names with \`-in\` also infer enter |
| \`and-motion-duration\` | CSS time (\`500ms\`, \`1.2s\`) | Sets \`--and-motion-duration\` on the element |
| \`and-motion-delay\` | CSS time (\`200ms\`) | Sets \`--and-motion-delay\` on the element |
| \`and-motion-easing\` | CSS easing string | Sets \`--and-motion-easing\` on the element |
| \`and-motion-once\` | \`true\` · \`false\` | Per-element override of the controller-level \`once\` option |

Controller runtime attribute:
- \`and-motion-state=active\` is toggled internally when animation is active.

## CSS custom properties (global, all overridable)
\`\`\`css
--and-motion-duration:        500ms
--and-motion-delay:           0ms
--and-motion-easing:          cubic-bezier(0.16, 1, 0.3, 1)   /* expo-out */
--and-motion-easing-enter:    cubic-bezier(0.16, 1, 0.3, 1)
--and-motion-easing-exit:     cubic-bezier(0.7, 0, 0.84, 0)
--and-motion-easing-spring:   cubic-bezier(0.34, 1.56, 0.64, 1)
--and-motion-easing-smooth:   cubic-bezier(0.25, 0.1, 0.25, 1)
--and-motion-easing-bounce:   cubic-bezier(0.175, 0.885, 0.32, 1.275)
--and-motion-distance:        20px
--and-motion-distance-big:    150px
\`\`\`

## Animation name reference

### Fading (enter by default)
fade · fade-up · fade-down · fade-left · fade-right
fade-up-big · fade-down-big · fade-left-big · fade-right-big
fade-top-left · fade-top-right · fade-bottom-left · fade-bottom-right

Explicit variants: fade-in · fade-in-up · fade-in-down · fade-in-left · fade-in-right (and -big)
Exit variants:     fade-out · fade-out-up · fade-out-down · fade-out-left · fade-out-right

### Sliding
slide-up · slide-down · slide-left · slide-right
Explicit: slide-in-up · slide-in-down · slide-in-left · slide-in-right (and -out-*)

### Zooming
zoom · zoom-up · zoom-down · zoom-left · zoom-right
Explicit: zoom-in · zoom-in-up · zoom-in-down · zoom-in-left · zoom-in-right (and -out-*)

### Bouncing
bounce-up · bounce-down · bounce-left · bounce-right
Explicit: bounce-in-up · bounce-in-down · bounce-in-left · bounce-in-right (and -out-*)
bounce-in · bounce-out (750ms override)

### Flipping
flip · flip-x · flip-y
Explicit: flip-in-x · flip-in-y · flip-out-x · flip-out-y

### Rotating
rotate · rotate-down-left · rotate-down-right · rotate-up-left · rotate-up-right
Explicit: rotate-in · rotate-in-down-left · … (and -out-*)

### Light speed
light-speed-right · light-speed-left
Explicit: light-speed-in-right · light-speed-in-left · light-speed-out-right · light-speed-out-left

### Back (arrive overshooting from off-screen)
back-down · back-left · back-right · back-up
Explicit: back-in-down · … · back-out-*

### Attention seekers (use trigger="hover" or trigger="tap")
pulse · rubber-band · shake-x · shake-y · head-shake · swing
tada · wobble · jello · heart-beat · flash · bounce
scale-up · scale-down

### Specials
hinge (2s, transform-origin top-left)
jack-in-the-box
roll · roll-in · roll-out

## Usage examples
\`\`\`html
<!-- Scroll-triggered fade-up (once) -->
<section and-motion="fade-up" and-motion-duration="700ms" and-motion-delay="100ms">
  <h2>Section title</h2>
</section>

<!-- Hover rubber-band attention seeker -->
<button and-motion="rubber-band" and-motion-trigger="hover">Click me</button>

<!-- Tap scale with spring easing -->
<div and-motion="scale-up" and-motion-trigger="tap"
     and-motion-easing="cubic-bezier(0.34, 1.56, 0.64, 1)">
  Card
</div>

<!-- Staggered list items using delay -->
<ul>
  <li and-motion="fade-in-up" and-motion-delay="0ms">Item 1</li>
  <li and-motion="fade-in-up" and-motion-delay="100ms">Item 2</li>
  <li and-motion="fade-in-up" and-motion-delay="200ms">Item 3</li>
</ul>
\`\`\`

## Angular usage
\`\`\`ts
// app.config.ts or main.ts
import { initMotion } from '@andersseen/motion';
import '@andersseen/motion/style.css';

initMotion();
\`\`\`
\`\`\`html
<!-- component template -->
<div and-motion="fade-up" and-motion-duration="600ms">
  <ng-content></ng-content>
</div>
\`\`\`
For Angular components with OnPush and dynamic content, call mc.scan() after content renders.

## Rules for LLM output
- Use \`and-motion\` attributes directly in HTML — no JS required for basic animations.
- Use motion for meaningful feedback (entrance, hover affordance, tap confirmation).
- Avoid constant looping animations that distract from content.
- Always provide a usable experience without animation (reduced motion is handled automatically).
- Call \`cleanup()\` or \`destroy()\` when unmounting SPA views to avoid listener leaks.
</andersseen-motion-context>
`;
