import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Code',
  component: 'and-code',
  argTypes: {
    prompt: {
      control: 'text',
      description: 'Prompt character shown before each line (e.g. "$", ">", "#").',
    },
    copyable: { control: 'boolean' },
    showPrompt: { control: 'boolean' },
    height: { control: 'text' },
  },
  args: {
    prompt: '$',
    copyable: true,
    showPrompt: true,
    height: 'auto',
  },
};

const Template = args => html`
  <div style="padding: 20px; max-width: 600px;">
    <and-code
      value=${args.value}
      prompt=${ifDefined(args.prompt)}
      ?copyable=${args.copyable}
      ?show-prompt=${args.showPrompt}
      height=${ifDefined(args.height)}
    ></and-code>
  </div>
`;

export const Default = Template.bind({});
Default.args = {
  value: 'npm install @andersseen/web-components',
};

export const MultiLine = Template.bind({});
MultiLine.args = {
  value: 'npm install\nnpm run build\nnpm run test',
};

export const CustomPrompt = Template.bind({});
CustomPrompt.args = {
  prompt: '>',
  value: 'install @andersseen/web-components @andersseen/icon',
};

export const NoPrompt = Template.bind({});
NoPrompt.args = {
  showPrompt: false,
  value: 'pnpm build:all',
};

export const NotCopyable = Template.bind({});
NotCopyable.args = {
  copyable: false,
  value: 'secret-token-do-not-copy',
};
