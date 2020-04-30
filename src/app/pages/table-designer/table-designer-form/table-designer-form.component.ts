import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TableDesign} from '../../../dtos/table-design';
import {TableDesignerService} from '../../../services/table-designer.service';


@Component({
  selector: 'app-table-designer-form',
  templateUrl: './table-designer-form.component.html',
  styleUrls: ['./table-designer-form.component.css']
})
export class TableDesignerFormComponent implements OnInit {
//  public fields: any;
  public tableHeaders: any;
  public tableDesign: TableDesign;
  linecounter = 0;
  public tableExists = false;

  public mode: string;
  userDto: TableDesign;
  title = 'appBootstrap';

  public isCollapsed = false;
  constructor(private activatedRoute: ActivatedRoute,
              private tableDesignerService: TableDesignerService,
              private router: Router) {
  }

  checkIfTableAlreadyExists() {
    this.tableDesignerService.tableExists(this.tableDesign.name).subscribe(data => {
      if(data) this.tableExists = true;
      else this.tableExists = false;
    });
  }


  ngOnInit(): void {
    let id = '0';

    if (this.activatedRoute.snapshot.paramMap.has('id')) {
      id = this.activatedRoute.snapshot.paramMap.get('id');
    }

    if (id === '0') {
      this.mode = 'new-record';
      this.tableDesign = new TableDesign();
    } else {
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.tableDesignerService.getById(id).subscribe(data => {
        this.tableDesign = data;
      });
    }


    this.tableHeaders = ['Name', 'Description', 'Type', 'Size', 'Related Component', 'Auto Increment', 'Primary key'];

    this.tableDesign = new TableDesign();
    this.tableDesign.customComponentFieldList = [
      {
        id: 0,
        linecounter: this.linecounter,
        name: '',
        description: '',
        type: '',
        size: '',
        relatedComponentName: '',
        createdOn: null,
        createdBy: null,
        autoIncrement: false,
        primaryKey: false
      }
    ];

  }

  removeLine(row) {
    if (this.tableDesign.customComponentFieldList.length === 1) {
      return;
    }
    this.tableDesign.customComponentFieldList = this.tableDesign.customComponentFieldList.filter(item => item !== row);
  }

  save() {
    if (this.mode === 'edit-record') {
      this.tableDesignerService.put(this.tableDesign).subscribe(data => {
        this.router.navigate(['/table-designer-list']);
      });
    } else {
      this.tableDesignerService.post(this.tableDesign).subscribe(data => {
        this.router.navigate(['/table-designer-list']);
      });
    }
  }

  toList(){
    this.router.navigate(['/table-designer-list']);
  }

  delete(){
    this.tableDesignerService.delete(this.tableDesign.id).subscribe(data => {
      this.router.navigate(['/table-designer-list']);
    });
  }

  addLine() {
    this.linecounter++;
    this.tableDesign.customComponentFieldList.push(
      {
        id: null,
        linecounter: this.linecounter,
        name: '',
        description: '',
        type: '',
        size: '',
        relatedComponentName: '',
        createdOn: null,
        createdBy: null,
        autoIncrement: false,
        primaryKey: false,
      }
    );
  }
}
