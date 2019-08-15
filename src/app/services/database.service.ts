import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  queryUrl: string = 'http://logger:8086/query?pretty=true&q=SELECT ';
  queryDb: string = 'FROM \"db\".\"autogen\".\"test\" ';
  queryFilter: string = 'GROUP BY time(100s) fill(none) limit 100';
  querySets: string[] = [];

  getSubQuery(): string {
    return `${this.queryUrl}${this.querySets}${this.queryDb}`;
  }

  getFilterString(interval: number, limit: number): string {
    return `GROUP BY time(${interval}s) fill(none) limit ${limit}`;
  }

  getDataActual(dataset: string[]): Observable<any[]> {
    return this.executeQuery('not implemented');
  }

  public getDataLastHour(dataset?: string[]): Observable<any[]> {
    if(dataset != null)   // yes falsy....
      this.addDataFields(dataset);
    return this.executeQuery(`${this.getSubQuery()}WHERE time > now() - 1h ${this.getFilterString(10, 360)}`);
  }

  getDataLastDay(dataset?: string[]): Observable<any[]> {
    if(dataset != null)   // yes falsy....
      this.addDataFields(dataset);
    return this.executeQuery(`${this.getSubQuery()}WHERE time > now() - 1d ${this.getFilterString(60, 1440)}`);
  }

  getDataLastWeek(dataset?: string[]): Observable<any[]> {
    if(dataset != null)   // yes falsy....
      this.addDataFields(dataset);
    return this.executeQuery(`${this.getSubQuery()}WHERE time > now() - 1w ${this.getFilterString(300, 2016)}`);
  }

  getDataOnDay(date: string, dataset?: string[]): Observable<any[]> {
    if(dataset != null)   // yes falsy....
      this.addDataFields(dataset);
    return this.executeQuery(`${this.queryUrl}${this.querySets}${this.queryDb}WHERE time > ${date} ${this.getFilterString(60, 1440)}`);
  }

  addDataFields(datafields: string[]): void {
    datafields.forEach(element => {
      this.addField(element);
    });
  }

  executeQuery(query: string): Observable<any[]> {
    console.log(query);
    return this.http.get(query)
      .pipe(
      map((response: any) => response.results[0].series[0].values)
    );
  }

  addField(field: string): void{
    this.querySets.push(`mean(\"${field}\") AS \"mean_${field}\" `);
  }
}
// 'http://logger:8086/query?pretty=true&q=SELECT mean(\"s1\") AS \"mean_s1\" FROM \"db\".\"autogen\".\"test\" WHERE time > 2019/07/18 GROUP BY time(100s) fill(none) limit 100'