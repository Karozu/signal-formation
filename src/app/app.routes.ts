import { Route } from '@angular/router';
import { SignalComponent } from './signal/signal.component';

export const appRoutes: Route[] = [
  {
    path: 'signal',
    component: SignalComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signal',
  },
];
