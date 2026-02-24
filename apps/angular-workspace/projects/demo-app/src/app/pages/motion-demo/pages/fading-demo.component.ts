import { Component } from '@angular/core';
import { CategoryDemoComponent } from '../shared/category-demo.component';
import { ANIM_CATEGORIES } from '../data/animation-catalogue';

@Component({
  selector: 'app-fading-demo',
  standalone: true,
  imports: [CategoryDemoComponent],
  template: `<app-category-demo [title]="'Fading Animations'" [groups]="groups" />`,
})
export default class FadingDemoComponent {
  groups = ANIM_CATEGORIES.find((c) => c.id === 'fading')!.groups;
}
