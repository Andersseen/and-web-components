import { Component } from '@angular/core';
import { CategoryDemoComponent } from '../shared/category-demo.component';
import { ANIM_CATEGORIES } from '../data/animation-catalogue';

@Component({
  selector: 'app-flippers-demo',
  standalone: true,
  imports: [CategoryDemoComponent],
  template: `<app-category-demo [title]="'Flippers'" [groups]="groups" />`,
})
export default class FlippersDemoComponent {
  groups = ANIM_CATEGORIES.find((c) => c.id === 'flippers')!.groups;
}
