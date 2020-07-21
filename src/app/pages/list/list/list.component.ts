import {Component, OnInit} from '@angular/core';
import {ListDTO} from '../../../dtos/list/list-dto';
import {ListService} from '../../../services/crud/list.service';
import {PageComponent} from '../../page/page-component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent extends PageComponent implements OnInit {

  public dto: ListDTO;

  constructor(private service: ListService) {
    super();
  }

  ngOnInit(): void {

    this.dto = new ListDTO();

    if (this.getLocateParams().has('LISTNAME')) {
      const listName = this.getLocateParams().get('LISTNAME');
      this.service.getByName(listName).subscribe(data => {
        this.dto = data;
      });
    }


  }

}
