import {Component, OnInit} from '@angular/core';
import {CommandNavigatorService} from '../../services/command-navigator.service';
import {UserDto} from '../../dtos/user/user-dto';


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
  // {path: '/listDto-designer-list', title: 'TableDTO Designer', icon: 'nc-settings', class: '', children: null},
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

  public selectedMenuItems: any[];
  public menuHeaders: any[];
  public userDto: UserDto;

  constructor(private navigatorService: CommandNavigatorService) {
  }

  parentMenuSelection(id: string) {
    this.menuHeaders = [];
    this.selectedMenuItems = this.userDto.menu.menuFieldList;
    this.parentMenuSelectionRecursive(this.selectedMenuItems, id);
    this.menuHeaders.reverse();
  }

  parentMenuSelectionRecursive(menuItems: any[], id: string) {
    for (const menuItem of menuItems) {
      if (menuItem.id === id) {
        this.menuHeaders.push(menuItem);
        this.selectedMenuItems = menuItem.menuFieldList;
        return true;
      } else if (menuItem.command === 'parent-menu') {
        const foundInBranch = this.parentMenuSelectionRecursive(menuItem.menuFieldList, id);
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
    this.selectedMenuItems = this.userDto.menu.menuFieldList;
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
      if (menuItem.command === 'parent-menu') {
        const foundInBranch = this.parentMenuUnselectionRecursive(menuItem.menuFieldList, id);
        if (foundInBranch) {
          this.menuHeaders.push(menuItem);
          return true;
        }
      }
    }
    return false;
  }


  ngOnInit() {

    this.userDto = JSON.parse(localStorage.getItem('loggedin_user'));

    this.selectedMenuItems = this.userDto.menu.menuFieldList;

    // this.menuItems.push({
    //   id: '1',
    //   path: 'STATICPAGE[NAME:dashboard,TITLE:Dashboard]',
    //   title: 'Dashboard',
    //   icon: 'fa-home',
    //   type: 'link',
    //   class: '',
    //   children: null
    // });
    // this.menuItems.push({
    //   id: '2',
    //   path: '#',
    //   title: 'Other Menus',
    //   icon: 'fa-th-list',
    //   type: 'parent-menu',
    //   class: 'parent-menu',
    //   children: null
    // });
    // this.menuItems.push({
    //   id: '3',
    //   path: 'STATICPAGE[NAME:table-designer-list,TITLE:Table Designer]',
    //   title: 'Table Designer',
    //   icon: 'fa-cogs',
    //   type: 'link',
    //   class: '',
    //   children: null
    // });
    // this.menuItems.push({
    //   id: '4',
    //   path: 'STATICPAGE[NAME:menu-designer-list,TITLE:Menu Designer]',
    //   title: 'Menu Designer',
    //   icon: 'fa-cogs',
    //   type: 'link',
    //   class: '',
    //   children: null
    // });
    // this.menuItems.push({
    //   id: '40',
    //   path: 'STATICPAGE[NAME:login,TITLE:Login]',
    //   title: 'login',
    //   icon: 'fa-id-card',
    //   type: 'link',
    //   class: '',
    //   children: null
    // });
    // this.menuItems.push({
    //   id: '41',
    //   path: 'STATICPAGE[NAME:list-designer-list,TITLE:List Designer]',
    //   title: 'List Designer',
    //   icon: 'fa-cogs',
    //   type: 'link',
    //   class: '',
    //   children: null
    // });
    //
    // this.menuItems.push({
    //   id: '42',
    //   path: 'STATICPAGE[NAME:component-designer-list,TITLE:Compoent Designer]',
    //   title: 'Compoent Designer',
    //   icon: 'fa-cogs',
    //   type: 'link',
    //   class: '',
    //   children: null
    // });
    //
    // this.menuItems.push({
    //   id: '43',
    //   path: 'STATICPAGE[NAME:view-designer-list,TITLE:View Designer]',
    //   title: 'View Designer',
    //   icon: 'fa-cogs',
    //   type: 'link',
    //   class: '',
    //   children: null
    // });
    //
    // this.menuItems.push({
    //   id: '43',
    //   path: 'STATICPAGE[NAME:appview-designer-list,TITLE:App View Designer]',
    //   title: 'App View Designer',
    //   icon: 'fa-cogs',
    //   type: 'link',
    //   class: '',
    //   children: null
    // });
    //
    // this.menuItems.push({
    //   id: '44',
    //   path: 'LIST[LOCATE:(ID=5),TITLE:List]',
    //   title: 'List',
    //   icon: 'fa-cogs',
    //   type: 'link',
    //   class: '',
    //   children: null
    // });
    //
    // this.menuItems.push({
    //   id: '45',
    //   path: 'STATICPAGE[NAME:user-list,TITLE:Users]',
    //   title: 'Users',
    //   icon: 'fa-cogs',
    //   type: 'link',
    //   class: '',
    //   children: null
    // });
    // this.menuItems[1].children =
    //   [
    //     {id: '11', path: '#', title: 'Second submenu', icon: 'nc-caps-small', type: 'parent-menu', class: 'parent-menu', children: null},
    //     {id: '5', path: 'icons', title: 'Icons', icon: 'nc-diamond', type: 'link', class: '', children: null},
    //     {id: '6', path: 'maps', title: 'Maps', icon: 'nc-pin-3', type: 'link', class: '', children: null},
    //     {id: '7', path: 'notifications', title: 'Notifications', icon: 'nc-bell-55', type: 'link', class: '', children: null},
    //     {id: '8', path: 'user', title: 'User Profile', icon: 'nc-single-02', type: 'link', class: '', children: null},
    //     {id: '9', path: 'dto', title: 'TableDTO List', icon: 'nc-tile-56', type: 'link', class: '', children: null},
    //     {id: '10', path: 'typography', title: 'Typography', icon: 'nc-caps-small', type: 'link', class: '', children: null},
    //   ];
    //
    // this.menuItems[1].children[0].children =
    //   [
    //     {id: '12', path: '#', title: 'third', icon: 'nc-caps-small', type: 'parent-menu', class: 'parent-menu', children: null},
    //     {id: '13', path: 'icons', title: 'Icons', icon: 'nc-diamond', type: 'link', class: '', children: null},
    //     {id: '16', path: 'maps', title: 'Maps', icon: 'nc-pin-3', type: 'link', class: '', children: null},
    //     {id: '17', path: 'notifications', title: 'Notifications', icon: 'nc-bell-55', type: 'link', class: '', children: null},
    //     {id: '18', path: 'user', title: 'User Profile', icon: 'nc-single-02', type: 'link', class: '', children: null},
    //     {id: '19', path: 'dto', title: 'TableDTO List', icon: 'nc-tile-56', type: 'link', class: '', children: null},
    //     {id: '20', path: 'typography', title: 'Typography', icon: 'nc-caps-small', type: 'link', class: '', children: null},
    //   ];
    // this.menuItems[1].children[0].children[0].children = [
    //   {id: '21', path: '/typography', title: 'Typography', icon: 'nc-caps-small', type: 'link', class: '', children: null},
    // ];

  }


  openMenu(menuItem) {
    this.navigatorService.navigate(menuItem.command);
    // this.internalMessageService.publishMessage('openTabEvent', {path: menuItem.path, title: menuItem.title});
  }

}
