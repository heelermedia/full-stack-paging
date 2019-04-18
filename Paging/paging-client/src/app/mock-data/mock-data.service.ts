import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { MockData } from './mock-data';

@Injectable({
    providedIn: 'root'
})
export class MockDataService {

    constructor(private _http: HttpClient) { }

    public getMockData(pageNumber: number, pageSize: number): Observable<MockData[]> {
        return this._http.get<MockData[]>(`https://localhost:44307/api/data?pageNumber=${pageNumber}&pageSize=${pageSize}`)
            .pipe(map((data: any) => {
                let mockData: MockData[] = data.map((d: any) => new MockData(d));
                return mockData;
            }));
    }
}
