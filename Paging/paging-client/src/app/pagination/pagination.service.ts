import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Page } from './page';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

    constructor() { }

    private pageSource: Subject<Page> = new Subject<Page>();
    private setPageFromQueryParameters: Subject<number> = new Subject<number>();
    public initialize: Subject<void> = new Subject<void>();

    public pageSourceObservable: Observable<Page> = this.pageSource.asObservable();
    public setPageFromQueryParametersObservable: Observable<number> = this.setPageFromQueryParameters.asObservable();
    public initializeObservable: Observable<void> = this.initialize.asObservable();


    public pageChanged(page: Page): void {
        this.pageSource.next(page);
    }

    public setFromQueryParameters(pageIndex: number): void {
        this.setPageFromQueryParameters.next(pageIndex);
    }

    public init(): void {
        this.initialize.next();
    }
}
