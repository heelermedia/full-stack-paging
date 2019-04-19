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

    public getMockData(pageNumber: number, pageSize: number): Observable<HttpResponse<MockData[]>> {
        return this._http.get<MockData[]>(`http://localhost:50117/api/data?pageNumber=${pageNumber}&pageSize=${pageSize}`, { observe: 'response' });
    }
}
