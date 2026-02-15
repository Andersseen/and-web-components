import {
  MyCard,
  MyButton,
  MyNavbar,
  MyIcon,
} from '@angular-components/stencil-generated/components';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-demo',
  imports: [MyCard, MyButton, MyIcon, MyNavbar],
  template: `
    <div class="demo-section">
      <h2>Navbar</h2>
      <p>Top navigation bar (you're using it now!)</p>

      <my-navbar class="mb-8 border rounded-lg overflow-hidden">
        <div slot="brand" class="flex items-center gap-2">
          <my-icon name="box" class="h-6 w-6"></my-icon>
          <span class="font-bold text-lg">Brand</span>
        </div>
        <div slot="actions" class="flex items-center gap-2">
          <my-button variant="ghost" size="sm">Log In</my-button>
          <my-button size="sm">Sign Up</my-button>
        </div>
      </my-navbar>

      <my-card class="p-4">
        <p style="margin: 0; color: #6b7280">
          The navbar above demonstrates the responsive behavior. Resize your
          browser window to see the mobile menu toggle appear. Clicking it will
          open the drawer menu.
        </p>
      </my-card>
    </div>
  `,
})
export default class NavbarDemo {}
