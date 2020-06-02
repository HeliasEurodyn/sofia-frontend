import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuService} from '../../../services/menu.service';
import {MenuDTO, MenuFieldDTO} from '../../../dtos/menu/menuDTO';

@Component({
  selector: 'app-menu-designer-form',
  templateUrl: './menu-designer-form.component.html',
  styleUrls: ['./menu-designer-form.component.css']
})
export class MenuDesignerFormComponent implements OnInit {

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
              private router: Router) {
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

    this.menuFieldComponent = new MenuFieldDTO;

    if (this.activatedRoute.snapshot.paramMap.has('id')) {
      id = this.activatedRoute.snapshot.paramMap.get('id');
    }

    if (id === '0') {
      this.mode = 'new-record';
      this.menuComponent = new MenuDTO();
    } else {
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.menuDesignerService.getById(id).subscribe(data => {
        this.menuComponent = data;
      });
    }


   // this.tableHeaders = ['Name', 'Description', 'Type', 'Size', 'Related Component', 'Auto Increment', 'Primary key'];

  //  this.menuComponent = new MenuDTO();
  //   this.menuComponent.menuFieldList = [
  //     {
  //       id: 0,
  //       shortOrder: 0,
  //       name: 'child_1',
  //       icon: 'child_1_icon',
  //       command: 'command',
  //       menuFieldList: [
  //         {
  //           id: 1,
  //           shortOrder: 0,
  //           name: 'child_1.1',
  //           icon: 'child_1-1_icon',
  //           command: 'command',
  //           menuFieldList: [
  //             {
  //               id: 1,
  //               shortOrder: 0,
  //               name: 'child_1.1.1',
  //               icon: 'child_1-1_icon',
  //               command: 'command',
  //               menuFieldList: []
  //             },
  //             {
  //               id: 2,
  //               shortOrder: 0,
  //               name: 'child_1.1.2',
  //               icon: 'fa-address-book',
  //               command: 'command',
  //               menuFieldList: [
  //                 {
  //                   id: 2,
  //                   shortOrder: 0,
  //                   name: 'child_1.1.2.1',
  //                   icon: 'fa-barcode',
  //                   command: 'command',
  //                   menuFieldList: []
  //                 }]
  //             }
  //
  //           ]
  //         },
  //         {
  //           id: 2,
  //           shortOrder: 0,
  //           name: 'child_1.2',
  //           icon: 'fa-align-justify',
  //           command: 'command',
  //           menuFieldList: []
  //         }
  //       ]
  //     },
  //     {
  //       id: 0,
  //       shortOrder: 0,
  //       name: 'child_2',
  //       icon: 'child_2_icon',
  //       command: 'command',
  //       menuFieldList: []
  //     }
  //   ];


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
      this.menuDesignerService.put(this.menuComponent).subscribe(data => {
        this.router.navigate(['/menu-designer-list']);
      });
    } else {
      this.menuDesignerService.post(this.menuComponent).subscribe(data => {
        this.router.navigate(['/menu-designer-list']);
      });
    }
  }

  toList() {
    this.router.navigate(['/menu-designer-list']);
  }

  delete() {
    this.menuDesignerService.delete(this.menuComponent.id).subscribe(data => {
      this.router.navigate(['/menu-designer-list']);
    });
  }

  addLine() {
  }

}
