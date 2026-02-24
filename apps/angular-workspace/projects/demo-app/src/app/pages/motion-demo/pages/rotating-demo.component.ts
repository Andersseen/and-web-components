import { Component } from '@angular/core';
import { CategoryDemoComponent } from '../shared/category-demo.component';
import { ANIM_CATEGORIES } from '../data/animation-catalogue';

@Component({
  selector: 'app-rotating-demo',
  standalone: true,
  imports: [CategoryDemoComponent],
  template: `<app-category-demo [title]="'Rotating Animations'" [groups]="groups" />`,
})
export default class RotatingDemoComponent {
  groups = ANIM_CATEGORIES.find((c) => c.id === 'rotating')!.groups;
}
