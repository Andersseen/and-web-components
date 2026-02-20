import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AndCarousel,
  AndCarouselItem,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-carousel-demo',
  imports: [CommonModule, AndCarousel, AndCarouselItem],
  template: `
    <div class="demo-section">
      <h2>Carousel</h2>
      <p>Slide through multiple items</p>
      <and-carousel autoplay="true">
        <and-carousel-item>
          <div
            style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              height: 300px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 2rem;
              font-weight: bold;
            "
          >
            Slide 1
          </div>
        </and-carousel-item>
        <and-carousel-item>
          <div
            style="
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              height: 300px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 2rem;
              font-weight: bold;
            "
          >
            Slide 2
          </div>
        </and-carousel-item>
        <and-carousel-item>
          <div
            style="
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
              height: 300px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 2rem;
              font-weight: bold;
            "
          >
            Slide 3
          </div>
        </and-carousel-item>
      </and-carousel>
    </div>
  `,
})
export default class CarouselDemo {}
