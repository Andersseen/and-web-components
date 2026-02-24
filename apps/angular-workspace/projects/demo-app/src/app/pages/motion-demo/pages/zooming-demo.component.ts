import { Component } from '@angular/core';
import { CategoryDemoComponent } from '../shared/category-demo.component';
import { ANIM_CATEGORIES } from '../data/animation-catalogue';

@Component({
  selector: 'app-zooming-demo',
  standalone: true,
  imports: [CategoryDemoComponent],
  template: `<app-category-demo [title]="'Zooming Animations'" [groups]="groups" />`,
})
export default class ZoomingDemoComponent {
  groups = ANIM_CATEGORIES.find((c) => c.id === 'zooming')!.groups;
}
