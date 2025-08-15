import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient()
  ]
}).catch((err) => console.error(err));


export function getPrerenderParams(route: string) {
  if (route === 'facturation/:id') {
    return [
      { id: '1' },
      { id: '2' },
      { id: '3' }
    ]; // liste d’IDs à générer
  }
  return [];
}