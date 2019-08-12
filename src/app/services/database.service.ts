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

  queryUrl: string = 'http://logger:8086/query?pretty=true&q=SELECT ';
  queryDb: string = ' FROM \"db\".\"autogen\".\"test\" WHERE time > 2019/07/18 GROUP BY time(100s) fill(none) limit 100';

  getData(dataset: string): Observable<any[]> {
    
    var s1: string = this.addField(dataset);
    var query = this.queryUrl.concat(s1, this.queryDb);

    return this.http.get(query)
      .pipe(
        map((response: any) => response.results[0].series[0].values)
      );
  }

  addField(field: string): string{
    return `mean(\"${field}\") AS \"mean_${field}\"`;
  }
}
// 'http://logger:8086/query?pretty=true&q=SELECT mean(\"s1\") AS \"mean_s1\" FROM \"db\".\"autogen\".\"test\" WHERE time > 2019/07/18 GROUP BY time(100s) fill(none) limit 100'