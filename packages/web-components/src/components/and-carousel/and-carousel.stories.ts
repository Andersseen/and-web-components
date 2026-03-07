import { html } from 'lit';

export default {
  title: 'Components/Carousel',
  component: 'and-carousel',
  argTypes: {
    autoplay: { control: 'boolean' },
    interval: { control: 'number' },
    label: { control: 'text' },
  },
  args: {
    autoplay: false,
    interval: 3000,
    label: 'Image Carousel',
  },
};

const Template = args => html`
  <div style="max-width: 600px; padding: 20px;">
    <and-carousel ?autoplay=${args.autoplay} interval=${args.interval} label=${args.label} @andSlideChange=${e => console.log('Slide changed to:', e.detail)}>
      <and-carousel-item>
        <div class="flex aspect-video items-center justify-center bg-muted">
          <span class="text-4xl font-semibold">1</span>
        </div>
      </and-carousel-item>
      <and-carousel-item>
        <div class="flex aspect-video items-center justify-center bg-primary text-primary-foreground">
          <span class="text-4xl font-semibold">2</span>
        </div>
      </and-carousel-item>
      <and-carousel-item>
        <div class="flex aspect-video items-center justify-center bg-secondary text-secondary-foreground">
          <span class="text-4xl font-semibold">3</span>
        </div>
      </and-carousel-item>
    </and-carousel>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};
