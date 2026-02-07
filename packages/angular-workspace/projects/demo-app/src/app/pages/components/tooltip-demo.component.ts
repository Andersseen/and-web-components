import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'stencil-library/components/my-tooltip';
import 'stencil-library/components/my-button';

@Component({
  selector: 'app-tooltip-demo',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h2>Tooltip</h2>
      <p>Contextual information on hover</p>
      <div class="flex gap-4 items-center flex-wrap">
        <my-tooltip content="Tooltip on Top" placement="top">
          <my-button label="Top"></my-button>
        </my-tooltip>

        <my-tooltip content="Tooltip on Right" placement="right">
          <my-button label="Right"></my-button>
        </my-tooltip>

        <my-tooltip content="Tooltip on Bottom" placement="bottom">
          <my-button label="Bottom"></my-button>
        </my-tooltip>

        <my-tooltip content="Tooltip on Left" placement="left">
          <my-button label="Left"></my-button>
        </my-tooltip>
      </div>
    </div>
  `,
})
export class TooltipDemoComponent {}
