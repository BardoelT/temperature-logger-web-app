import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { Observable } from 'rxjs';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isHandset$: Observable<any> = this.breakpointObserer.observe(Breakpoints.HandsetLandscape);

  constructor(private database: DatabaseService, private breakpointObserer: BreakpointObserver) { }

  myData = [];
  columnNames = [];
  myType = "LineChart"
  myOptions = {
    hAxis: {
      format: 'HH:mm'
    }
  }

  formatData(data: any): void {
    console.log(data.values);
    this.columnNames = data.columns;
    this.myData = data.values.map((record: any[]) => {
      record[0] = new Date(Date.parse(record[0]));
      return record;
    });
  }

  ngOnInit(): void {

    this.database.queryDb = 'FROM \"telegraf\".\"autogen\".\"system\" ';
    this.database.setDataFields(['load1', 'load5', 'load15']);
    this.database.getDataLastHour().subscribe(data => this.formatData(data));
  }

  func(data: any): void {
    this.myData = data.values[0].map(record => {
        return [`${data.columns.shift()}`, record];
    });
    this.myData.shift();
  }
  
  updateQuery(opt: string): void {
    console.log(opt);
    this.myData = [];

    if (opt === "Current") {
      this.myType = "Table";
      this.columnNames = [ "Sensor", "Temperature" ];
      this.myData = [];
      this.database.getDataCurrent().subscribe(data => this.func(data));
      return;
    }

    this.myType = "LineChart";
    if (opt === "Hour")
      this.database.getDataLastHour().subscribe(data => this.formatData(data));
    else if (opt === "Day")
      this.database.getDataLastDay().subscribe(data => this.formatData(data));
    else if (opt === "Week")
      this.database.getDataLastWeek().subscribe(data => this.formatData(data));
  }
}
