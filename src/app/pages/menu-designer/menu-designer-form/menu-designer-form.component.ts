import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuService} from '../../../services/crud/menu.service';
import {MenuDTO, MenuFieldDTO} from '../../../dtos/menu/menuDTO';
import {PageComponent} from '../../page/page-component';
import {NavigatorService} from '../../../services/navigator.service';

@Component({
  selector: 'app-menu-designer-form',
  templateUrl: './menu-designer-form.component.html',
  styleUrls: ['./menu-designer-form.component.css']
})
export class MenuDesignerFormComponent extends PageComponent implements OnInit {

//  public fields: any;
  public tableHeaders: any;
  public menuComponent: MenuDTO;
  public menuFieldComponent: MenuFieldDTO;
  public selectedParentMenuFieldComponent: MenuFieldDTO;
  linecounter = 0;
  public tableExists = false;
  public fieldListMode = 'insert';
  public mode: string;

  title = 'appBootstrap';

  public isCollapsed = false;

  constructor(private activatedRoute: ActivatedRoute,
              private menuDesignerService: MenuService,
              private router: Router,
              private navigatorService: NavigatorService) {
    super();
  }

  // checkIfTableAlreadyExists() {
  //   this.menuDesignerService.tableExists(this.menuComponent.name).subscribe(data => {
  //     if (data) {
  //       this.tableExists = true;
  //     } else {
  //       this.tableExists = false;
  //     }
  //   });
  // }


  ngOnInit(): void {

    let id = '0';
    this.mode = 'new-record';
    this.menuFieldComponent = new MenuFieldDTO;

    const locateParams = this.getLocateParams();
    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.menuDesignerService.getById(id).subscribe(data => {
        this.menuComponent = data;
        this.cleanIdsIfCloneEnabled();
      });
    }

  }


  cleanIdsIfCloneEnabled() {
    if (this.params.has('TYPE')) {

      if (this.params.get('TYPE').toUpperCase() === 'CLONE') {

        this.menuComponent.id = null;
        this.menuComponent.version = null;
        for (const menuField of this.menuComponent.menuFieldList) {
          menuField.id = null;
          menuField.version = null;
        }
        this.mode = 'new-record';
      }
    }
  }


  showPreviousPageButton() {
    if (this.previousPage === null) {
      return false;
    } else {
      return true;
    }
  }

  navigateToPreviousPage() {
    this.navigatorService.navigateToPreviousPage(this.pageId);
  }

  navigateToNextPage() {
    this.navigatorService.navigateToNextPage(this.pageId);
  }

  showNextPageButton() {
    if (this.nextPage === null) {
      return false;
    } else {
      return true;
    }
  }

  addChildMenuField(selectedParentMenuFieldComponent: MenuFieldDTO) {
    this.linecounter++;
    this.selectedParentMenuFieldComponent = selectedParentMenuFieldComponent;
    this.menuFieldComponent = new MenuFieldDTO();
    this.menuFieldComponent.menuFieldList = [];
    this.menuFieldComponent.shortOrder = this.linecounter;
    this.fieldListMode = 'insert';

  }

  addParentMenuField() {
    this.linecounter++;
    this.selectedParentMenuFieldComponent = null;
    this.menuFieldComponent = new MenuFieldDTO();
    this.menuFieldComponent.menuFieldList = [];
    this.menuFieldComponent.shortOrder = this.linecounter;
    this.fieldListMode = 'insert';

  }

  editExistingMenuField(selectedMenuFieldComponent: MenuFieldDTO) {
    this.selectedParentMenuFieldComponent = null;
    this.menuFieldComponent = selectedMenuFieldComponent;
    this.fieldListMode = 'edit';
  }

  saveNewMenuItem() {
    if (this.selectedParentMenuFieldComponent == null) {
      this.menuComponent.menuFieldList.push(this.menuFieldComponent);
    } else {
      this.selectedParentMenuFieldComponent.menuFieldList.push(this.menuFieldComponent);
    }
  }

  removeMenuFieldLine(selectedMenuFieldComponent: MenuFieldDTO, menuFieldList: MenuFieldDTO[]) {
    if (menuFieldList === undefined) {
      return;
    }

    if (menuFieldList.indexOf(selectedMenuFieldComponent) >= 0) {
      menuFieldList.splice(menuFieldList.indexOf(selectedMenuFieldComponent), 1);
    }

    for (const menuField of menuFieldList) {
      this.removeMenuFieldLine(selectedMenuFieldComponent, menuField.menuFieldList);
    }

  }

  upItemInList(selectedMenuFieldComponent: MenuFieldDTO, menuFieldList: MenuFieldDTO[]) {
    if (menuFieldList === undefined) {
      return;
    }

    if (menuFieldList.indexOf(selectedMenuFieldComponent) > 0) {

      const position = menuFieldList.indexOf(selectedMenuFieldComponent);
      const item = menuFieldList[position];
      const prevItem = menuFieldList[position - 1];
      menuFieldList[position] = prevItem;
      menuFieldList[position - 1] = item;
    }
  }


  downItemInList(selectedMenuFieldComponent: MenuFieldDTO, menuFieldList: MenuFieldDTO[]) {
    if (menuFieldList === undefined) {
      return;
    }

    if (menuFieldList.indexOf(selectedMenuFieldComponent) < menuFieldList.length - 1) {

      const position = menuFieldList.indexOf(selectedMenuFieldComponent);
      const item = menuFieldList[position];
      const prevItem = menuFieldList[position + 1];
      menuFieldList[position] = prevItem;
      menuFieldList[position + 1] = item;
    }
  }


  save() {
    if (this.mode === 'edit-record') {
      this.menuDesignerService.update(this.menuComponent).subscribe(data => {
      //  this.router.navigate(['/menu-designer-list']);
        this.navigatorService.closeAndBack(this.pageId);
      });
    } else {
      this.menuDesignerService.save(this.menuComponent).subscribe(data => {
       // this.router.navigate(['/menu-designer-list']);
        this.navigatorService.closeAndBack(this.pageId);
      });
    }
  }

  // toList() {
  //   this.router.navigate(['/menu-designer-list']);
  // }

  delete() {
    this.menuDesignerService.delete(this.menuComponent.id).subscribe(data => {
    //  this.router.navigate(['/menu-designer-list']);
      this.navigatorService.closeAndBack(this.pageId);
    });
  }

  addLine() {
  }

}
