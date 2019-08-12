import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  test: string;
  getData(): Observable<any[]> {
    return this.http.get('http://logger:8086/query?pretty=true&q=SELECT mean(\"s1\") AS \"mean_s1\" FROM \"db\".\"autogen\".\"test\" WHERE time > 2019/07/18 GROUP BY time(100s) fill(none) limit 100')
      .pipe(
        map((response: any) => response.results[0].series[0].values)
      );
  }

  addField(field: string): string{
    return `mean(\"${field}\") AS \"mean_${field}\"`;;
  }
}