import {Routes} from '@angular/router';

import {DashboardComponent} from '../../pages/dashboard/dashboard.component';
import {UserComponent} from '../../pages/user/user.component';
import {TableComponent} from '../../pages/table/table.component';
import {TypographyComponent} from '../../pages/typography/typography.component';
import {IconsComponent} from '../../pages/icons/icons.component';
import {MapsComponent} from '../../pages/maps/maps.component';
import {NotificationsComponent} from '../../pages/notifications/notifications.component';
import {UpgradeComponent} from '../../pages/upgrade/upgrade.component';
import {TableDesignerListComponent} from '../../pages/table-designer/table-designer-list/table-designer-list.component';
import {TableDesignerFormComponent} from '../../pages/table-designer/table-designer-form/table-designer-form.component';
import {MenuDesignerListComponent} from '../../pages/menu-designer/menu-designer-list/menu-designer-list.component';
import {MenuDesignerFormComponent} from '../../pages/menu-designer/menu-designer-form/menu-designer-form.component';
import {ListDesignerListComponent} from '../../pages/list-designer/list-designer-list/list-designer-list.component';
import {ListDesignerFormComponent} from '../../pages/list-designer/list-designer-form/list-designer-form.component';
import {ComponentDesignerFormComponent} from '../../pages/component-designer/component-designer-form/component-designer-form.component';
import {ComponentDesignerListComponent} from '../../pages/component-designer/component-designer-list/component-designer-list.component';
import {ViewDesignerListComponent} from '../../pages/view-designer/view-designer-list/view-designer-list.component';
import {ViewDesignerFormComponent} from '../../pages/view-designer/view-designer-form/view-designer-form.component';
import {ListComponent} from '../../pages/list/list/list.component';
import {TabContainerComponent} from '../../shared/main-tab-container/tab-container/tab-container.component';
import {NavigatorComponent} from '../../pages/navigator/navigator.component';
import {NavigatorService} from '../../services/navigator.service';
import {AppViewDesignerListComponent} from '../../pages/appview-designer/app-view-designer-list/app-view-designer-list.component';
import {AppViewDesignerFormComponent} from '../../pages/appview-designer/app-view-designer-form/app-view-designer-form.component';

export const AdminLayoutRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'main/:id', component: NavigatorComponent},
  {path: 'user', component: UserComponent},
  {path: 'table', component: TableComponent},
  {path: 'typography', component: TypographyComponent},
  {path: 'icons', component: IconsComponent},
  {path: 'maps', component: MapsComponent},
  {path: 'notifications', component: NotificationsComponent},
  {path: 'upgrade', component: UpgradeComponent},
  {path: 'table-designer-list', component: TableDesignerListComponent},
  {path: 'table-designer-form', component: TableDesignerFormComponent},
  {path: 'menu-designer-list', component: MenuDesignerListComponent},
  {path: 'menu-designer-form', component: MenuDesignerFormComponent},
  {path: 'list-designer-list', component: ListDesignerListComponent},
  {path: 'list-designer-form', component: ListDesignerFormComponent},
  {path: 'component-designer-form', component: ComponentDesignerFormComponent},
  {path: 'component-designer-list', component: ComponentDesignerListComponent},
  {path: 'view-designer-list', component: ViewDesignerListComponent},
  {path: 'view-designer-form', component: ViewDesignerFormComponent},
  {path: 'appview-designer-list', component: AppViewDesignerListComponent},
  {path: 'appview-designer-form', component: AppViewDesignerFormComponent},
  {path: 'list', component: ListComponent},
];

NavigatorService.NavPages = AdminLayoutRoutes;
