import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;

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