import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { Observable } from 'rxjs';

import { ChartDataSets, ChartLayoutOptions, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isHandset$: Observable<any> = this.breakpointObserer.observe(Breakpoints.HandsetLandscape);

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Sensor 1' },
    { data: [], label: 'Sensor 2' }
  ];
  public lineChartLabels: Label[] = [];

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { bottom: 80 } }
  }

  constructor(private database: DatabaseService, private breakpointObserer: BreakpointObserver) { }

  ngOnInit(): void {
    this.database.getDataOnDay('2019/07/18', ['s1','s2']).subscribe(data => {
      this.lineChartData[0].data = data.map((record: any[]) => record[1]);
      this.lineChartData[1].data = data.map((record: any[]) => record[2]);
      this.lineChartLabels = data.map((record: any[]) => {
        const timeStamp: number = Date.parse(record[0]);
        return new Date(timeStamp).toLocaleTimeString('nl-NL');
      })
      console.log(data);
    });
  }

}
