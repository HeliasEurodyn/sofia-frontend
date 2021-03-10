import {Routes} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {LoginComponent} from './pages/login/login.component';
import {TableDesignerListComponent} from './pages/table-designer/table-designer-list/table-designer-list.component';

export const AppRoutes: Routes = [
  {
    path: '',
   // component: LoginComponent
    redirectTo: 'login',
    pathMatch: 'full',
  },
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
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      }]
  },
  // {
  //   path: '**',
  //   redirectTo: 'dashboard'
  // }
]
