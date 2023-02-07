import {Routes} from '@angular/router';

import {UserComponent} from '../../pages/user/user.component';
import {TableComponent} from '../../pages/table/table.component';
import {ListComponent} from '../../pages/list/list/list.component';
import {CommandNavigatorService} from '../../services/system/command-navigator.service';
import {FormComponent} from '../../pages/form/form/form.component';
import {EmptyComponent} from '../../pages/empty/empty.component';
import {DashboardComponent} from '../../pages/dashboard/dashboard/dashboard.component';
import {XlsImportComponent} from '../../pages/xls-import/xls-import.component';
import {SearchComponent} from '../../pages/search/search.component';
import {ListWrapperComponent} from '../../pages/list/list-wrapper/list-wrapper.component';
import {AuthGuard} from '../../guards/auth.guard';
import {FormWrapperComponent} from '../../pages/form/form-wrapper/form-wrapper.component';
import {PivotListComponent} from '../../pages/pivot-list/pivot-list/pivot-list.component';
import {PivotListWrapperComponent} from '../../pages/pivot-list/pivot-list-wrapper/pivot-list-wrapper.component';
import {TimelineComponent} from '../../pages/timeline/timeline.component';
import { HtmlTemplatePreviewComponent } from 'app/pages/html-template-preview/html-template-preview.component';

export const AdminLayoutRoutes: Routes = [
  {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'table', component: TableComponent, canActivate: [AuthGuard]},
  {path: 'list', component: ListComponent, canActivate: [AuthGuard]},
  {path: 'list-alt', component: ListWrapperComponent, canActivate: [AuthGuard]},
  {path: 'pivotlist', component: PivotListComponent, canActivate: [AuthGuard]},
  {path: 'pivotlist-alt', component: PivotListWrapperComponent, canActivate: [AuthGuard]},
  {path: 'form', component: FormComponent, canActivate: [AuthGuard]},
  {path: 'form-alt', component: FormWrapperComponent, canActivate: [AuthGuard]},
  {path: 'xls-import', component: XlsImportComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'dashboard-alt', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'default', component: EmptyComponent, canActivate: [AuthGuard]},
  {path: 'search', component: SearchComponent, canActivate: [AuthGuard]},
  {path: 'timeline', component: TimelineComponent, canActivate: [AuthGuard]},
  {path: 'html-template-preview', component: HtmlTemplatePreviewComponent, canActivate: [AuthGuard]}
];

CommandNavigatorService.NavPages = AdminLayoutRoutes;
