import { Component } from '@angular/core';
import { CategoryDemoComponent } from '../shared/category-demo.component';
import { ANIM_CATEGORIES } from '../data/animation-catalogue';

@Component({
  selector: 'app-specials-demo',
  standalone: true,
  imports: [CategoryDemoComponent],
  template: `<app-category-demo [title]="'Specials'" [groups]="groups" />`,
})
export default class SpecialsDemoComponent {
  groups = ANIM_CATEGORIES.find((c) => c.id === 'specials')!.groups;
}
