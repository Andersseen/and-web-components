import { Component } from '@angular/core';
import { CategoryDemoComponent } from '../shared/category-demo.component';
import { ANIM_CATEGORIES } from '../data/animation-catalogue';

@Component({
  selector: 'app-lightspeed-demo',
  standalone: true,
  imports: [CategoryDemoComponent],
  template: `<app-category-demo [title]="'Light Speed'" [groups]="groups" />`,
})
export default class LightspeedDemoComponent {
  groups = ANIM_CATEGORIES.find((c) => c.id === 'lightspeed')!.groups;
}
