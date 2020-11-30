import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-list-selector',
  templateUrl: './list-selector.component.html',
  styleUrls: ['./list-selector.component.css']
})
export class ListSelectorComponent implements OnInit {

  openListComponent: Boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  test() {
    this.openListComponent = true;
  }
}
