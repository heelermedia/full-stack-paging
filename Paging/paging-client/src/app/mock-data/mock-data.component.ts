import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageMetaData } from '../pagination/page-meta-data';
import { Page } from '../pagination/page';
import { MockData } from './mock-data';
import { MockDataService } from './mock-data.service';
import { Subscription } from 'rxjs';
import { PaginationService } from '../pagination/pagination.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-mock-data',
    templateUrl: './mock-data.component.html',
    styleUrls: ['./mock-data.component.scss']
})
export class MockDataComponent implements OnInit, OnDestroy {

    public mockData: MockData[] = [];

    private selectedPage: Page;
    private pageMetaData: PageMetaData = new PageMetaData();

    private subscriptions: Subscription[] = [];

    //a flag to track if we are initialized or not
    private isInitialized: boolean = false;

    //did a set page command come from the browser if so no need to publish a page change
    private browserAction: boolean = false;

    constructor(private _mockDataService: MockDataService,
        private _pagerService: PaginationService,
        private _route: ActivatedRoute,
        private _router: Router) { }

    public ngOnInit() {

        //use the route resolver 
        this.subscriptions.push(this._route.data.subscribe(response => {
            const key = "x-pagination";

            //get the page meta data
            let pmd = JSON.parse(response.mockData.headers.get(key));

            this.pageMetaData.currentPage = pmd.CurrentPage;
            this.pageMetaData.totalPages = pmd.TotalPages;
            this.pageMetaData.pageSize = pmd.PageSize;
            this.pageMetaData.totalCount = pmd.TotalCount;

            //grab the query params
            let qp = this._route.snapshot.queryParams;
             ////get the page number
            let pageNumber: number = (+qp.pageNumber);
            this.onMockDataResponse(response.mockData.body, pageNumber);

        }));

        //subscribe to changes in the query parameters
        this.subscriptions.push(this._route.queryParams.subscribe(params => {
            //don't execute this code until after we are initialized
            //because the route resolver passes in the first set of data
            if (this.isInitialized) {
                //grab the query params
                let qp = this._route.snapshot.queryParams;
                //get the page number
                let pageNumber: number = (+qp.pageNumber);
                //if one of the browsers buttons triggered the navigation
                //then tell the pager what page index was changed via the query string parameter
                if (this.selectedPage && (pageNumber !== this.selectedPage.pageNumber)) {
                    //flag it as a browser action
                    this.browserAction = true;
                    this._pagerService.setFromQueryParameters(pageNumber);
                }
                this.getMockData(pageNumber, +qp.pageSize);

            } else {
                //so set it to true here so the next pager interaction will emit the selected page via
                //the pager service
                this.isInitialized = true;
            }
        }));

        //subscribe to page changes from the pager service
        this.subscriptions.push(this._pagerService.pageSource$.subscribe((page: Page) => {
            //only after the control has initialized shall we execute this code
            //this is becuase if the user refreshes the browser we want the query parameters pageNumber and pageSize
            //to drive the data we fetch to render
            if (this.isInitialized && this.browserAction === false) {
                //set the selected Page
                this.selectedPage = page;
                //create query params nav extras
                let navigationExtras: NavigationExtras = {
                    queryParams: {
                        pageNumber: page.pageNumber,
                        pageSize: 10
                    },
                    relativeTo: this._route
                };
                //navigate without a location to make the route execution absolute
                this._router.navigate([], navigationExtras);
            } else if (this.browserAction) {
                //just set the selected Page in this case
                this.selectedPage = page;
                this.browserAction = false;
            }
        }));

    }

    private onMockDataResponse(mockData: any[], pageNumber: number): void {
        this.mockData = mockData;
        //the first time the page loads this will be false
        if (this.isInitialized === false) {
            //if when we initialize the selected page is undefined 
            //then tell the pager to set the active page
            if (!this.selectedPage) {
                //flag it as a browser action
                this.browserAction = true;
                this._pagerService.setFromQueryParameters(pageNumber);
            }
        }
    }

    private getMockData(pageNumber: number, pageSize: number): void {
        //get a new set of mock data
        this._mockDataService.getMockData(pageNumber, pageSize).subscribe((response: HttpResponse<MockData[]>) => {
            this.onMockDataResponse(response.body, pageNumber);
            //set page meta data
            const key = "x-pagination";
            //this would be done in the route resolver on init
            let pmd = JSON.parse(response.headers.get(key));
            this.pageMetaData.currentPage = pmd.CurrentPage;
            this.pageMetaData.totalPages = pmd.TotalPages;
            this.pageMetaData.pageSize = pmd.PageSize;
            this.pageMetaData.totalCount = pmd.TotalCount;
            //reset everything
            this._pagerService.init();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }
}
