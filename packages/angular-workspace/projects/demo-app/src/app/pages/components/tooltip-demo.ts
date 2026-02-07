import { Component } from '@angular/core';
import {
  MyButton,
  MyTooltip,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-tooltip-demo',
  imports: [MyButton, MyTooltip],
  template: `
    <div class="demo-section">
      <h2>Tooltip</h2>
      <p>Contextual information on hover</p>
      <div class="flex gap-4 items-center flex-wrap">
        <my-tooltip content="Tooltip on Top" placement="top">
          <my-button>Top</my-button>
        </my-tooltip>

        <my-tooltip content="Tooltip on Right" placement="right">
          <my-button>Right</my-button>
        </my-tooltip>

        <my-tooltip content="Tooltip on Bottom" placement="bottom">
          <my-button>Bottom</my-button>
        </my-tooltip>

        <my-tooltip content="Tooltip on Left" placement="left">
          <my-button>Left</my-button>
        </my-tooltip>
      </div>
    </div>
  `,
})
export default class TooltipDemo {}
