import {Component, OnInit} from '@angular/core';
import {PageComponent} from '../../page/page-component';
import {UserDto} from '../../../dtos/user/user-dto';
import {UserService} from '../../../services/crud/common/user.service';
import {NavigatorService} from '../../../services/navigator.service';
import {MenuService} from '../../../services/crud/menu.service';
import {MenuDTO} from '../../../dtos/menu/menuDTO';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent extends PageComponent implements OnInit {

  public userDTO: UserDto;
  public menuDTOS: MenuDTO[];
  public mode: string;

  constructor(private userService: UserService,
              private menuService: MenuService,
              private navigatorService: NavigatorService) {
    super();
  }

  ngOnInit(): void {

    let id = '0';
    this.mode = 'new-record';
    this.userDTO = new UserDto();

    const locateParams = this.getLocateParams();
    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.userService.getById(id).subscribe(data => {
        this.userDTO = data;
        this.cleanIdsIfCloneEnabled();
      });
    }

    this.readAllMenus();


  }

  readAllMenus() {
    this.menuService.get().subscribe(data => {
      this.menuDTOS = data;
    });
  }

  cleanIdsIfCloneEnabled() {
    if (this.params.has('TYPE')) {
      if (this.params.get('TYPE').toUpperCase() === 'CLONE') {
        this.userDTO.id = null;
        this.userDTO.version = null;
        this.mode = 'new-record';
      }
    }
  }

  delete() {
    this.userService.delete(this.userDTO.id).subscribe(data => {
      this.navigatorService.closeAndBack(this.pageId);
    });
  }

  save() {

    if (this.mode === 'edit-record') {
      this.userService.update(this.userDTO).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
      });
    } else {
      this.userService.save(this.userDTO).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
      });
    }
  }

  showNextPageButton() {
    if (this.nextPage === null) {
      return false;
    } else {
      return true;
    }
  }

  showPreviousPageButton() {
    if (this.previousPage === null) {
      return false;
    } else {
      return true;
    }
  }

  navigateToNextPage() {
    this.navigatorService.navigateToNextPage(this.pageId);
  }

  navigateToPreviousPage() {
    this.navigatorService.navigateToPreviousPage(this.pageId);
  }

  selectMenu(menu: MenuDTO) {
    this.userDTO.menu = menu;
  }
}
