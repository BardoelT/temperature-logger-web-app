import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  queryUrl: string = 'http://logger:8086/query?pretty=true&q=SELECT ';
  queryDb: string = 'FROM \"db\".\"autogen\".\"temperature\" ';
  queryFilter: string = 'GROUP BY time(100s) fill(none) limit 100';
  queryFields: string[] = [];

  getSubQuery(): string {
    return `${this.queryUrl}${this.getStringMeanOfFields()}${this.queryDb}`;
  }

  getFilterString(interval: number, limit: number): string {
    return `GROUP BY time(${interval}s) fill(none) limit ${limit}`;
  }

  getDataCurrent(dataset?: string[]): Observable<any[]> {
    if(dataset != null)   // yes falsy....
      this.setDataFields(dataset);
    return this.executeQuery(`${this.queryUrl}${this.getStringLastOfFields()}${this.queryDb} WHERE time > now() - 30s`);
  }

  public getDataLastHour(dataset?: string[]): Observable<any[]> {
    if(dataset != null)   // yes falsy....
      this.setDataFields(dataset);
    return this.executeQuery(`${this.getSubQuery()}WHERE time > now() - 1h ${this.getFilterString(10, 360)}`);
  }

  getDataLastDay(dataset?: string[]): Observable<any[]> {
    if(dataset != null)   // yes falsy....
      this.setDataFields(dataset);
    return this.executeQuery(`${this.getSubQuery()}WHERE time > now() - 1d ${this.getFilterString(60, 1440)}`);
  }

  getDataLastWeek(dataset?: string[]): Observable<any[]> {
    if(dataset != null)   // yes falsy....
      this.setDataFields(dataset);
    return this.executeQuery(`${this.getSubQuery()}WHERE time > now() - 1w ${this.getFilterString(300, 2016)}`);
  }

  getDataOnDay(date: string, dataset?: string[]): Observable<any[]> {
    if(dataset != null)   // yes falsy....
      this.setDataFields(dataset);
    return this.executeQuery(`${this.queryUrl}${this.getStringMeanOfFields()}${this.queryDb}WHERE time > ${date} ${this.getFilterString(60, 1440)}`);
  }

  setDataFields(datafields: string[]): void {
    this.queryFields = [];
    datafields.forEach(element => {
      this.queryFields.push(element);
    });
  }

  executeQuery(query: string): Observable<any[]> {
    console.log(query);
    return this.http.get(query)
      .pipe(
      map((response: any) => response.results[0].series[0])
    );
  }

  getStringMeanOfFields(): string {
    var ret = this.queryFields.map(element => {
      return `mean(\"${element}\") as \"${element}\"  `;
    });
    return `${ret}`;
  }
  
  getStringLastOfFields(): string {
    var ret = this.queryFields.map(element => {
      return `last(\"${element}\") as \"${element}\" `;
    });
    return `${ret}`;
  }
}
