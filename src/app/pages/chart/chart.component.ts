import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as uuid from 'uuid';
import {ChartDTO} from '../../dtos/chart/chart-dto';
import {ChartService} from '../../services/crud/chart.service';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);

import 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() id: number;
  @Input() public extraParamsMap: Map<any, any>;
  public chartInstanceId = uuid.v4();
  public dto: ChartDTO;
  private chartOptions;

  constructor(private service: ChartService) {
  }

  ngOnInit(): void {
    this.refresh();
  //  this.executePeriodically();
  }

  executePeriodically(): void {

    if (this.dto.executePeriodically == null) {
      return;
    }

    if (this.dto.executePeriodically !== true || this.dto.executionInterval <= 0) {
      return;
    }

    setInterval(function () {
      this.getData();
    }.bind(this), this.dto.executionInterval);

  }
  refresh() {
    this.service.getChartById(this.id, this.extraParamsMap).subscribe(dto => {
      this.dto = dto;
      this.updateGraph();
    });
  }

  getData() {
      this.service.getData(this.id, this.dto.filterList, this.extraParamsMap).subscribe(chartFieldList => {
        this.dto.chartFieldList = chartFieldList;
        this.updateGraph();
      });
  }

  updateGraph() {
    const datasets: any[] = [];

    const verticalAxesFieldList = this.dto.chartFieldList.filter(chartField => chartField.name !== this.dto.horizontalAxe);
    verticalAxesFieldList.forEach(chartField => {
      const dataset = JSON.parse(chartField.chartJson);
      dataset['data'] = chartField.dataset;
      datasets.push(dataset);
    });

    const horizontalAxesFieldList = this.dto.chartFieldList.filter(chartField => chartField.name === this.dto.horizontalAxe);
    if (horizontalAxesFieldList.length !== 1) {
      return;
    }

    const horizontalAxesField = horizontalAxesFieldList[0];
    const mainDataset = JSON.parse(horizontalAxesField.chartJson);
    mainDataset['labels'] = horizontalAxesField.dataset;
    mainDataset['datasets'] = datasets;

    this.chartOptions = JSON.parse(this.dto.optionsJson);
    this.chartOptions['data'] = mainDataset;
  }

  fieldEventOccured(event: any) {
   if (event.eventtype === 'listselected') {
     this.getData();
   }
  }
}
