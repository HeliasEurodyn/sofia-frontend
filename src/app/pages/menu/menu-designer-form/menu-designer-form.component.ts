import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuDesignerService} from '../../../services/menu-designer.service';
import {MenuComponent} from '../../../dtos/menu-component';

@Component({
  selector: 'app-menu-designer-form',
  templateUrl: './menu-designer-form.component.html',
  styleUrls: ['./menu-designer-form.component.css']
})
export class MenuDesignerFormComponent implements OnInit {

//  public fields: any;
  public tableHeaders: any;
  public menuComponent: MenuComponent;
  linecounter = 0;
  public tableExists = false;

  public mode: string;
  userDto: MenuComponent;
  title = 'appBootstrap';

  public isCollapsed = false;

  constructor(private activatedRoute: ActivatedRoute,
              private menuDesignerService: MenuDesignerService,
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

    if (this.activatedRoute.snapshot.paramMap.has('id')) {
      id = this.activatedRoute.snapshot.paramMap.get('id');
    }

    if (id === '0') {
      this.mode = 'new-record';
      this.menuComponent = new MenuComponent();
    } else {
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.menuDesignerService.getById(id).subscribe(data => {
        this.menuComponent = data;
      });
    }


    this.tableHeaders = ['Name', 'Description', 'Type', 'Size', 'Related Component', 'Auto Increment', 'Primary key'];

    this.menuComponent = new MenuComponent();
    this.menuComponent.menuFieldList = [
      {
        id: 0,
        linecounter: 0,
        name: 'child_1',
        icon: 'child_1_icon',
        command: 'command',
        menuFieldList: [
          {
            id: 1,
            linecounter: 0,
            name: 'child_1.1',
            icon: 'child_1-1_icon',
            command: 'command',
            menuFieldList: [
              {
                id: 1,
                linecounter: 0,
                name: 'child_1.1.1',
                icon: 'child_1-1_icon',
                command: 'command',
                menuFieldList: []
              },
              {
                id: 2,
                linecounter: 0,
                name: 'child_1.1.2',
                icon: 'fa-address-book',
                command: 'command',
                menuFieldList: [
                  {
                  id: 2,
                  linecounter: 0,
                  name: 'child_1.1.2.1',
                  icon: 'fa-barcode',
                  command: 'command',
                  menuFieldList: []
                }]
              }

            ]
          },
          {
            id: 2,
            linecounter: 0,
            name: 'child_1.2',
            icon: 'fa-align-justify',
            command: 'command',
            menuFieldList: []
          }
        ]
      },
      {
        id: 0,
        linecounter: 0,
        name: 'child_2',
        icon: 'child_2_icon',
        command: 'command',
        menuFieldList: []
      }
    ];


  }

  removeLine(row) {
    // if (this.menuComponent.customComponentFieldList.length === 1) {
    //   return;
    // }
    // this.menuComponent.customComponentFieldList = this.menuComponent.customComponentFieldList.filter(item => item !== row);
  }

  save() {
    if (this.mode === 'edit-record') {
      this.menuDesignerService.put(this.menuComponent).subscribe(data => {
        this.router.navigate(['/table-designer-list']);
      });
    } else {
      this.menuDesignerService.post(this.menuComponent).subscribe(data => {
        this.router.navigate(['/table-designer-list']);
      });
    }
  }

  toList() {
    this.router.navigate(['/menu-designer-list']);
  }

  delete() {
    this.menuDesignerService.delete(this.menuComponent.id).subscribe(data => {
      this.router.navigate(['/table-designer-list']);
    });
  }

  addLine() {
    // this.linecounter++;
    // this.menuComponent.customComponentFieldList.push(
    //   {
    //     id: null,
    //     linecounter: this.linecounter,
    //     name: '',
    //     description: '',
    //     type: '',
    //     size: '',
    //     relatedComponentName: '',
    //     createdOn: null,
    //     createdBy: null,
    //     autoIncrement: false,
    //     primaryKey: false,
    //   }
    // );
  }

}
