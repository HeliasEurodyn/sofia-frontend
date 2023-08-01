import {Routes} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {LoginComponent} from './pages/login/login.component';
import {CallBackComponent} from './pages/call-back/call-back.component';
import {EmptyComponent} from "./pages/empty/empty.component";
import {DefaultComponent} from "./pages/default/default.component";

export const AppRoutes: Routes = [
  {
    path: '',
    component: DefaultComponent
  },
  {path: 'callback', component: CallBackComponent},
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }]
  }
]
