import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeIcons } from './app/app-icons';

initializeIcons();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
