import { Route } from '@angular/router';
import { SignalComponent } from './signal/signal.component';
import { ObservableComponent } from './observable/observable.component';

export const appRoutes: Route[] = [
  {
    path: 'signal',
    component: SignalComponent,
  },
  {
    path: 'observable',
    component: ObservableComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signal',
  },
];
