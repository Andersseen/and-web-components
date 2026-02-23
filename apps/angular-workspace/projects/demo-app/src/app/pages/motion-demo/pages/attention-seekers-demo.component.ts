import { Component } from '@angular/core';
import { CategoryDemoComponent } from '../shared/category-demo.component';
import { ANIM_CATEGORIES } from '../data/animation-catalogue';

@Component({
  selector: 'app-attention-seekers-demo',
  standalone: true,
  imports: [CategoryDemoComponent],
  template: `<app-category-demo [title]="'Attention Seekers'" [groups]="groups" />`,
})
export default class AttentionSeekersDemoComponent {
  groups = ANIM_CATEGORIES.find((c) => c.id === 'attention-seekers')!.groups;
}
