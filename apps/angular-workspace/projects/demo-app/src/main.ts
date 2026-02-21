import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeIcons } from './app/app-icons';
import { initializeAnimations } from './app/app-animations';

initializeIcons();
initializeAnimations();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
