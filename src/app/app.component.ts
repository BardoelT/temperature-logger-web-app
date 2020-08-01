import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { Observable, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isHandset$: Observable<any> = this.breakpointObserer.observe(Breakpoints.HandsetLandscape);

  constructor(private database: DatabaseService, private breakpointObserer: BreakpointObserver, private route: ActivatedRoute) {  }

  intervalSelection: string = "Hour";
  refreshInterval = interval(10000);

  myData = [];
  columnNames = [];
  myType = "LineChart"
  myOptions = {
    hAxis: {
      format: 'HH:mm'
    }
  }

  getParamValueQueryString( paramName ) {
    const url = window.location.href;
    var paramValue: string = "";
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    return paramValue;
  }

  ngOnInit(): void {
    var fields: string[] = ["buiten", "1.1", "1.2", "1.3", "1.4", "2.1", "2.2", "2.3", "2.4"];
    var parameterFields: string = this.getParamValueQueryString('fields');
    if(parameterFields.length > 0)
      fields = parameterFields.split(',');

    this.database.setDataFields(fields);
    this.refreshInterval.subscribe(() => this.updateChart());
    this.updateChart();
  }

  formatLineChartData(data: any): void {
    this.myData = [];
    this.columnNames = data.columns;
    this.myData = data.values.map((record: any[]) => {
      record[0] = new Date(Date.parse(record[0]));
      return record;
    });
  }

  formatTableData(data: any): void {
    this.myData = [];
    this.myData = data.values[0].map(record => {
        return [`${data.columns.shift()}`, record];
    });
    this.myData[0][1] = new Date(Date.parse(this.myData[0][1])).toLocaleTimeString();
  }

  updateQuery(intervalSelect: string): void {
    this.intervalSelection = intervalSelect;
    this.myData = [];
    this.updateChart();
  }
    
  updateChart(): void {
    if (this.intervalSelection === "Current") {
      this.myType = "Table";
      this.columnNames = [ "Sensor", "Temperature" ];
      this.database.getDataCurrent().subscribe(data => this.formatTableData(data));
      return;
    }

    this.myType = "LineChart";
    if (this.intervalSelection === "Hour")
      this.database.getDataLastHour().subscribe(data => this.formatLineChartData(data));
    else if (this.intervalSelection === "Day")
      this.database.getDataLastDay().subscribe(data => this.formatLineChartData(data));
    else if (this.intervalSelection === "Week")
      this.database.getDataLastWeek().subscribe(data => this.formatLineChartData(data));
  }
}
