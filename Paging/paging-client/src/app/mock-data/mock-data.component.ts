import { Component, OnInit } from '@angular/core';
import { PageMetaData } from '../pagination/page-meta-data';
import { Page } from '../pagination/page';
import { MockData } from './mock-data';
import { MockDataService } from './mock-data.service';
import { Subscription } from 'rxjs';
import { PaginationService } from '../pagination/pagination.service';

@Component({
    selector: 'app-mock-data',
    templateUrl: './mock-data.component.html',
    styleUrls: ['./mock-data.component.scss']
})
export class MockDataComponent implements OnInit {

    public mockData: MockData[] = [];

    private selectedPage: Page;
    private pageMetaData: PageMetaData = new PageMetaData();

    private subscriptions: Subscription[] = [];

    //a flag to track if we are initialized or not
    private isInitialized: boolean = false;

    //did a set page command come from the browser if so no need to publish a page change
    private browserAction: boolean = false;

    constructor(private _mockDataService: MockDataService,
        private _pagerService: PaginationService) { }

    public ngOnInit() {

    }

}
