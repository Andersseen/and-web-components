import { html } from 'lit';

export default {
  title: 'Components/Pagination',
  component: 'and-pagination',
  argTypes: {
    totalPages: { control: 'number' },
    currentPage: { control: 'number' },
  },
  args: {
    totalPages: 10,
    currentPage: 1,
  },
};

const Template = args => html`
  <div style="padding: 20px;">
    <and-pagination total-pages=${args.totalPages} current-page=${args.currentPage} @andPageChange=${e => console.log('Page changed to:', e.detail)}></and-pagination>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};
