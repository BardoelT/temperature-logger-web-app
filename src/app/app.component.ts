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
  columnNames = ["", 'load1', 'load5', 'load15'];
  myOptions = {
    hAxis: {
      format: 'HH:mm'
}
  }

  formatData(data: any): void {
    console.log(data);
    this.myData = data.map((record: any[]) => {
      record[0] = new Date(Date.parse(record[0]));
      return record;
    });
  }

  ngOnInit(): void {
    
    this.database.queryDb = 'FROM \"telegraf\".\"autogen\".\"system\" ';
    this.database.addDataFields(['load1', 'load5', 'load15']);
    this.database.getDataLastHour().subscribe(data => this.formatData(data));


    // this.database.getDataOnDay('2019/07/18', ['s1','s2']).subscribe(data => {
    //   this.lineChartData[0].data = data.map((record: any[]) => record[1]);
    //   this.lineChartData[1].data = data.map((record: any[]) => record[2]);
    //   this.lineChartLabels = data.map((record: any[]) => {
    //     const timeStamp: number = Date.parse(record[0]);
    //     return new Date(timeStamp).toLocaleTimeString('nl-NL');
    //   })
    //   console.log(data);
    // });
  }
  updateQuery(opt: string): void {
    console.log(opt);
    if(opt === "Hour")
      this.database.getDataLastHour().subscribe(data => this.formatData(data));
    else if(opt === "Day")
      this.database.getDataLastDay().subscribe(data => this.formatData(data));
    else if(opt === "Week")
      this.database.getDataLastWeek().subscribe(data => this.formatData(data));
  }
}
