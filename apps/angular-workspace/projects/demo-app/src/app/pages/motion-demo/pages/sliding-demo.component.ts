import { Component } from '@angular/core';
import { CategoryDemoComponent } from '../shared/category-demo.component';
import { ANIM_CATEGORIES } from '../data/animation-catalogue';

@Component({
  selector: 'app-sliding-demo',
  standalone: true,
  imports: [CategoryDemoComponent],
  template: `<app-category-demo [title]="'Sliding Animations'" [groups]="groups" />`,
})
export default class SlidingDemoComponent {
  groups = ANIM_CATEGORIES.find((c) => c.id === 'sliding')!.groups;
}
