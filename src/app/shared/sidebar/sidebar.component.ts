import {Component, OnInit} from '@angular/core';
import {NavigatorService} from '../../services/navigator.service';


export interface RouteInfo {
  id: string;
  path: string;
  title: string;
  icon: string;
  class: string;
  type: string;
  children: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
  // {path: '/dashboard', title: 'Dashboard', icon: 'nc-bank', class: '', children: null},
  // {path: '#', title: 'Other Menus', icon: 'nc-layout-11', class: 'parent-menu', children: null},
  // {path: '/dto-designer-list', title: 'TableDTO Designer', icon: 'nc-settings', class: '', children: null},
  // {path: '/menu-designer-list', title: 'MenuDTO Designer', icon: 'nc-tile-56', class: '', children: null},
];

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  title = 'appBootstrap';

  public menuItems: any[];
  public selectedMenuItems: any[];
  public menuHeaders: any[];

  constructor(private navigatorService: NavigatorService) {
  }

  parentMenuSelection(id: string) {
    this.menuHeaders = [];
    this.selectedMenuItems = this.menuItems;
    this.parentMenuSelectionRecursive(this.selectedMenuItems, id);
    this.menuHeaders.reverse();
  }

  parentMenuSelectionRecursive(menuItems: any[], id: string) {
    for (const menuItem of menuItems) {
      if (menuItem.id === id) {
        this.menuHeaders.push(menuItem);
        this.selectedMenuItems = menuItem.children;
        return true;
      } else if (menuItem.type === 'parent-menu') {
        const foundInBranch = this.parentMenuSelectionRecursive(menuItem.children, id);
        if (foundInBranch) {
          this.menuHeaders.push(menuItem);
          return true;
        }
      }
    }
    return false;
  }

  parentMenuUnselection(id: string) {
    console.log('Selected ' + id);

    this.menuHeaders = [];
    this.selectedMenuItems = this.menuItems;
    this.parentMenuUnselectionRecursive(this.selectedMenuItems, id);
    this.menuHeaders.reverse();
  }

  parentMenuUnselectionRecursive(menuItems: any[], id: string) {
    for (const menuItem of menuItems) {
      console.log('Checking ' + menuItem.id);
      if (menuItem.id === id) {
        this.selectedMenuItems = menuItems;
        return true;
      }
      if (menuItem.type === 'parent-menu') {
        const foundInBranch = this.parentMenuUnselectionRecursive(menuItem.children, id);
        if (foundInBranch) {
          this.menuHeaders.push(menuItem);
          return true;
        }
      }
    }
    return false;
  }

  ngOnInit() {
    this.menuItems = [];

    this.menuItems.push({
      id: '1',
      path: 'STATICPAGE[NAME:dashboard,TITLE:Dashboard]',
      title: 'Dashboard',
      icon: 'fa-home',
      type: 'link',
      class: '',
      children: null
    });
    this.menuItems.push({
      id: '2',
      path: '#',
      title: 'Other Menus',
      icon: 'fa-th-list',
      type: 'parent-menu',
      class: 'parent-menu',
      children: null
    });
    this.menuItems.push({
      id: '3',
      path: 'STATICPAGE[NAME:table-designer-list,TITLE:Table Designer]',
      title: 'Table Designer',
      icon: 'fa-cogs',
      type: 'link',
      class: '',
      children: null
    });
    this.menuItems.push({
      id: '4',
      path: 'STATICPAGE[NAME:menu-designer-list,TITLE:Menu Designer]',
      title: 'Menu Designer',
      icon: 'fa-cogs',
      type: 'link',
      class: '',
      children: null
    });
    this.menuItems.push({
      id: '40',
      path: 'STATICPAGE[NAME:login,TITLE:Login]',
      title: 'login',
      icon: 'fa-id-card',
      type: 'link',
      class: '',
      children: null
    });
    this.menuItems.push({
      id: '41',
      path: 'STATICPAGE[NAME:list-designer-list,TITLE:List Designer]',
      title: 'List Designer',
      icon: 'fa-cogs',
      type: 'link',
      class: '',
      children: null
    });

    this.menuItems.push({
      id: '42',
      path: 'STATICPAGE[NAME:component-designer-list,TITLE:Compoent Designer]',
      title: 'Compoent Designer',
      icon: 'fa-cogs',
      type: 'link',
      class: '',
      children: null
    });


    this.menuItems.push({
      id: '43',
      path: 'STATICPAGE[NAME:view-designer-list,TITLE:View Designer]',
      title: 'View Designer',
      icon: 'fa-cogs',
      type: 'link',
      class: '',
      children: null
    });

    this.menuItems.push({
      id: '44',
      path: 'STATICPAGE[NAME:list,TYPE:EDIT,PARAMS:(ID=1),TITLE:List]',
      title: 'List',
      icon: 'fa-cogs',
      type: 'link',
      class: '',
      children: null
    });

    this.menuItems[1].children =
      [
        {id: '11', path: '#', title: 'Second submenu', icon: 'nc-caps-small', type: 'parent-menu', class: 'parent-menu', children: null},
        {id: '5', path: 'icons', title: 'Icons', icon: 'nc-diamond', type: 'link', class: '', children: null},
        {id: '6', path: 'maps', title: 'Maps', icon: 'nc-pin-3', type: 'link', class: '', children: null},
        {id: '7', path: 'notifications', title: 'Notifications', icon: 'nc-bell-55', type: 'link', class: '', children: null},
        {id: '8', path: 'user', title: 'User Profile', icon: 'nc-single-02', type: 'link', class: '', children: null},
        {id: '9', path: 'dto', title: 'TableDTO List', icon: 'nc-tile-56', type: 'link', class: '', children: null},
        {id: '10', path: 'typography', title: 'Typography', icon: 'nc-caps-small', type: 'link', class: '', children: null},
      ];

    this.menuItems[1].children[0].children =
      [
        {id: '12', path: '#', title: 'third', icon: 'nc-caps-small', type: 'parent-menu', class: 'parent-menu', children: null},
        {id: '13', path: 'icons', title: 'Icons', icon: 'nc-diamond', type: 'link', class: '', children: null},
        {id: '16', path: 'maps', title: 'Maps', icon: 'nc-pin-3', type: 'link', class: '', children: null},
        {id: '17', path: 'notifications', title: 'Notifications', icon: 'nc-bell-55', type: 'link', class: '', children: null},
        {id: '18', path: 'user', title: 'User Profile', icon: 'nc-single-02', type: 'link', class: '', children: null},
        {id: '19', path: 'dto', title: 'TableDTO List', icon: 'nc-tile-56', type: 'link', class: '', children: null},
        {id: '20', path: 'typography', title: 'Typography', icon: 'nc-caps-small', type: 'link', class: '', children: null},
      ];
    this.menuItems[1].children[0].children[0].children = [
      {id: '21', path: '/typography', title: 'Typography', icon: 'nc-caps-small', type: 'link', class: '', children: null},
    ];

    this.selectedMenuItems = this.menuItems;
  }


  notify(menuItem) {
    this.navigatorService.openLocation(menuItem.path);
    // this.internalMessageService.publishMessage('OpenTabEvent', {path: menuItem.path, title: menuItem.title});
  }

}
