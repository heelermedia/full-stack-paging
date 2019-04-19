import { Injectable } from '@angular/core';

import {
    Router, Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
    ActivatedRoute
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take, map } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { MockDataService } from './mock-data.service';
import { MockData } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockDataResolverService {


    constructor(private _mockDataService: MockDataService,
        private _route: ActivatedRoute,
        private _router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<HttpResponse<MockData[]>> | Observable<Observable<HttpResponse<MockData[]>>> | Promise<Observable<HttpResponse<MockData[]>>> {
        return this._mockDataService.getMockData(route.queryParams.pageNumber, route.queryParams.pageSize).pipe(take(1), mergeMap(mockData => {
            if (mockData) {
                return of(mockData);
            } else {
                this._router.navigate(['/some-not-found-route']);
                return EMPTY;
            }
        }));
    }
}
