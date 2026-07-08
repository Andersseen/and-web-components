import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Code',
  component: 'and-code',
  argTypes: {
    language: {
      control: 'select',
      options: ['bash', 'shell', 'npm', 'yarn', 'pnpm', 'text'],
    },
    theme: {
      control: 'select',
      options: ['dark', 'light'],
    },
    copyable: { control: 'boolean' },
    showPrompt: { control: 'boolean' },
    height: { control: 'text' },
  },
  args: {
    language: 'bash',
    theme: 'dark',
    copyable: true,
    showPrompt: true,
    height: 'auto',
  },
};

const Template = args => html`
  <div style="padding: 20px; max-width: 600px;">
    <and-code
      value=${args.value}
      language=${ifDefined(args.language)}
      theme=${ifDefined(args.theme)}
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

export const NpmCommand = Template.bind({});
NpmCommand.args = {
  language: 'npm',
  value: 'install @andersseen/web-components @andersseen/icon',
};

export const NoPrompt = Template.bind({});
NoPrompt.args = {
  showPrompt: false,
  value: 'pnpm build:all',
};

export const Light = Template.bind({});
Light.args = {
  theme: 'light',
  value: 'git clone https://github.com/Andersseen/and-web-components.git',
};

export const NotCopyable = Template.bind({});
NotCopyable.args = {
  copyable: false,
  value: 'secret-token-do-not-copy',
};
