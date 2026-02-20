import { Component } from '@angular/core';
import {
  AndButton,
  AndTooltip,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-tooltip-demo',
  imports: [AndButton, AndTooltip],
  template: `
    <div class="demo-section">
      <h2>Tooltip</h2>
      <p>Contextual information on hover</p>
      <div class="flex gap-4 items-center flex-wrap">
        <and-tooltip content="Tooltip on Top" placement="top">
          <and-button>Top</and-button>
        </and-tooltip>

        <and-tooltip content="Tooltip on Right" placement="right">
          <and-button>Right</and-button>
        </and-tooltip>

        <and-tooltip content="Tooltip on Bottom" placement="bottom">
          <and-button>Bottom</and-button>
        </and-tooltip>

        <and-tooltip content="Tooltip on Left" placement="left">
          <and-button>Left</and-button>
        </and-tooltip>
      </div>
    </div>
  `,
})
export default class TooltipDemo {}
