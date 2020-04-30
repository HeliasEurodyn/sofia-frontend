import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
import { TableDesignerListComponent} from '../../pages/table-designer/table-designer-list/table-designer-list.component';
import {TableDesignerFormComponent} from '../../pages/table-designer/table-designer-form/table-designer-form.component';
import {MenuDesignerListComponent} from '../../pages/menu/menu-designer-list/menu-designer-list.component';
import {MenuDesignerFormComponent} from '../../pages/menu/menu-designer-form/menu-designer-form.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user',           component: UserComponent },
    { path: 'table',          component: TableComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'table-designer-list',        component: TableDesignerListComponent },
    { path: 'table-designer-form/:id',        component: TableDesignerFormComponent },
    { path: 'menu-designer-list',        component: MenuDesignerListComponent },
    { path: 'menu-designer-form/:id',        component: MenuDesignerFormComponent },
];
