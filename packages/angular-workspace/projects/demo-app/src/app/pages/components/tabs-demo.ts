import { Component } from '@angular/core';
import {
  MyTabs,
  MyTabsContent,
  MyTabsList,
  MyTabsTrigger,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-tabs-demo',
  imports: [MyTabs, MyTabsContent, MyTabsList, MyTabsTrigger],
  template: `
    <div class="demo-section">
      <my-tabs value="tab1">
        <my-tabs-list>
          <my-tabs-trigger value="tab1">Profile</my-tabs-trigger>
          <my-tabs-trigger value="tab2">Settings</my-tabs-trigger>
          <my-tabs-trigger value="tab3">Messages</my-tabs-trigger>
        </my-tabs-list>
        <my-tabs-content value="tab1"
          >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate
          aperiam</my-tabs-content
        >
        <my-tabs-content value="tab2"
          >Labore, rerum, voluptatem doloremque quod repellendus dolorem nisi
          explicabo odit voluptatibus. Doloremque, sint. Quas consequatur,
          labore</my-tabs-content
        >
        <my-tabs-content value="tab3"
          >Rerum, voluptatem doloremque quod repellendus dolorem nisi explicabo
          odit voluptatibus</my-tabs-content
        >
      </my-tabs>
    </div>
  `,
})
export default class TabsDemo {}
