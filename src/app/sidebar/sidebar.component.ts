import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    children: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Dashboard',         icon:'nc-bank',       class: '', children: null },
    { path: '/icons',         title: 'Icons',             icon:'nc-diamond',    class: '', children: null},
    { path: '/maps',          title: 'Maps',              icon:'nc-pin-3',      class: '', children: null},
    { path: '/notifications', title: 'Notifications',     icon:'nc-bell-55',    class: '', children: null },
    { path: '/user',          title: 'User Profile',      icon:'nc-single-02',  class: '', children: null },
    { path: '/table',         title: 'Table List',        icon:'nc-tile-56',    class: '', children: null},
    { path: '/typography',    title: 'Typography',        icon:'nc-caps-small', class: '', children: null},
    { path: '/table-designer-list', title: 'Table Designer',   icon:'nc-settings', class: '', children: null},
    { path: '/menu-designer-list', title: 'Menu Designer',   icon:'nc-tile-56', class: '', children: null},
    // { path: '/upgrade',       title: 'Upgrade to PRO',    icon:'nc-spaceship',  class: 'active-pro' },


];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {

  title = 'appBootstrap';

  public isCollapsed = false;
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
