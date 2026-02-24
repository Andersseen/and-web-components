import { Component } from '@angular/core';
import { CategoryDemoComponent } from '../shared/category-demo.component';
import { ANIM_CATEGORIES } from '../data/animation-catalogue';

@Component({
  selector: 'app-back-demo',
  standalone: true,
  imports: [CategoryDemoComponent],
  template: `<app-category-demo [title]="'Back Animations'" [groups]="groups" />`,
})
export default class BackDemoComponent {
  groups = ANIM_CATEGORIES.find((c) => c.id === 'back')!.groups;
}
