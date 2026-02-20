import { Component } from '@angular/core';
import {
  AndTabs,
  AndTabsContent,
  AndTabsList,
  AndTabsTrigger,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-tabs-demo',
  imports: [AndTabs, AndTabsContent, AndTabsList, AndTabsTrigger],
  template: `
    <div class="demo-section">
      <and-tabs value="tab1">
        <and-tabs-list>
          <and-tabs-trigger value="tab1">Profile</and-tabs-trigger>
          <and-tabs-trigger value="tab2">Settings</and-tabs-trigger>
          <and-tabs-trigger value="tab3">Messages</and-tabs-trigger>
        </and-tabs-list>
        <and-tabs-content value="tab1"
          >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate
          aperiam</and-tabs-content
        >
        <and-tabs-content value="tab2"
          >Labore, rerum, voluptatem doloremque quod repellendus dolorem nisi
          explicabo odit voluptatibus. Doloremque, sint. Quas consequatur,
          labore</and-tabs-content
        >
        <and-tabs-content value="tab3"
          >Rerum, voluptatem doloremque quod repellendus dolorem nisi explicabo
          odit voluptatibus</and-tabs-content
        >
      </and-tabs>
    </div>
  `,
})
export default class TabsDemo {}
