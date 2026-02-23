import { Component } from '@angular/core';
import { CategoryDemoComponent } from '../shared/category-demo.component';
import { ANIM_CATEGORIES } from '../data/animation-catalogue';

@Component({
  selector: 'app-bouncing-demo',
  standalone: true,
  imports: [CategoryDemoComponent],
  template: `<app-category-demo [title]="'Bouncing Animations'" [groups]="groups" />`,
})
export default class BouncingDemoComponent {
  groups = ANIM_CATEGORIES.find((c) => c.id === 'bouncing')!.groups;
}
