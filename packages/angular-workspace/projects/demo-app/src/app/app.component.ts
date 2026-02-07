import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Stencil Component Library Demo';

  // Navigation state
  activeSection: 'components' | 'icons' = 'components';
  activeComponent = 'accordion';

  // Drawer state
  drawerOpen = false;

  // Modal state
  modalOpen = false;

  // Toast reference
  @ViewChild('toast') toastElement!: ElementRef<HTMLMyToastElement>;

  // Dropdown items
  dropdownItems = [
    { text: 'Option 1', value: '1' },
    { text: 'Option 2', value: '2' },
    { text: 'Option 3', value: '3' },
  ];

  // Navbar items
  navItems = [
    { id: 'components', label: 'Components' },
    { id: 'icons', label: 'Icons' },
  ];

  // Sidebar items for components
  componentItems: SidebarItem[] = [
    { id: 'accordion', label: 'Accordion', icon: 'layers' },
    { id: 'alert', label: 'Alert', icon: 'info' },
    { id: 'badge', label: 'Badge', icon: 'star' },
    { id: 'button', label: 'Button', icon: 'box' },
    { id: 'card', label: 'Card', icon: 'layout' },
    { id: 'carousel', label: 'Carousel', icon: 'image' },
    { id: 'drawer', label: 'Drawer', icon: 'layout' },
    { id: 'dropdown', label: 'Dropdown', icon: 'chevron-down' },
    { id: 'input', label: 'Input', icon: 'file-text' },
    { id: 'modal', label: 'Modal', icon: 'layout' },
    { id: 'navbar', label: 'Navbar', icon: 'menu' },
    { id: 'pagination', label: 'Pagination', icon: 'list-ordered' },
    { id: 'sidebar', label: 'Sidebar', icon: 'menu' },
    { id: 'tabs', label: 'Tabs', icon: 'file-text' },
    { id: 'toast', label: 'Toast', icon: 'bell' },
    { id: 'tooltip', label: 'Tooltip', icon: 'message-square' },
  ];

  // Handle navbar navigation
  onNavItemClick(event: any) {
    this.activeSection = event.detail as 'components' | 'icons';
  }

  // Handle sidebar navigation
  onSidebarItemClick(event: any) {
    this.activeComponent = event.detail;
  }

  // Drawer methods
  openDrawer() {
    this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  // Modal methods
  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  // Toast methods
  async showToast() {
    if (this.toastElement && this.toastElement.nativeElement) {
      await this.toastElement.nativeElement.present(
        'This is a toast notification!',
        'success',
      );
    }
  }
}
